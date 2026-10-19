// Client-side image optimisation for admin uploads.
//
// The API runs as a Vercel serverless function, and Vercel rejects any request body over 4.5 MB
// (413 FUNCTION_PAYLOAD_TOO_LARGE) before our code runs, without CORS headers, so the browser
// only sees a "Network Error". A single phone photo can be larger than that, so images are resized
// and re-encoded in the browser before they are posted, and the whole upload is kept under budget.
//
// Usage:
//   const [thumb, ...banners] = await prepareImagesForUpload([thumbFile, ...bannerFiles]);
//   const small = await compressImage(file); // single file, default limits

/** Hard limit Vercel enforces on a whole request body. */
export const VERCEL_BODY_LIMIT_BYTES = 4.5 * 1024 * 1024;
/** Budget for all images in one request, leaving room for text fields and multipart overhead. */
export const DEFAULT_UPLOAD_BUDGET_BYTES = Math.floor(3.8 * 1024 * 1024);
/** Backend per-file limit (multer, UPLOAD_MAX_FILE_SIZE_MB, default 5 MB). */
export const SERVER_MAX_FILE_BYTES = 5 * 1024 * 1024;
/** Image types the backend accepts. */
export const SUPPORTED_UPLOAD_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

const DEFAULT_MAX_DIMENSION = 2000;
const DEFAULT_MAX_BYTES = 900 * 1024;
const DEFAULT_QUALITY = 0.85;
const MIN_QUALITY = 0.6;
const MIN_DIMENSION = 800;
const DEFAULT_SKIP_BELOW_BYTES = 300 * 1024;
const MIN_PER_FILE_BYTES = 150 * 1024;

export interface CompressImageOptions {
  /** Longest edge in pixels after resizing (default 2000). */
  maxDimension?: number;
  /** Target size per file; quality, then dimensions, are lowered until it fits (default 900 KB). */
  maxBytes?: number;
  /** Starting encoder quality for JPEG/WebP (default 0.85). */
  quality?: number;
  /** Files already this small and within maxDimension are sent untouched (default 300 KB). */
  skipBelowBytes?: number;
}

/** Error with a message that is safe to show to the admin as-is. */
export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

type DecodedImage = { source: CanvasImageSource; width: number; height: number; close: () => void };

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      // Fall back to <img>, which some browsers decode more formats with (e.g. HEIC on Safari)
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

function renameWithExtension(name: string, mime: string): string {
  const ext = mime === 'image/webp' ? 'webp' : mime === 'image/png' ? 'png' : 'jpg';
  const base = (name || 'image').replace(/\.[^./\\]+$/, '') || 'image';
  return `${base}.${ext}`;
}

// Re-submitting a form should not re-encode the same photos again
const cache = new WeakMap<File, { maxBytes: number; maxDimension: number; result: File }>();

/**
 * Resize (longest edge <= maxDimension) and re-encode an image so it uploads quickly and stays small.
 * - JPEG and opaque images become JPEG; images with transparency become WebP (PNG where WebP
 *   encoding is unavailable), so cut-out product shots keep their transparent background.
 * - SVG and GIF (vector / possibly animated) are returned unchanged.
 * - Throws ImageUploadError with a readable message when the file cannot be used.
 */
