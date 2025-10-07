'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type Item = { id: string; title: string; price: number; tag?: string; image: string; href: string };

const CATALOG: Item[] = [
  { id: 'verses-tee', title: 'Verses Tee', price: 38, tag: 'Poetry', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'palette-crew', title: 'Palette Crew', price: 66, tag: 'Artistic', image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'neon-alley-hoodie', title: 'Neon Alley Hoodie', price: 78, tag: 'Street', image: 'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'forest-tee', title: 'Forest Tee', price: 40, tag: 'Nature', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'grotesk-tee', title: 'Grotesk Tee', price: 40, tag: 'Typography', image: 'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'block-hoodie', title: 'Block Hoodie', price: 74, tag: 'Street', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'city-ls', title: 'City LS', price: 58, tag: 'Street', image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'varsity-tee', title: 'Varsity Tee', price: 44, tag: 'Retro', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
];

export default function SearchPage() {
  const params = useSearchParams();
  const q = (params.get('q') || '').trim();

  const results = useMemo(() => {
    if (!q) return CATALOG;
    const term = q.toLowerCase();
    return CATALOG.filter((i) => i.title.toLowerCase().includes(term) || (i.tag || '').toLowerCase().includes(term));
  }, [q]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <p className="text-sm text-stone-600">Search</p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {q ? `Results for “${q}”` : 'Browse all'}
            </h1>
            <p className="mt-2 text-stone-600">{results.length} item{results.length === 1 ? '' : 's'}</p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-7xl">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-stone-700">No results for “{q}”. Try “tee”, “hoodie”, “Poetry”, or “Street”.</p>
              <div className="mt-3 flex gap-2">
                {['tee', 'hoodie', 'Poetry', 'Street'].map((s) => (
                  <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50">
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((p, i) => (
                <Link key={p.id} href={p.href} className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition">
                  <div className="relative w-full pt-[125%]">
                    <Image src={p.image} alt={p.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" priority={i < 4} />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-sm text-stone-700">${p.price}</p>
                    </div>
                    {p.tag ? <p className="mt-1 text-xs text-stone-500">{p.tag}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}