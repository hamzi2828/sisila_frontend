'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TrendingHighlightRail({ items = [] }: { items?: any[] }) {
  return (
    <div className="no-scrollbar flex gap-5 overflow-x-auto">
      {items.map((p, i) => (
        <Link
          key={p.id}
          href="/productdetail"
          className="group relative h-[320px] w-[240px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 hover:shadow-md transition"
        >
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="240px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={i < 3}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="text-white text-sm font-medium">{p.title}</p>
            <p className="text-white/85 text-xs">
              ${p.price} • {p.tag}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}