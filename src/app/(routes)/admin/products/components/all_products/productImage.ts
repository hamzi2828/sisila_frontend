import type { Product } from "../AllProducts";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

/**
 * Turns a stored image path into something <Image> can load.
 * - absolute (http/https/blob/data) URLs are returned as-is (Vercel Blob URLs are absolute)
 * - relative paths ("/uploads/x.jpg") are prefixed with NEXT_PUBLIC_BACKEND_URL
 * - malformed values such as "/https://..." or "http://api/https://..." keep the last absolute URL
 */
export function resolveImageUrl(raw?: string | null): string | null {
  if (!raw || typeof raw !== "string") return null;
  const url = raw.trim();
  if (!url) return null;

  const lastAbsolute = Math.max(url.lastIndexOf("http://"), url.lastIndexOf("https://"));
  if (lastAbsolute > 0) return url.slice(lastAbsolute);
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;

  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Best display image for a product (single or variant):
 * thumbnail -> first banner -> first colour thumbnail/banner -> legacy `image`.
 */
export function getProductImage(product: Product): string | null {
  const candidates: (string | undefined)[] = [product.thumbnailUrl, product.bannerUrls?.[0]];

  if (product.colorMedia) {
    for (const media of Object.values(product.colorMedia)) {
      candidates.push(media?.thumbnailUrl, media?.bannerUrls?.[0]);
    }
  }
  candidates.push(product.image);

  for (const candidate of candidates) {
    const resolved = resolveImageUrl(candidate);
    if (resolved) return resolved;
  }
  return null;
}

/** Unique colour names used by a variant product, in order of first appearance. */
export function getVariantColors(product: Product): string[] {
  return Array.from(new Set((product.variants ?? []).map((v) => v.color).filter(Boolean)));
}

/** Price label: "Rs 3,299" or "Rs 3,299 – Rs 3,699" for variant ranges. */
export function getPriceRange(product: Product): { min: number; max: number } | null {
  const prices = (product.variants ?? [])
    .map((v) => Number(v.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (product.productType !== "variant" || prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** "theme" + "uplifting-culture" -> "Uplifting culture" */
export function formatCollectionId(id?: string): string {
  if (!id) return "";
  const s = id.replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
