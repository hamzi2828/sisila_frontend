'use client';

import Link from 'next/link';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/formatPrice';

type Props = {
  subtotal: number;
  shipping: number;
  total: number;
  canCheckout: boolean;
};

const money = (v: number) => formatPrice(v);

export default function CartSummary({ subtotal, shipping, total, canCheckout }: Props) {
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 transition-shadow duration-200 hover:shadow-sm">
      <h4 className="text-base font-semibold">Summary</h4>
      <div className="mt-3 space-y-2 text-sm">
        <Row label="Subtotal" value={money(subtotal)} />
        <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
        <div className="border-t pt-2">
          <Row label="Total" value={money(total)} bold />
        </div>
      </div>

      <p className="mt-3 text-xs text-stone-600">
        {remainingForFreeShipping > 0
          ? `Add ${money(remainingForFreeShipping)} more for free shipping.`
          : `Free shipping on orders over ${money(FREE_SHIPPING_THRESHOLD)}.`}
      </p>

      <Link
        href="/checkout"
        className={[
          'mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 active:scale-[0.98]',
          canCheckout ? 'bg-black hover:bg-stone-800' : 'bg-stone-400 pointer-events-none',
        ].join(' ')}
      >
        Checkout
      </Link>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-600">{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{value}</span>
    </div>
  );
}