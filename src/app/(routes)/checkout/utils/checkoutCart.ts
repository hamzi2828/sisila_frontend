// Shared cart loading + totals for the checkout steps (shipping, payment, review),
// so every step shows the same items and the same numbers.
import { getAuthToken, isAuthenticated } from '@/helper/helper';
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_FEE } from '@/lib/formatPrice';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type ShippingMethod = 'standard' | 'express';

// Express delivery fee in PKR. Placeholder value - confirm with the store owner.
export const EXPRESS_SHIPPING_FEE = 500;

export function standardShippingFee(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

export function calcShipping(subtotal: number, method: ShippingMethod | undefined): number {
  if (subtotal === 0) return 0;
  return method === 'express' ? EXPRESS_SHIPPING_FEE : standardShippingFee(subtotal);
}

export type CheckoutCartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  variant?: {
    color?: string;
    size?: string;
  };
};

type BackendVariant = {
  _id?: string;
  variantId?: string;
  color?: string;
  size?: string;
  price: number;
  discountedPrice?: number;
  sku?: string;
};

export type BackendCartProduct = {
  _id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  bannerUrls?: string[];
  productType?: string;
  colorMedia?: {
    [color: string]: {
      thumbnailUrl: string;
      bannerUrls: string[];
    };
  };
  variants?: BackendVariant[];
};

export type BackendCartItemShape = {
  productId: BackendCartProduct;
  quantity: number;
  variant?: {
    variantId?: string;
    variantSku?: string;
    color?: string;
    size?: string;
    price?: number;
  };
  _id?: string;
};

type LocalCartItem = {
  productId: string;
  productName: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  variant?: {
    variantId?: string;
    color?: string;
    size?: string;
    price?: number;
  };
  thumbnailUrl?: string;
};

function absoluteUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/images/')) return path;
  return `${API_BASE_URL}${path}`;
}

function findVariant(product: BackendCartProduct, variantId?: string): BackendVariant | undefined {
  if (!variantId || !product.variants) return undefined;
  return product.variants.find((v) => v.variantId === variantId || v._id === variantId);
}

// Price for a backend cart line, matching what is sent to payment.
export function backendItemUnitPrice(item: BackendCartItemShape): number {
  const product = item.productId;
  const variant = findVariant(product, item.variant?.variantId);
  if (variant) return variant.discountedPrice || variant.price;
  return item.variant?.price || product.discountedPrice || product.price;
}

export function mapBackendCartItem(item: BackendCartItemShape): CheckoutCartItem {
  const product = item.productId;
  const variant = findVariant(product, item.variant?.variantId);

  let image = '';
  if (product.colorMedia && Object.keys(product.colorMedia).length > 0) {
    if (variant?.color && product.colorMedia[variant.color]) {
      image = product.colorMedia[variant.color].thumbnailUrl;
    }
    if (!image) {
      const firstColor = Object.keys(product.colorMedia)[0];
      image = product.colorMedia[firstColor]?.thumbnailUrl || '';
    }
  }
  if (!image) {
    image = product.thumbnailUrl || product.bannerUrls?.[0] || '';
  }

  const color = variant?.color || item.variant?.color;
  const size = variant?.size || item.variant?.size;

  return {
    id: item._id || product._id,
    productId: product._id,
    title: product.name,
    price: backendItemUnitPrice(item),
    image: absoluteUrl(image) || '/images/image.png',
    qty: item.quantity,
    variant: color || size ? { color, size } : undefined,
  };
}

function mapLocalCartItem(item: LocalCartItem, index: number): CheckoutCartItem {
  const color = item.variant?.color;
  const size = item.variant?.size;
  return {
    id: `${item.productId}-${item.variant?.variantId || index}`,
    productId: item.productId,
    title: item.productName,
    price: item.variant?.price || item.discountedPrice || item.price,
    image: absoluteUrl(item.thumbnailUrl) || '/images/image.png',
    qty: item.quantity,
    variant: color || size ? { color, size } : undefined,
  };
}

export function loadLocalCart(): CheckoutCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return [];
    const parsed: LocalCartItem[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(mapLocalCartItem) : [];
  } catch {
    return [];
  }
}

export async function fetchBackendCartItems(): Promise<BackendCartItemShape[]> {
  const token = getAuthToken();
  if (!token) return [];
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch cart: ${response.status}`);
  const data = await response.json();
  const items: BackendCartItemShape[] = data?.success && Array.isArray(data.data?.items) ? data.data.items : [];
  // Skip lines whose product was not populated (deleted products)
  return items.filter((i) => i && i.productId && typeof i.productId === 'object');
}

// Logged-in users: GET /api/cart. Guests (or if the API fails): localStorage 'cart'.
export async function loadCheckoutCart(): Promise<CheckoutCartItem[]> {
  if (!isAuthenticated()) return loadLocalCart();
  try {
    const items = await fetchBackendCartItems();
    return items.map(mapBackendCartItem);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return loadLocalCart();
  }
}
