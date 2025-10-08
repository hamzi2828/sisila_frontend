'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NewArrivalsFeature({ items = [] }: { items?: any[] }) {
  return (
    <div>
      <div className="grid grid-cols-12 grid-rows-6 gap-3">
        {items[0] ? <Tile item={items[0]} className="col-span-12 md:col-span-7 row-span-6" /> : null}
        {items[1] ? <Tile item={items[1]} className="col-span-12 md:col-span-5 row-span-3" /> : null}
        {items[2] ? <Tile item={items[2]} className="col-span-12 md:col-span-5 row-span-3" /> : null}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(3).map((p) => (
          <Card key={p.id} item={p} />
        ))}
      </div>

      <div className="px-0 md:px-0 lg:px-0 py-12">
        <div className="grid gap-6 md:grid-cols-2">
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