'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/formatPrice';
import type { TrendingItem } from '../types';

export default function TrendingGrid({ items = [] }: { items?: TrendingItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <Link
          key={`${p.id}-grid`}
          href={p.href}
          className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 hover:shadow-md transition"
        >
          <div className="relative w-full pt-[125%]">
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(max-width:1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="shrink-0 text-sm text-stone-700">
                {p.compareAt ? (
                  <span className="mr-1.5 text-xs text-stone-400 line-through">{formatPrice(p.compareAt)}</span>
                ) : null}
                {formatPrice(p.price)}
              </p>
            </div>
            <p className="mt-1 text-xs text-stone-500">{p.tag}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}