'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export default function ProductMore({
  product,
  money,
  relatedSeries = [],
  relatedCategory = [],
}: {
  product: any;
  money: (v: number) => string;
  relatedSeries?: any[];
  relatedCategory?: any[];
}) {
  return (
    <div className="mt-12">
      <div className="grid gap-6 lg:grid-cols-3">
        <Accordion title="Description" defaultOpen>
          <p className="text-stone-700">{product.description}</p>
        </Accordion>
        <Accordion title="Fabric & Care">
          <ul className="list-disc pl-4 text-stone-700">
            <li>{product.materials || 'Premium cotton blend'}</li>
            <li>{product.care || 'Machine wash cold. Tumble dry low.'}</li>
          </ul>
        </Accordion>
        <Accordion title="Shipping & Returns">
          <ul className="list-disc pl-4 text-stone-700">
            <li>Free shipping on orders $75+</li>
            <li>30-day returns and exchanges</li>
            <li>Ships within 1–2 business days</li>
          </ul>
        </Accordion>
      </div>

      {product.seriesId && relatedSeries.length ? (
        <RelatedRail heading={`More from ${pretty(product.seriesId)} Series`} items={relatedSeries} money={money} />
      ) : null}

      {relatedCategory.length ? (
        <RelatedRail heading={`Related in ${pretty(product.categoryId)}`} items={relatedCategory} money={money} />
      ) : null}
    </div>
  );
}

function Accordion({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button className="flex w-full items-center justify-between px-4 py-3 text-left" onClick={() => setOpen((v) => !v)}>
        <span className="font-medium">{title}</span>
        <i className={['fa-solid transition-transform', open ? 'fa-chevron-up' : 'fa-chevron-down'].join(' ')} aria-hidden="true" />
      </button>
      <div className={`grid transition-all ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden px-4 pb-4 text-sm">{children}</div>
      </div>
    </div>
  );
}

function RelatedRail({ heading, items = [], money }: { heading: string; items?: any[]; money: (v: number) => string }) {
  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {heading}
          </h2>
          <p className="text-stone-600 text-sm">Handpicked pieces you might like.</p>
        </div>
        <Link href="/shop?sort=related" className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition">
          Shop all ↗
        </Link>
      </div>

      <div className="my-4 no-scrollbar flex gap-5 overflow-x-auto px-1 py-4">
        {items.map((p: any, idx: number) => (
          <Link
            href="/productdetail"
            key={`${p.title}-${idx}`}
            className="group relative h-[320px] w-[240px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
          >
            <Image src={p.image} alt={p.title} fill sizes="240px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-white text-sm font-medium line-clamp-1">{p.title}</p>
              <p className="text-white/85 text-xs">{money(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function pretty(id: string) {
  return id.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');
}