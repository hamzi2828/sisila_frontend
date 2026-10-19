// Image preparation for admin uploads (Blogs, Blog Settings, Hero Slides).
//
// The backend runs on Vercel, which rejects request bodies over ~4.5 MB, so every
// image goes through `prepareImage` (the shared `compressImage`) before it is put
// into a FormData body.
import { compressImage, formatBytes } from '@/lib/compressImage';

export { formatBytes };

/** Largest single image we send. Leaves room for the other form fields under Vercel's 4.5 MB cap. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
/** Whole request budget (Vercel limit is ~4.5 MB; keep a margin for multipart overhead). */
export const MAX_REQUEST_BYTES = Math.floor(4.4 * 1024 * 1024);
/** Biggest original we accept from the picker; it is shrunk before upload. */
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

/** Returns an error message when the picked file can't be used, otherwise null. */
export function validateImageFile(file: File): string | null {
  // Some phones report HEIC photos with an empty type; let the compressor try those.
  if (file.type && !file.type.startsWith('image/')) return 'Please choose an image file (JPG, PNG or WebP).';
  if (file.size > MAX_SOURCE_BYTES) return `That image is ${formatBytes(file.size)}. Choose one under ${formatBytes(MAX_SOURCE_BYTES)}.`;
  return null;
}

/**
 * Makes an image safe to upload: resizes (longest edge 2000px) and re-encodes large
 * photos to roughly 900 KB. Small images, SVGs and GIFs are returned unchanged.
 * Throws an Error with a readable message when the file can't be used.
 */
export async function prepareImage(file: File): Promise<File> {
  return compressImage(file);
}

/** Message for an image that is still too big after preparation, otherwise null. */
export function oversizeMessage(file: File, label = 'Image'): string | null {
  if (file.size <= MAX_UPLOAD_BYTES) return null;
  return `${label} is ${formatBytes(file.size)}, the upload limit is ${formatBytes(MAX_UPLOAD_BYTES)}. Use a smaller image.`;
}

function dataUriToFile(dataUri: string, index: number): File | null {
  const match = /^data:(image\/[a-z0-9.+-]+);base64,(.*)$/i.exec(dataUri);
  if (!match) return null;
  const [, mime, b64] = match;
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    const ext = mime.split('/')[1]?.replace('+xml', '') || 'img';
    return new File([bytes], `inline-${index}.${ext}`, { type: mime });
  } catch {
    return null;
  }
}

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Images pasted or dropped into the rich-text editor are stored inline as base64
 * data URIs inside the blog content. Shrink them the same way as uploaded files so
 * one phone photo can't push the request over the server limit.
 */
export async function compressInlineImages(html: string): Promise<string> {
  if (!html || !html.includes('data:image/')) return html;
  const uris = Array.from(new Set(html.match(/data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+/gi) || []));
  let result = html;
  for (let i = 0; i < uris.length; i += 1) {
    const uri = uris[i];
    const file = dataUriToFile(uri, i);
    if (!file || file.type === 'image/svg+xml' || file.type === 'image/gif') continue;
    try {
      const prepared = await prepareImage(file);
      if (prepared !== file && prepared.size < file.size) {
        const smaller = await fileToDataUri(prepared);
        result = result.split(uri).join(smaller);
      }
    } catch (error) {
      console.error('Could not shrink an inline image:', error);
    }
  }
  return result;
}

/** Approximate size of a multipart body made of these strings and files. */
export function estimateRequestBytes(parts: Array<string | File | null | undefined>): number {
  return parts.reduce<number>((total, part) => {
    if (!part) return total;
    if (typeof part === 'string') return total + new Blob([part]).size + 100;
    return total + part.size + 200;
  }, 0);
}
