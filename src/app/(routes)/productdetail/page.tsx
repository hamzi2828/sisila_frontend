'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CategoryId =
  | 'poetry'
  | 'witty'
  | 'fun'
  | 'artistic'
  | 'creative'
  | 'minimal'
  | 'street'
  | 'retro'
  | 'nature'
  | 'typography';

type ThemeId =
  | 'southeastern-hymns'
  | 'artistic-passion'
  | 'echoes-of-the-winds'
  | 'uplifting-culture';

type SeriesId = 'poets' | 'alphabets' | 'cinema' | 'anime';

type Product = {
  title: string;
  price: number;
  rating?: number;
  reviews?: number;
  images: string[];
  badges?: ('New' | 'Limited' | 'Drop')[];
  colors?: string[];
  sizes?: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  stock?: 'in' | 'low' | 'out';
  categoryId: CategoryId;
  themeId: ThemeId;
  seriesId?: SeriesId;
  description: string;
  materials?: string;
  care?: string;
};

// Simple currency formatter
const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

// Single example product (static page)
const PRODUCT: Product = {
  title: 'Verses Tee',
  price: 38,
  rating: 4.6,
  reviews: 128,
  images: [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80',
  ],
  badges: ['New'],
  colors: ['#111111', '#6b7280', '#f5f5f5'],
  sizes: ['S', 'M', 'L', 'XL'],
  stock: 'in',
  categoryId: 'poetry',
  themeId: 'southeastern-hymns',
  seriesId: 'poets',
  description:
    'An homage to timeless verses — soft handfeel, relaxed fit, and serif typographic front hit.',
  materials: '100% Combed Cotton, 6.5 oz jersey',
  care: 'Machine wash cold with like colors. Tumble dry low. Do not iron print.',
};

// Simple related lists (static)
const RELATED_SERIES: { title: string; price: number; image: string }[] = [
  {
    title: 'Ink & Verse Tee',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Margins Crew',
    price: 66,
    image:
      'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Quiet Reader LS',
    price: 58,
    image:
      'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80',
  },
];

const RELATED_CATEGORY: { title: string; price: number; image: string }[] = [
  {
    title: 'Sonnet Crew',
    price: 62,
    image:
      'https://images.unsplash.com/photo-1520975922284-c0d7a98f3f6b?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Prose Cap',
    price: 28,
    image:
      'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Haiku Tote',
    price: 32,
    image:
      'https://images.unsplash.com/photo-1494869042583-f6c911f04b4e?auto=format&fit=crop&w=1400&q=80',
  },
];

