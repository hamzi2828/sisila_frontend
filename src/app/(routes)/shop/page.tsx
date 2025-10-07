'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  Truck,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  X,
  Search,
} from 'lucide-react';

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  href: string;
  tag?: string; // Poetry, Witty, etc.
};

const ALL_PRODUCTS: Product[] = [
  { id: 'verses-tee', title: 'Verses Tee', price: 38, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Poetry' },
  { id: 'quip-hoodie', title: 'Quip Hoodie', price: 72, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Witty' },
  { id: 'canvas-tee', title: 'Canvas Tee', price: 42, image: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Artistic' },
  { id: 'neon-alley-hoodie', title: 'Neon Alley Hoodie', price: 78, image: 'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Street' },
  { id: 'forest-tee', title: 'Forest Tee', price: 40, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Nature' },
  { id: 'varsity-tee', title: 'Varsity Tee', price: 44, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Retro' },
  { id: 'palette-crew', title: 'Palette Crew', price: 66, image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Artistic' },
  { id: 'city-ls', title: 'City LS', price: 58, image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Street' },
  { id: 'grotesk-tee', title: 'Grotesk Tee', price: 40, image: 'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Typography' },
  { id: 'block-hoodie', title: 'Block Hoodie', price: 74, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Street' },
  { id: 'palette-hoodie', title: 'Palette Hoodie', price: 76, image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Artistic' },
  { id: 'city-ls-2', title: 'City LS', price: 58, image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Street' },
];

const PRICE_RANGES = ['All', 'Under $40', '$40–$60', '$60–$80', '$80+'] as const;
type PriceRange = (typeof PRICE_RANGES)[number];

const SORTS = ['Featured', 'Price ↑', 'Price ↓'] as const;
type SortKey = (typeof SORTS)[number];

export default function ShopPage() {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [q, setQ] = useState('');
  const [price, setPrice] = useState<PriceRange>('All');
  const [sort, setSort] = useState<SortKey>('Featured');

  const tags = useMemo(
    () => ['All', ...Array.from(new Set(ALL_PRODUCTS.map((p) => p.tag).filter(Boolean))) as string[]],
    []
  );

  const products = useMemo(() => {
    let rows = [...ALL_PRODUCTS];

    // Text search
    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.tag || '').toLowerCase().includes(query)
      );
    }

    // Tag filter (from chips OR in drawer)
    if (activeTag !== 'All') {
      rows = rows.filter((p) => p.tag === activeTag);
    }

    // Price range
    rows = rows.filter((p) => {
      switch (price) {
        case 'Under $40':
          return p.price < 40;
        case '$40–$60':
          return p.price >= 40 && p.price <= 60;
        case '$60–$80':
          return p.price > 60 && p.price <= 80;
        case '$80+':
          return p.price > 80;
        default:
          return true;
      }
    });

    // Sort
    if (sort === 'Price ↑') rows.sort((a, b) => a.price - b.price);
    if (sort === 'Price ↓') rows.sort((a, b) => b.price - a.price);

    return rows;
  }, [activeTag, price, q, sort]);

  const clearAll = () => {
    setActiveTag('All');
    setPrice('All');
    setQ('');
    setSort('Featured');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">All Products</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Shop
              </h1>
              <p className="mt-2 text-white/80">Culturally-inspired apparel — daily-wear silhouettes and considered graphics.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/new-arrivals" className={pill(true)}>New Arrivals</Link>
                <Link href="/trending" className={pill()}>Trending</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value bar */}
      <ValueBar />

      {/* FILTER + GRID */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Filters row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Tag chips */}
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button key={t} onClick={() => setActiveTag(t)} className={chip(t === activeTag)}>
                  {t}
                </button>
              ))}
            </div>

            {/* Filter button + sort */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-3 py-2 text-sm hover:bg-stone-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-stone-300/80 bg-white px-3 py-2 text-sm outline-none"
                aria-label="Sort by"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters summary */}
          {(activeTag !== 'All' || price !== 'All' || q) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-stone-600">Filters:</span>
              {activeTag !== 'All' && <Badge onClear={() => setActiveTag('All')}>{activeTag}</Badge>}
              {price !== 'All' && <Badge onClear={() => setPrice('All')}>{price}</Badge>}
              {q && <Badge onClear={() => setQ('')}>“{q}”</Badge>}
              <button onClick={clearAll} className="ml-1 inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1 hover:bg-stone-50">
                Clear all
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="mt-4 text-sm text-stone-600">{products.length} result{products.length !== 1 ? 's' : ''}</div>

          {/* Grid */}
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>

          {/* Discover tiles */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <PromoCard title="Explore Categories" href="/categories" image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80" />
            <PromoCard title="Explore Themes" href="/themes" image="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80" />
          </div>

          {/* Editorial strip */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-r from-stone-100 to-white p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Lookbook</p>
                <h3 className="text-xl font-semibold">Editorial — Culture in Motion</h3>
                <p className="text-stone-600">Visual stories across Poetry, Street, and more.</p>
              </div>
              <Link href="/lookbook" className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800">
                See the lookbook ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-base font-semibold">Filters</h3>
              <button
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
                className="rounded p-2 text-stone-700 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Search */}
              <div>
                <p className="text-sm font-medium">Search</p>
                <div className="mt-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search products"
                    className="w-full rounded-xl border border-stone-300/80 bg-white pl-9 pr-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
                  />
                </div>
              </div>

              {/* Tag */}
              <div>
                <p className="text-sm font-medium">Tag</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <button key={t} onClick={() => setActiveTag(t)} className={chip(t === activeTag)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm font-medium">Price</p>
                <div className="mt-2 grid gap-2">
                  {PRICE_RANGES.map((r) => (
                    <label key={r} className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="price"
                        className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-stone-400"
                        checked={price === r}
                        onChange={() => setPrice(r)}
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-sm font-medium">Sort</p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="mt-2 w-full rounded-xl border border-stone-300/80 bg-white px-3 py-2 text-sm outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t p-4 flex items-center justify-between gap-3">
              <button
                onClick={clearAll}
                className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
              >
                Reset
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Apply
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

function ValueBar() {
  return (
    <section className="px-6 md:px-10 lg:px-20 pb-6">
      <div className="mx-auto max-w-7xl grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ValueItem icon={<Truck className="h-4 w-4" />} title="Free shipping" desc="On US orders $75+" />
        <ValueItem icon={<RefreshCcw className="h-4 w-4" />} title="Easy returns" desc="30-day window" />
        <ValueItem icon={<ShieldCheck className="h-4 w-4" />} title="Secure checkout" desc="PCI compliant" />
        <ValueItem icon={<Sparkles className="h-4 w-4" />} title="Quality guaranteed" desc="Crafted to last" />
      </div>
    </section>
  );
}

function ValueItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-stone-600">{desc}</p>
      </div>
    </div>
  );
}

function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link href={product.href} className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition">
      <div className="relative w-full pt-[125%]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width:1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{product.title}</p>
          <p className="text-sm text-stone-700">${product.price}</p>
        </div>
        {product.tag ? <p className="mt-1 text-xs text-stone-500">{product.tag}</p> : null}
      </div>
    </Link>
  );
}

function PromoCard({ title, href, image }: { title: string; href: string; image: string }) {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80">
      <div className="relative w-full pt-[52%]">
        <Image src={image} alt={title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="absolute inset-0 flex items-end p-5">
        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-sm font-medium">{title} ↗</span>
      </div>
    </Link>
  );
}

function pill(highlight = false) {
  return [
    'inline-flex items-center rounded-full px-4 py-2 text-sm transition',
    highlight ? 'bg-white text-stone-900 font-medium' : 'border border-white/40 bg-white/10 text-white hover:bg-white/15',
  ].join(' ');
}

function chip(active: boolean) {
  return [
    'inline-flex items-center rounded-full px-3 py-1 text-sm transition',
    active ? 'bg-black text-white' : 'border border-stone-300/80 bg-white text-stone-800 hover:bg-stone-50',
  ].join(' ');
}

function Badge({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-3 py-1">
      {children}
      <button onClick={onClear} aria-label="Remove filter" className="rounded p-1 hover:bg-stone-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}