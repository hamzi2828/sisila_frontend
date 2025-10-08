'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function WishlistGrid({
  items = [],
  selected = [],
  toggleSelect,
  remove,
  addToCart,
  money,
}: {
  items?: any[];
  selected?: string[];
  toggleSelect: (id: string) => void;
  remove: (id: string) => void;
  addToCart: (id: string) => void;
  money: (v: number) => string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <p className="text-stone-700">No items in this filter.</p>
        <div className="mt-3 flex justify-center gap-2">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Browse shop
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
          >
            Reset filter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p) => (
        <div
          key={p.id}
          className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 transition hover:shadow-md"
        >
          {/* Select checkbox */}
          <label className="absolute left-2 top-2 z-10 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(p.id)}
              onChange={() => toggleSelect(p.id)}
              className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
            />
          </label>

          {/* Sale badge */}
          {typeof p.compareAt === 'number' && p.compareAt > p.price ? (
            <span className="absolute right-2 top-2 z-10 inline-flex items-center rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-medium text-white">
              -{Math.round(((p.compareAt - p.price) / p.compareAt) * 100)}%
            </span>
          ) : null}

          {/* Image */}
          <Link href="/productdetail" className="block">
            <div className="relative w-full pt-[125%] bg-stone-100">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width:1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                priority
              />
              {p.tag ? (
                <span className="absolute left-2 bottom-2 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900">
                  {p.tag}
                </span>
              ) : null}
            </div>
          </Link>

          {/* Info */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href="/productdetail" className="line-clamp-1 text-sm font-medium hover:underline">
                  {p.title}
                </Link>
                <p className="mt-0.5 text-xs text-stone-600">{p.kind}</p>
              </div>
              <button
                onClick={() => remove(p.id)}
                className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-2 py-1 text-xs hover:bg-stone-50"
                title="Remove"
              >
                <i className="fa-regular fa-trash-can" />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-stone-900">{money(p.price)}</span>{' '}
                {p.compareAt ? (
                  <span className="text-stone-400 line-through">{money(p.compareAt)}</span>
                ) : null}
              </div>
              <StockPill stock={p.stock} />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => addToCart(p.id)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
              >
                <i className="fa-solid fa-cart-plus mr-2" />
                Add to cart
              </button>
              <Link
                href="/productdetail"
                className="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
                title="View"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StockPill({ stock }: { stock?: 'in' | 'low' | 'out' }) {
  if (!stock) return null;
  const map = {
    in: { text: 'In stock', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
    low: { text: 'Low stock', cls: 'bg-amber-50 text-amber-800 ring-amber-200' },
    out: { text: 'Out of stock', cls: 'bg-rose-50 text-rose-800 ring-rose-200' },
  } as const;
  const s = map[stock];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ring-1 ${s.cls}`}>
      <i
        className={[
          'fa-solid',
          stock === 'in' ? 'fa-circle-check' : stock === 'low' ? 'fa-triangle-exclamation' : 'fa-circle-xmark',
        ].join(' ')}
      />
      {s.text}
    </span>
  );
}