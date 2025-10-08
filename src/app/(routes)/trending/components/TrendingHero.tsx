'use client';

import Link from 'next/link';

export default function TrendingHero({ tags = [] }: { tags?: string[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
      <div className="p-8 md:p-12 lg:p-16">
        <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">Popular</p>
        <h1
          className="mt-2 text-3xl md:text-5xl font-semibold uppercase"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Trending Now
        </h1>
        <p className="mt-2 text-white/80 max-w-xl">
          Most-loved styles from the last 7 days — as seen on the feed.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100"
          >
            Shop all
          </Link>
        </div>
      </div>
    </div>
  );
}