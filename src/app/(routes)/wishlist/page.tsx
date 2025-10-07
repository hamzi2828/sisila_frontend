'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type SavedItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  kind: 'Tee' | 'Hoodie' | 'Crew' | 'LS' | 'Cap' | 'Tote';
  tag?: string; // Poetry, Street, etc.
  compareAt?: number;
  stock?: 'in' | 'low' | 'out';
  savedAt?: string;
};

const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

// Main saved items
const SAVED_INITIAL: SavedItem[] = [
  {
    id: 'verses-tee',
    title: 'Verses Tee',
    price: 38,
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Poetry',
    stock: 'in',
    savedAt: '2w',
  },
  {
    id: 'block-hoodie',
    title: 'Block Hoodie',
    price: 74,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80',
    kind: 'Hoodie',
    tag: 'Street',
    stock: 'low',
    savedAt: '5d',
  },
  {
    id: 'palette-crew',
    title: 'Palette Crew',
    price: 66,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80',
    kind: 'Crew',
    tag: 'Artistic',
    stock: 'in',
    savedAt: '1w',
  },
  {
    id: 'city-ls',
    title: 'City LS',
    price: 58,
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80',
    kind: 'LS',
    tag: 'Street',
    stock: 'in',
    savedAt: '3d',
  },
  {
    id: 'grotesk-tee',
    title: 'Grotesk Tee',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Typography',
    stock: 'in',
    savedAt: '1d',
  },
  {
    id: 'neon-alley-hoodie',
    title: 'Neon Alley Hoodie',
    price: 78,
    image:
      'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1400&q=80',
    kind: 'Hoodie',
    tag: 'Anime',
    compareAt: 88,
    stock: 'out',
    savedAt: '3w',
  },
  {
    id: 'forest-tee',
    title: 'Forest Tee',
    price: 42,
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Nature',
    stock: 'in',
    savedAt: '4d',
  },
  {
    id: 'varsity-tee',
    title: 'Varsity Tee',
    price: 44,
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Retro',
    stock: 'in',
    savedAt: '5w',
  },
];

// Back in stock suggestions
const BACK_IN_STOCK: SavedItem[] = [
  {
    id: 'ink-verse-tee',
    title: 'Ink & Verse Tee',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Poetry',
    stock: 'in',
  },
  {
    id: 'quiet-reader-ls',
    title: 'Quiet Reader LS',
    price: 58,
    image:
      'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80',
    kind: 'LS',
    tag: 'Poetry',
    stock: 'in',
  },
  {
    id: 'margins-crew',
    title: 'Margins Crew',
    price: 66,
    image:
      'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80',
    kind: 'Crew',
    tag: 'Poetry',
    stock: 'in',
  },
];

// Price drops
const PRICE_DROPS: SavedItem[] = [
  {
    id: 'palette-hoodie',
    title: 'Palette Hoodie',
    price: 61,
    compareAt: 76,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80',
    kind: 'Hoodie',
    tag: 'Artistic',
    stock: 'in',
  },
  {
    id: 'varsity-tee-sale',
    title: 'Varsity Tee',
    price: 35,
    compareAt: 44,
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Retro',
    stock: 'in',
  },
  {
    id: 'grotesk-tee-sale',
    title: 'Grotesk Tee',
    price: 32,
    compareAt: 40,
    image:
      'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Typography',
    stock: 'in',
  },
];

