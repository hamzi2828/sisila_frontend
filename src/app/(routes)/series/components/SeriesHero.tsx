'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Series } from '../../main/services/seriesService';

export default function SeriesHero({ sections }: { sections: Series[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 16px)',
        }}
      />
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <p
          className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Editorial Collections
        </p>
        <h1
          className="mt-3 text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight uppercase"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Series
        </h1>
        <p className="mt-3 max-w-2xl text-white/80">
          Poets, Alphabets, Cinema, Anime — four distinct lenses shaping cultural, literary, and visual narratives.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {sections.map((s) => (
            <Link
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
            >
              {s.title}
            </Link>
          ))}
          <Link
            href="#rails"
            className="inline-flex items-center rounded-full bg-white text-stone-900 px-4 py-2 text-sm font-medium hover:bg-stone-100 transition"
          >
            Mood Rails
          </Link>
        </div>
      </div>

      {/* Collage */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden md:block">
        <div className="relative h-full w-[48vw] max-w-[640px]">
          {sections.slice(0, 3).map((s, i) => (
            <div
              key={s.id}
              className={`absolute rounded-2xl ring-1 ring-white/20 overflow-hidden ${
                i === 0
                  ? 'right-12 top-10 h-48 w-40'
                  : i === 1
                  ? 'right-24 top-40 h-60 w-48 rotate-2'
                  : 'right-8 bottom-10 h-52 w-44 -rotate-3'
              }`}
            >
              <Image
                src={s.cover}
                alt={s.title}
                fill
                sizes="(max-width: 768px) 200px, 320px"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}