'use client';

import Link from 'next/link';

export default function ShopHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">All Products</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Shop
        </h1>
        <p className="mt-2 text-white/80">Culturally-inspired apparel — daily-wear silhouettes and considered graphics.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/new-arrivals" className={pill(true)}>New Arrivals</Link>
          <Link href="/trending" className={pill()}>Trending</Link>
        </div>
      </div>
    </div>
  );
}

function pill(highlight = false) {
  return [
    'inline-flex items-center rounded-full px-4 py-2 text-sm transition',
    highlight ? 'bg-white text-stone-900 font-medium' : 'border border-white/40 bg-white/10 text-white hover:bg-white/15',
  ].join(' ');
}