'use client';

import Link from 'next/link';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/formatPrice';

export default function EmptyState() {
  return (
    <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-10 text-center">
      <i className="fa-solid fa-bag-shopping text-3xl text-stone-400" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold">Your bag is empty</h2>
      <p className="mt-1 text-sm text-stone-600">
        Browse the collection and add something you love.
      </p>
      <Link
        href="/shop"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
      >
        Continue shopping
      </Link>
      <p className="mt-4 text-xs text-stone-500">
        Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
      </p>
    </div>
  );
}
