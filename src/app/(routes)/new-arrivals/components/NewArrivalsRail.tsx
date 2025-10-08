'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NewArrivalsRail({ items = [] }: { items?: any[] }) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Shop the Drop
          </h3>
          <p className="text-stone-600">Handpicked selects from this release.</p>
        </div>
        <Link href="/shop" className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50">
          Shop all ↗
        </Link>
      </div>

      <div className="mt-4 no-scrollbar flex gap-5 overflow-x-auto px-1 py-2">
        {items.map((p, idx) => (
          <Link
            key={`rail-${p.id}`}
            href="/productdetail"
            className="group relative h-[300px] w-[220px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
          >
            <Image src={p.image} alt={p.title} fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" priority={idx < 2} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-white text-sm font-medium">{p.title}</p>
              <p className="text-white/85 text-xs">${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}