// Small helpers shared by storefront listing pages (images, prices, links).

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const FALLBACK_IMAGE = '/images/image.png';

// Verified Unsplash apparel shots, used when the API has nothing to show.
export const FALLBACK_GALLERY: string[] = [
  '1521572163474-6864f9cf17ab',
  '1556821840-3a63f95609a7',
  '1503341504253-dff4815485f1',
  '1576566588028-4147f3842f27',
  '1529374255404-311a2a4f1fd9',
  '1620799140408-edc6dcb6d633',
].map((id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`);

/** Turn an API image path into something next/image can load. */
export function resolveImage(url?: string | null, fallback: string = FALLBACK_IMAGE): string {
  if (!url) return fallback;
  // An old admin bug saved some absolute URLs with a leading slash ("/https://...").
  if (/^\/https?:\/\//i.test(url)) return url.slice(1);
  if (url.startsWith('http') || url.startsWith('/images/')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

type ProductLike = {
  _id: string;
  price: number;
  discountedPrice?: number | null;
  thumbnailUrl?: string;
  bannerUrls?: string[];
};

export function productImage(p: ProductLike, index = 0): string {
  const images = [p.thumbnailUrl, ...(p.bannerUrls || [])].filter(Boolean) as string[];
  return resolveImage(images[index] ?? images[0]);
}

/** Price the customer actually pays. */
export function effectivePrice(p: ProductLike): number {
  return p.discountedPrice && p.discountedPrice > 0 && p.discountedPrice < p.price ? p.discountedPrice : p.price;
}

export function isOnSale(p: ProductLike): boolean {
  return effectivePrice(p) < p.price;
}

export function productHref(p: { _id: string }): string {
  return `/productdetail/${p._id}`;
}

// Admin uploads and seeded images are absolute (Vercel Blob); legacy uploads are backend-relative paths.
export function assetUrl(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path) || path.startsWith('/images/')) return path;
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}
