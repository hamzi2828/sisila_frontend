'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FALLBACK_GALLERY } from '@/lib/productMedia';
import type { TrendingItem } from '../types';

export default function TrendingCreators({ items = [] }: { items?: TrendingItem[] }) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h3
            className="text-xl md:text-2xl font-semibold uppercase"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Creators wearing Silsila
          </h3>
        <p className="text-stone-600">Community looks — tagged on the feed.</p>
        </div>
        <Link
          href="/lookbook"
          className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
        >
          See editorial
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Link
            key={i}
            href={items[i]?.href || '/shop'}
            className="relative block h-64 overflow-hidden rounded-2xl ring-1 ring-stone-200 bg-white"
          >
            <Image
              src={items[i]?.detailImage || FALLBACK_GALLERY[i] || '/images/image.png'}
              alt={items[i] ? `${items[i].title} styled` : 'Silsila look'}
              fill
              sizes="(max-width:1024px) 50vw, 25vw"
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}