export default function ProductDetailPage() {
  const product = PRODUCT;

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors?.[0]);
  const [size, setSize] = useState(product.sizes?.[1] || product.sizes?.[0]);
  const inStock = product.stock !== 'out';

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <div className="px-6 md:px-10 lg:px-20 pt-6">
        <div className="mx-auto ">
          {/* Breadcrumbs */}
          <nav className="text-sm text-stone-500">
            <Link href="/" className="hover:text-stone-800">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/categories#${product.categoryId}`} className="hover:text-stone-800 capitalize">
              {pretty(product.categoryId)}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-stone-800">{product.title}</span>
          </nav>

          {/* Main grid */}
          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            {/* Gallery */}
            <section className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-stone-200/70 bg-white">
                <div className="relative h-[56vw] max-h-[620px] w-full">
                  <Image
                    src={product.images[activeImage]}
                    alt={`${product.title} image ${activeImage + 1}`}
                    fill
                    sizes="(max-width:1024px) 100vw, 60vw"
                    className="object-cover"
                    priority
                  />
                  {product.badges?.length ? (
                    <div className="absolute left-4 top-4 flex gap-2">
                      {product.badges.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="mt-3 no-scrollbar flex gap-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={[
                      'relative h-20 w-16 overflow-hidden rounded-xl ring-1 transition',
                      i === activeImage ? 'ring-stone-900' : 'ring-stone-200 hover:ring-stone-300',
                    ].join(' ')}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt={`thumb ${i + 1}`} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            </section>

            {/* Buy box */}
            <aside className="lg:col-span-5">
              <div className="rounded-3xl ring-1 ring-stone-200/70 bg-white/70 p-6 supports-[backdrop-filter]:bg-white/50 backdrop-blur">
                <h1 className="text-2xl md:text-3xl font-semibold">{product.title}</h1>

                <div className="mt-1 flex items-center gap-3">
                  {typeof product.rating === 'number' ? (
                    <div className="flex items-center gap-1 text-amber-500">
                      <i className="fa-solid fa-star" aria-hidden="true" />
                      <span className="text-sm text-stone-700">{product.rating.toFixed(1)}</span>
                      {product.reviews ? (
                        <span className="text-sm text-stone-500">({product.reviews})</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <p className="mt-3 text-xl">{money(product.price)}</p>

                {/* Stock / perks */}
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

                {/* Colors */}
                {product.colors?.length ? (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-stone-600">Color</p>
                      {color ? <p className="text-sm text-stone-800">{color}</p> : null}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          aria-label={`Select color ${c}`}
                          className={[
                            'h-9 w-9 rounded-full ring-2 transition',
                            color === c ? 'ring-stone-900' : 'ring-transparent hover:ring-stone-400',
                          ].join(' ')}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Sizes */}
                {product.sizes?.length ? (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-stone-600">Size</p>
                      <Link href="#" className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
                        Size guide
                      </Link>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={[
                            'min-w-[3rem] rounded-xl border px-3 py-2 text-sm',
                            size === s ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 hover:bg-stone-50',
                          ].join(' ')}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                  <Link href="/cart" className="flex-1">
                    <button
                      disabled={!inStock}
                      className={[
                        'inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition',
                        !inStock ? 'opacity-60' : 'hover:bg-stone-800',
                      ].join(' ')}
                      onClick={() => console.log('Add to bag', { product, color, size })}
                    >
                      Add to bag
                    </button>
                  </Link>
                  <button
                    aria-label="Wishlist"
                    className="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white p-3 hover:bg-stone-50"
                    onClick={() => console.log('Wishlist')}
                    title="Add to wishlist"
                  >
                    <i className="fa-regular fa-heart" aria-hidden="true" />
                  </button>
                  <button
                    aria-label="Share"
                    className="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white p-3 hover:bg-stone-50"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                      } catch {}
                    }}
                    title="Share"
                  >
                    <i className="fa-solid fa-share-nodes" aria-hidden="true" />
                  </button>
                </div>

                {/* Part of — Category / Theme / Series chips */}
                <div className="mt-6 border-t pt-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Part of</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <PillLink label={`Category: ${pretty(product.categoryId)}`} href={`/categories`} />
                    <PillLink label={`Theme: ${pretty(product.themeId)}`} href={`/themes`} />
                    {product.seriesId ? <PillLink label={`Series: ${pretty(product.seriesId)}`} href={`/series`} /> : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/shop`} className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
                      Explore more in {pretty(product.categoryId)}
                    </Link>
                    <span className="text-stone-300">•</span>
                    <Link href={`/shop`} className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
                      Shop this theme
                    </Link>
                    {product.seriesId ? (
                      <>
                        <span className="text-stone-300">•</span>
                        <Link href={`/shop`} className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
                          Shop this series
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Details accordions */}
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
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

          {/* Related: Series */}
          {product.seriesId && RELATED_SERIES.length > 0 ? (
            <RelatedRail id="series-rail" heading={`More from ${pretty(product.seriesId)} Series`} items={RELATED_SERIES} />
          ) : null}

          {/* Related: Category */}
          {RELATED_CATEGORY.length > 0 ? (
            <RelatedRail id="category-rail" heading={`Related in ${pretty(product.categoryId)}`} items={RELATED_CATEGORY} />
          ) : null}
        </div>
      </div>

     {/* Mobile sticky bar */}
<div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/85 px-4 py-3 backdrop-blur md:hidden">
  <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
    <div>
      <p className="text-sm font-medium">{product.title}</p>
      <p className="text-xs text-stone-600">{money(product.price)}</p>
    </div>
    <Link href="/cart">
      <button className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white" onClick={() => console.log('Add to bag (mobile)')}>
        Add to bag
      </button>
    </Link>
  </div>
</div>
    </main>
  );
}

function pretty(id: string) {
  return id
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function PillLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1 text-sm hover:bg-stone-50">
      {label}
    </Link>
  );
}

function Accordion({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button className="flex w-full items-center justify-between px-4 py-3 text-left" onClick={() => setOpen((v) => !v)}>
        <span className="font-medium">{title}</span>
        <i
          className={['fa-solid transition-transform', open ? 'fa-chevron-up' : 'fa-chevron-down'].join(' ')}
          aria-hidden="true"
        />
      </button>
      <div className={`grid transition-all ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden px-4 pb-4 text-sm">{children}</div>
      </div>
    </div>
  );
}

function RelatedRail({
  id,
  heading,
  items,
}: {
  id: string;
  heading: string;
  items: { title: string; price: number; image: string }[];
}) {
  return (
    <section id={id} className="mt-12">
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
        {items.map((p, idx) => (
          <Link
            href="/productdetail"
            key={idx}
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

      {/* Scoped scrollbar hide for rails */}
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