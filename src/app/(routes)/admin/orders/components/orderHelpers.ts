import type { Order, OrderItem } from "../types";

export const FALLBACK_PRODUCT_IMAGE = "/images/image.png";

export function getCustomerName(order: Order): string {
  return order.user
    ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() || "Unknown Customer"
    : order.shippingAddress?.fullName || "Unknown Customer";
}

export function getCustomerEmail(order: Order): string {
  return order.user?.email || order.shippingAddress?.email || "";
}

/** Resolves an order item's product image to an absolute URL (backend paths are relative). */
export function getItemImage(item: OrderItem | undefined): string {
  const product = item && typeof item.product === "object" ? item.product : null;
  const rawImage = product?.primaryImageUrl || product?.thumbnailUrl || product?.images?.[0];
  if (!rawImage) return FALLBACK_PRODUCT_IMAGE;
  return rawImage.startsWith("http") ? rawImage : `${process.env.NEXT_PUBLIC_BACKEND_URL}${rawImage}`;
}

export function getItemName(item: OrderItem, index: number): string {
  const product = typeof item.product === "object" ? item.product : null;
  return product?.name || `Product ${index + 1}`;
}

export function getItemCount(order: Order): number {
  return (order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function capitalize(value?: string | null): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
