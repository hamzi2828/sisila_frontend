'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SearchResults({ items = [] }: { items?: any[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p: any, i: number) => (
        <Link
          key={p.id}
          href={p.href}
          className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
        >
          <div className="relative w-full pt-[125%]">
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(max-width:1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority={i < 4}
            />
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-sm text-stone-700">${p.price}</p>
            </div>
            {p.tag ? <p className="mt-1 text-xs text-stone-500">{p.tag}</p> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}