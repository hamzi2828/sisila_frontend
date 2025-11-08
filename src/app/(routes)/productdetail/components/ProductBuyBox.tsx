'use client';

import Link from 'next/link';

export default function ProductBuyBox({
  product,
  money,
  color,
  setColor,
  size,
  setSize,
}: {
  product: any;
  money: (v: number) => string;
  color: string | undefined;
  setColor: (v: string) => void;
  size: string | undefined;
  setSize: (v: string) => void;
}) {
  const inStock = product.stock !== 'out';

  const pretty = (id: string) =>
    id.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');

  return (
    <div className="rounded-3xl ring-1 ring-stone-200/70 bg-white/70 p-6 supports-[backdrop-filter]:bg-white/50 backdrop-blur">
      <h1 className="text-2xl md:text-3xl font-semibold">{product.title}</h1>

      <div className="mt-1 flex items-center gap-3">
        {typeof product.rating === 'number' ? (
          <div className="flex items-center gap-1 text-amber-500">
            <i className="fa-solid fa-star" aria-hidden="true" />
            <span className="text-sm text-stone-700">{product.rating.toFixed(1)}</span>
            {product.reviews ? <span className="text-sm text-stone-500">({product.reviews})</span> : null}
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xl">{money(product.price)}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span
          className={[
            'inline-flex items-center gap-2 rounded-full px-3 py-1',
            product.stock === 'low'
              ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
              : product.stock === 'out'
              ? 'bg-rose-50 text-rose-800 ring-1 ring-rose-200'
              : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
          ].join(' ')}
        >
          <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
          {product.stock === 'low' ? 'Low stock' : product.stock === 'out' ? 'Out of stock' : 'In stock'}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-stone-700 ring-1 ring-stone-200">
          <i className="fa-solid fa-truck" aria-hidden="true" /> Free shipping $75+
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-stone-700 ring-1 ring-stone-200">
          <i className="fa-solid fa-shield-halved" aria-hidden="true" /> 30-day returns
        </span>
      </div>

      {product.colors?.length ? (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600">Color</p>
            {color ? <p className="text-sm text-stone-800">{color}</p> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((c: string) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
                className={['h-9 w-9 rounded-full ring-2 transition', color === c ? 'ring-stone-900' : 'ring-transparent hover:ring-stone-400'].join(' ')}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {product.sizes?.length ? (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600">Size</p>
            <Link href="#" className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
              Size guide
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s: string) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={['min-w-[3rem] rounded-xl border px-3 py-2 text-sm', size === s ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 hover:bg-stone-50'].join(' ')}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <Link href="/cart" className="flex-1">
          <button
            disabled={product.stock === 'out'}
            className={['inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition', product.stock === 'out' ? 'opacity-60' : 'hover:bg-stone-800'].join(' ')}
          >
            Add to bag
          </button>
        </Link>
        <button aria-label="Wishlist" className="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white p-3 hover:bg-stone-50" title="Add to wishlist">
          <i className="fa-regular fa-heart" aria-hidden="true" />
        </button>
        <button aria-label="Share" className="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white p-3 hover:bg-stone-50" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); } catch {} }} title="Share">
          <i className="fa-solid fa-share-nodes" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Part of</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Pill label={`Category: ${pretty(product.categoryId)}`} />
          {product.seriesId ? (
            <Pill label={`Series: ${pretty(product.seriesId)}`} />
          ) : product.themeId && product.themeId !== 'general' ? (
            <Pill label={`Theme: ${pretty(product.themeId)}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PillLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1 text-sm hover:bg-stone-50">
      {label}
    </a>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1 text-sm">
      {label}
    </span>
  );
}

function pretty(id: string) {
  return id.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');
}