'use client';

import Link from 'next/link';
import Image from 'next/image';

const ITEMS = [
  { id: 'block-hoodie', title: 'Block Hoodie', price: 74, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80', tag: 'Street' },
  { id: 'grotesk-tee', title: 'Grotesk Tee', price: 40, image: 'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80', tag: 'Typography' },
  { id: 'smile-tee', title: 'Smile Tee', price: 36, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80', tag: 'Fun' },
  { id: 'palette-hoodie', title: 'Palette Hoodie', price: 76, image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80', tag: 'Artistic' },
  { id: 'forest-tee-2', title: 'Forest Tee', price: 42, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80', tag: 'Nature' },
  { id: 'city-ls-2', title: 'City LS', price: 58, image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80', tag: 'Street' },
];

const TAGS = ['Street', 'Typography', 'Artistic', 'Nature', 'Fun'];

export default function TrendingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
            <div className="p-8 md:p-12 lg:p-16">
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">Popular</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Trending Now
              </h1>
              <p className="mt-2 text-white/80 max-w-xl">Most-loved styles from the last 7 days — as seen on the feed.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <span key={t} className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">{t}</span>
                ))}
              </div>
              <div className="mt-5">
                <Link href="/shop" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100">
                  Shop all
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight rail */}
      <section className="px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="no-scrollbar flex gap-5 overflow-x-auto">
            {ITEMS.map((p, i) => (
              <Link
                key={p.id}
                href="/productdetail"
                className="group relative h-[320px] w-[240px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 hover:shadow-md transition"
              >
                <Image src={p.image} alt={p.title} fill sizes="240px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" priority={i < 3} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-white text-sm font-medium">{p.title}</p>
                  <p className="text-white/85 text-xs">${p.price} • {p.tag}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map((p) => (
              <Link
                key={`${p.id}-grid`}
                href="/productdetail"
                className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 hover:shadow-md transition"
              >
                <div className="relative w-full pt-[125%]">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-sm text-stone-700">${p.price}</p>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{p.tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Creators grid */}
      <section className="px-6 md:px-10 lg:px-20 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Creators wearing Silsila
              </h3>
              <p className="text-stone-600">Community looks — tagged on the feed.</p>
            </div>
            <Link href="/lookbook" className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50">See editorial</Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative h-64 overflow-hidden rounded-2xl ring-1 ring-stone-200 bg-white">
                <Image src={ITEMS[i].image} alt="Creator fit" fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}