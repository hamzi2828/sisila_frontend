'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

const ITEMS = [
  { id: 'verses-tee', title: 'Verses Tee', price: 38, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80' },
  { id: 'palette-crew', title: 'Palette Crew', price: 66, image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80' },
  { id: 'neon-alley-hoodie', title: 'Neon Alley Hoodie', price: 78, image: 'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1400&q=80' },
  { id: 'forest-tee', title: 'Forest Tee', price: 40, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80' },
  { id: 'canvas-tee', title: 'Canvas Tee', price: 42, image: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1400&q=80' },
  { id: 'city-ls', title: 'City LS', price: 58, image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80' },
];

export default function NewArrivalsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
            <div className="p-8 md:p-12 lg:p-16">
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">Just Landed</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>New Arrivals</h1>
              <p className="mt-2 text-white/80 max-w-xl">Fresh drops across tees, hoods, and long sleeves — culture-forward silhouettes.</p>
              <div className="mt-5 flex gap-2">
                <Link href="/shop" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100">Shop all</Link>
                <Link href="/lookbook" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15">View lookbook</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights/Value */}
      <section className="px-6 md:px-10 lg:px-20 pb-6">
        <div className="mx-auto max-w-7xl grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Value icon={<Sparkles className="h-4 w-4" />} title="Limited colorways" note="First run — limited quantities" />
          <Value icon={<Truck className="h-4 w-4" />} title="Ships in 48 hours" note="Fast dispatch on new drops" />
          <Value icon={<ShieldCheck className="h-4 w-4" />} title="Quality check" note="Every piece inspected" />
        </div>
      </section>

      {/* Feature mosaic */}
      <section className="px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-12 grid-rows-6 gap-3">
            <Tile item={ITEMS[0]} className="col-span-12 md:col-span-7 row-span-6" />
            <Tile item={ITEMS[1]} className="col-span-12 md:col-span-5 row-span-3" />
            <Tile item={ITEMS[2]} className="col-span-12 md:col-span-5 row-span-3" />
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.slice(3).map((p) => (
              <Card key={p.id} item={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Drop Story */}
      <section className="px-6 md:px-10 lg:px-20 py-12">
        <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Drop Notes</p>
            <h3 className="mt-2 text-xl font-semibold">Palette + Proportions</h3>
            <p className="mt-2 text-stone-700">
              This edit leans into painterly composition and everyday silhouettes. Crisp rib trims,
              balanced type, and expressive color blocks deliver a modern uniform.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm text-stone-700">
              <li>Washed hand-feel on tees</li>
              <li>Mid-weight fleece for stability</li>
              <li>Refined neckline and hems</li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Shot src="https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80" />
            <Shot src="https://images.unsplash.com/photo-1494319827402-c4b9b83f5741?auto=format&fit=crop&w=1200&q=80" />
          </div>
        </div>
      </section>

      {/* Shop the drop rail */}
      <section className="px-6 md:px-10 lg:px-20 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>Shop the Drop</h3>
              <p className="text-stone-600">Handpicked selects from this release.</p>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50">Shop all ↗</Link>
          </div>

          <div className="mt-4 no-scrollbar flex gap-5 overflow-x-auto px-1 py-2">
            {ITEMS.map((p, idx) => (
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
      </section>
    </main>
  );
}

function Value({ icon, title, note }: any) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-stone-600">{note}</p>
      </div>
    </div>
  );
}

function Tile({ item, className = '' }: any) {
  return (
    <Link href="/productdetail" className={['group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200', className].join(' ')}>
      <div className="relative w-full h-full min-h-[240px]">
        <Image src={item.image} alt={item.title} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-sm font-medium">{item.title}</span>
        </div>
      </div>
    </Link>
  );
}

function Card({ item }: any) {
  return (
    <Link href="/productdetail" className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 hover:shadow-md transition">
      <div className="relative w-full pt-[125%]">
        <Image src={item.image} alt={item.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{item.title}</p>
          <p className="text-sm text-stone-700">${item.price}</p>
        </div>
      </div>
    </Link>
  );
}

function Shot({ src }: { src: string }) {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-2xl ring-1 ring-stone-200">
      <Image src={src} alt="Drop detail" fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
    </div>
  );
}