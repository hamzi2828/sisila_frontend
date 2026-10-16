'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import themeService from '../main/services/themeService';
import seriesService from '../main/services/seriesService';
import { resolveImage } from '@/lib/productMedia';

type Frame = { id: string; title: string; image: string; href: string };

type Collection = {
  id: string;
  title: string;
  cover: string;
  gallery?: { title: string; image: string }[];
};

function toFrames(items: Collection[], base: '/themes' | '/series') {
  const covers: Frame[] = [];
  const details: Frame[] = [];
  for (const c of items) {
    const href = `${base}#${c.id}`;
    if (c.cover) covers.push({ id: `${base}-${c.id}-cover`, title: c.title, image: resolveImage(c.cover), href });
    (c.gallery || []).forEach((g, i) => {
      if (!g?.image) return;
      details.push({ id: `${base}-${c.id}-${i}`, title: `${c.title} — ${g.title}`, image: resolveImage(g.image), href });
    });
  }
  return { covers, details };
}

// Alternate theme and series frames so the edit reads as one story.
function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

export default function LookbookPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      themeService.getActiveThemes().catch(() => []),
      seriesService.getActiveSeries().catch(() => []),
    ]).then(([themes, series]) => {
      if (cancelled) return;
      const t = toFrames(themes, '/themes');
      const s = toFrames(series, '/series');
      const seen = new Set<string>();
      const all = [...interleave(t.covers, s.covers), ...interleave(t.details, s.details)].filter((f) => {
        if (seen.has(f.image)) return false;
        seen.add(f.image);
        return true;
      });
      setFrames(all.slice(0, 15));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [hero1, hero2, hero3, ...more] = frames;
  // Keep the two-column grid even.
  const rest = more.slice(0, more.length - (more.length % 2));

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto ">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
            <div className="p-8 md:p-12 lg:p-16">
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">Lookbook</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>Editorial</h1>
              <p className="mt-2 text-white/80 max-w-xl">A visual journal across our themes and series — captured in motion.</p>
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
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-300 border-t-stone-600" />
          </div>
        ) : frames.length === 0 ? (
          <p className="py-24 text-center text-stone-600">The new editorial is being shot — check back soon.</p>
        ) : (
          <>
            <div className="mx-auto  grid grid-cols-12 grid-rows-6 gap-3">
              {hero1 && <Tile item={hero1} className="col-span-12 md:col-span-7 row-span-6" />}
              {hero2 && <Tile item={hero2} className="col-span-12 md:col-span-5 row-span-3" />}
              {hero3 && <Tile item={hero3} className="col-span-12 md:col-span-5 row-span-3" />}
            </div>
            {rest.length > 0 && (
              <div className="mx-auto mt-6  grid gap-3 sm:grid-cols-2">
                {rest.map((f) => (
                  <Tile key={f.id} item={f} />
                ))}
              </div>
            )}
          </>
        )}
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

function Tile({ item, className = '' }: { item: Frame; className?: string }) {
  return (
    <Link href={item.href} className={['group relative block overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200', className].join(' ')}>
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