// Lists (saved collections)
const LISTS = [
  {
    id: 'gift-ideas',
    title: 'Gift ideas',
    count: 7,
    cover:
      'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'poets-series',
    title: 'Poets Series',
    count: 5,
    cover:
      'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'street-edit',
    title: 'Street edit',
    count: 6,
    cover:
      'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState<typeof SAVED_INITIAL>(SAVED_INITIAL);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<'All' | SavedItem['kind']>('All');
  const [sort, setSort] = useState<'Newest' | 'Price ↑' | 'Price ↓'>('Newest');

  const kinds: ('All' | SavedItem['kind'])[] = ['All', 'Tee', 'Hoodie', 'Crew', 'LS'];

  const filtered = useMemo(() => {
    let rows = [...items];
    if (filter !== 'All') rows = rows.filter((r) => r.kind === filter);
    switch (sort) {
      case 'Price ↑':
        rows.sort((a, b) => a.price - b.price);
        break;
      case 'Price ↓':
        rows.sort((a, b) => b.price - a.price);
        break;
      default:
        // Newest (pretend savedAt descending if available)
        rows.sort((a, b) => ((b.savedAt || '') > (a.savedAt || '') ? 1 : -1));
    }
    return rows;
  }, [items, filter, sort]);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const selectAll = () => setSelected(filtered.map((x) => x.id));
  const clearSelection = () => setSelected([]);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setSelected((s) => s.filter((x) => x !== id));
  };
  const removeSelected = () => {
    setItems((prev) => prev.filter((x) => !selected.includes(x.id)));
    setSelected([]);
  };
  const addToCart = (id: string) => {
    console.log('Add to cart:', id);
    // optional: route to /cart or toast
  };
  const addSelectedToCart = () => {
    console.log('Add selected to cart:', selected);
    setSelected([]);
  };

  const shareWishlist = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (_) {}
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto ">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Your saves</p>
              <h1
                className="mt-1 text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Wishlist
              </h1>
              <p className="mt-1 text-stone-600">{items.length} items saved</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={shareWishlist}
                className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
              >
                <i className="fa-regular fa-share-from-square mr-2" /> Share
              </button>
              <Link
                href="/cart"
                className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                <i className="fa-solid fa-cart-shopping mr-2" /> Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS + BULK BAR */}
      <section className="px-6 md:px-10 lg:px-20 pb-4">
        <div className="mx-auto  flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {kinds.map((k) => {
              const active = k === filter;
              return (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={[
                    'inline-flex items-center rounded-full px-3 py-1 text-sm transition',
                    active
                      ? 'bg-black text-white'
                      : 'border border-stone-300/80 bg-white text-stone-800 hover:bg-stone-50',
                  ].join(' ')}
                >
                  {k}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-stone-600">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-xl border border-stone-300/80 bg-white px-3 py-2 text-sm outline-none"
            >
              <option>Newest</option>
              <option>Price ↑</option>
              <option>Price ↓</option>
            </select>
          </div>
        </div>

        {/* Bulk bar */}
        {selected.length > 0 ? (
          <div className="mx-auto mt-3  rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p>
                <span className="font-medium">{selected.length}</span> selected
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={addSelectedToCart}
                  className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
                >
                  <i className="fa-solid fa-cart-plus mr-2" /> Add to cart
                </button>
                <button
                  onClick={removeSelected}
                  className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
                >
                  <i className="fa-regular fa-trash-can mr-2" /> Remove
                </button>
                <button
                  onClick={clearSelection}
                  className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
                >
                  Clear
                </button>
                <button
                  onClick={selectAll}
                  className="hidden sm:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
                >
                  Select all
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* SAVED GRID */}
      <section className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          {filtered.length === 0 ? (
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
                  onClick={() => setFilter('All')}
                  className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
                >
                  Reset filter
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
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
          )}
        </div>
      </section>

      {/* BACK IN STOCK */}
      <Rail
        id="back-in-stock"
        title="Back in stock"
        subtitle="Pieces you might have missed — now available."
        items={BACK_IN_STOCK}
      />

      {/* PRICE DROPS */}
      <Rail
        id="price-drops"
        title="Price drops"
        subtitle="Limited-time markdowns on your favorites."
        items={PRICE_DROPS}
      />

      {/* SAVED LISTS */}
      <section className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          <div className="flex items-end justify-between">
            <div>
              <h2
                className="text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Your lists
              </h2>
              <p className="mt-1 text-stone-600">Organize saved items into themed lists.</p>
            </div>
            <button className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50">
              <i className="fa-solid fa-plus mr-2" />
              New list
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LISTS.map((l) => (
              <div
                key={l.id}
                className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 transition hover:shadow-md"
              >
                <div className="relative w-full pt-[56%] bg-stone-100">
                  <Image
                    src={l.cover}
                    alt={l.title}
                    fill
                    sizes="(max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold">{l.title}</p>
                  <p className="text-xs text-stone-600">{l.count} saved</p>
                  <div className="mt-3 flex gap-2">
                    <button className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800">
                      Open
                    </button>
                    <button className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-xs hover:bg-stone-50">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENTLY VIEWED */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 text-center">
          <p className="text-stone-700">Keep exploring</p>
          <div className="mt-3 flex justify-center gap-2">
            <Link
              href="/new-arrivals"
              className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
            >
              New Arrivals
            </Link>
            <Link
              href="/trending"
              className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Trending
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StockPill({ stock }: { stock?: SavedItem['stock'] }) {
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

function Rail({
  id,
  title,
  subtitle,
  items,
}: {
  id: string;
  title: string;
  subtitle?: string;
  items: SavedItem[];
}) {
  return (
    <section id={id} className="px-6 md:px-10 lg:px-20 pb-12">
      <div className="mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h2
              className="text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {title}
            </h2>
            {subtitle ? <p className="mt-1 text-stone-600">{subtitle}</p> : null}
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
          >
            Shop all
          </Link>
        </div>

        <div className="mt-4 no-scrollbar flex gap-5 overflow-x-auto px-1 py-2">
          {items.map((p) => (
            <Link
              key={p.id}
              href="/productdetail"
              className="group relative h-[300px] w-[220px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 transition hover:shadow-md"
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="220px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="line-clamp-1 text-sm font-medium text-white">{p.title}</p>
                <p className="text-xs text-white/85">{money(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
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