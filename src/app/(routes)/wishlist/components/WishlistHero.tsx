'use client';

import Link from 'next/link';

export default function WishlistHero({
  count = 0,
  onShare,
}: {
  count?: number;
  onShare: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Your saves</p>
        <h1
          className="mt-1 text-2xl md:text-3xl font-semibold uppercase"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Wishlist
        </h1>
        <p className="mt-1 text-stone-600">{count} items saved</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onShare}
          className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
        >
          <i className="fa-regular fa-share-from-square mr-2" /> Share
        </button>
        <Link
          href="/cart"
          className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          <i className="fa-solid fa-cart-shopping mr-2" /> Go to Cart
        </Link>
      </div>
    </div>
  );
}