'use client';

import Image from 'next/image';
import Link from 'next/link';

const FRAMES = [
  { id: 'echo-dunes', title: 'Echoes — Dune Lines', image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1600&q=80' },
  { id: 'hymns-studio', title: 'Hymns — Studio Warmth', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80' },
  { id: 'passion-pigments', title: 'Passion — Pigments', image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1600&q=80' },
  { id: 'anime-city', title: 'Anime — City Glow', image: 'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1600&q=80' },
  { id: 'forest-mist', title: 'Echoes — Forest Mist', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80' },
];

export default function LookbookPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto ">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
            <div className="p-8 md:p-12 lg:p-16">
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">Lookbook</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>Editorial</h1>
              <p className="mt-2 text-white/80 max-w-xl">A visual journal across themes, categories, and series — captured in motion.</p>
              <div className="mt-5 flex gap-2">
                <Link href="/themes" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100">Explore Themes</Link>
                <Link href="/series" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15">Explore Series</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mosaic */}
      <section className="px-6 md:px-10 lg:px-20 pb-16">
        <div className="mx-auto  grid grid-cols-12 grid-rows-6 gap-3">
          <Tile item={FRAMES[0]} className="col-span-12 md:col-span-7 row-span-6" />
          <Tile item={FRAMES[1]} className="col-span-12 md:col-span-5 row-span-3" />
          <Tile item={FRAMES[2]} className="col-span-12 md:col-span-5 row-span-3" />
        </div>
        <div className="mx-auto mt-6  grid gap-3 sm:grid-cols-2">
          <Tile item={FRAMES[3]} />
          <Tile item={FRAMES[4]} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 p-6 text-center">
          <p className="text-stone-700">See products featured in this lookbook</p>
          <div className="mt-3">
            <Link href="/shop" className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800">Shop the edit</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Tile({ item, className = '' }: any) {
  return (
    <div className={['group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200', className].join(' ')}>
      <div className="relative w-full h-full min-h-[240px]">
        <Image src={item.image} alt={item.title} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-sm font-medium">{item.title}</span>
        </div>
      </div>
    </div>
  );
}