export async function compressImage(file: File, options: CompressImageOptions = {}): Promise<File> {
  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const startQuality = options.quality ?? DEFAULT_QUALITY;
  const skipBelowBytes = Math.min(options.skipBelowBytes ?? DEFAULT_SKIP_BELOW_BYTES, maxBytes);
  const label = file.name ? `"${file.name}"` : 'This file';
  const type = (file.type || '').toLowerCase();

  if (type && !type.startsWith('image/')) {
    throw new ImageUploadError(`${label} is not an image. Please choose a JPG, PNG or WebP image.`);
  }

  if (type === 'image/svg+xml' || type === 'image/gif') {
    if (file.size > SERVER_MAX_FILE_BYTES) {
      throw new ImageUploadError(
        `${label} is ${formatBytes(file.size)}. GIF and SVG images must be under ${formatBytes(SERVER_MAX_FILE_BYTES)}.`
      );
    }
    return file;
  }

  const cached = cache.get(file);
  if (cached && cached.maxDimension <= maxDimension && cached.result.size <= maxBytes) return cached.result;

  let decoded: DecodedImage;
  try {
    decoded = await decodeImage(file);
  } catch {
    if (SUPPORTED_UPLOAD_TYPES.has(type) && file.size <= maxBytes) return file;
    const isHeic = /heic|heif/.test(type) || /\.(heic|heif)$/i.test(file.name);
    throw new ImageUploadError(
      isHeic
        ? `${label} is a HEIC photo, which this browser cannot convert. Please export it as JPG or PNG and try again.`
        : `${label} could not be read as an image. Please use a JPG, PNG or WebP image.`
    );
  }

  try {
    const { width, height } = decoded;
    if (!width || !height) throw new ImageUploadError(`${label} could not be read as an image.`);

    const longest = Math.max(width, height);
    let scale = Math.min(1, maxDimension / longest);

    // Already small enough: keep the original bytes (no quality loss)
    if (scale === 1 && file.size <= skipBelowBytes && SUPPORTED_UPLOAD_TYPES.has(type)) return file;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new ImageUploadError('Your browser could not process images. Please try another browser.');

    let quality = startQuality;
    let outType: string | null = null;
    let blob: Blob | null = null;

    for (let attempt = 0; attempt < 10; attempt++) {
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(decoded.source, 0, 0, w, h);

      if (!outType) {
        // JPEG sources can never be transparent; check other formats once at the first size
        const transparent = type !== 'image/jpeg' && hasTransparency(ctx, w, h);
        outType = transparent ? 'image/webp' : 'image/jpeg';
      }

      if (outType === 'image/jpeg') {
        // JPEG has no alpha channel: paint any transparent pixels white instead of black
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
      }

      blob = await canvasToBlob(canvas, outType, quality);
      if (outType === 'image/webp' && blob && blob.type !== 'image/webp') {
        outType = 'image/png'; // Browser cannot encode WebP (older Safari): keep transparency as PNG
        blob = await canvasToBlob(canvas, outType, quality);
      }
      if (!blob) throw new ImageUploadError(`${label} could not be compressed. Please try a different image.`);
      if (blob.size <= maxBytes) break;

      const lossy = outType !== 'image/png';
      if (lossy && quality - 0.1 >= MIN_QUALITY - 1e-9) {
        quality = Math.round((quality - 0.1) * 100) / 100;
      } else if (Math.max(w, h) * 0.8 >= MIN_DIMENSION) {
        scale *= 0.8;
      } else {
        break; // As small as we are willing to go; the caller checks the total budget
      }
    }

    if (!blob) return file;

    // Re-encoding did not help and the original is already acceptable: keep the original
    if (blob.size >= file.size && scale === 1 && SUPPORTED_UPLOAD_TYPES.has(type)) return file;

    const result = new File([blob], renameWithExtension(file.name, blob.type || outType || 'image/jpeg'), {
      type: blob.type || outType || 'image/jpeg',
      lastModified: Date.now(),
    });
    cache.set(file, { maxBytes, maxDimension, result });
    return result;
  } finally {
    decoded.close();
  }
}

export interface PrepareImagesOptions extends CompressImageOptions {
  /** Total bytes allowed for all files in one request (default 3.8 MB, under Vercel's 4.5 MB). */
  budgetBytes?: number;
}

/**
 * Compress several images that will be sent in ONE request so their total stays under budget.
 * The per-file target shrinks as more files are added. Returns files in the same order.
 * Throws ImageUploadError (readable message) if a file is unusable or the total is still too big.
 */
export async function prepareImagesForUpload(files: File[], options: PrepareImagesOptions = {}): Promise<File[]> {
  if (!files.length) return [];
  const { budgetBytes = DEFAULT_UPLOAD_BUDGET_BYTES, ...compressOptions } = options;
  const perFile = Math.max(
    MIN_PER_FILE_BYTES,
    Math.min(compressOptions.maxBytes ?? DEFAULT_MAX_BYTES, Math.floor(budgetBytes / files.length))
  );

  const out: File[] = [];
  for (const file of files) {
    // One at a time: decoding several 12-megapixel photos at once can exhaust memory on phones
    out.push(await compressImage(file, { ...compressOptions, maxBytes: perFile }));
  }

  const total = out.reduce((sum, f) => sum + f.size, 0);
  if (total > budgetBytes) {
    throw new ImageUploadError(
      `The ${files.length} images add up to ${formatBytes(total)} even after compression, more than the ` +
        `${formatBytes(budgetBytes)} that can be uploaded in one save. Remove some images and save, ` +
        `then add the rest by editing the product.`
    );
  }
  return out;
}
