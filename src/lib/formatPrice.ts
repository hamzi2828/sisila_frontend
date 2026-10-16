// Store currency: Pakistani Rupee. All storefront prices go through this formatter.
export const CURRENCY_CODE = 'PKR';

const formatter = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

export function formatPrice(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? Number(value) : value;
  if (n === null || n === undefined || Number.isNaN(n)) return 'Rs 0';
  return `Rs ${formatter.format(Math.round(n))}`;
}

// Orders at or above this subtotal ship free; below it a flat fee applies.
export const FREE_SHIPPING_THRESHOLD = 5000;
export const FLAT_SHIPPING_FEE = 250;
