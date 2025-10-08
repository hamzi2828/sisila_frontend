'use client';

import Link from 'next/link';
import Image from 'next/image';

type Section = {
  id: string;
  title: string;
  cover: string;
};

export default function CategoryHero({ core }: { core: Section[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <p
          className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Brand Aesthetic
        </p>
        <h1
          className="mt-3 text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight uppercase"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Categories, Curated
        </h1>
        <p className="mt-3 max-w-2xl text-white/80">
          Five core moods, five fresh curations — discover designs through a modern, editorial lens.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {core.map((c) => (
            <Link
              key={c.id}
              href={`#${c.id}`}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
            >
              {c.title}
            </Link>
          ))}
          <Link
            href="#curations"
            className="inline-flex items-center rounded-full bg-white text-stone-900 px-4 py-2 text-sm font-medium hover:bg-stone-100 transition"
          >
            View Curations
          </Link>
        </div>
      </div>

      {/* Floating image cluster */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden md:block">
        <div className="relative h-full w-[48vw] max-w-[640px]">
          {[0, 1, 2].map((i) => (
            <div
              key={core[i]?.id ?? i}
              className={`absolute rounded-2xl ring-1 ring-white/20 overflow-hidden ${
                i === 0
                  ? 'right-12 top-10 h-48 w-40'
                  : i === 1
                  ? 'right-24 top-40 h-60 w-48 rotate-3'
                  : 'right-8 bottom-10 h-52 w-44 -rotate-2'
              }`}
            >
              <Image
                src={core[i]?.cover || ''}
                alt={core[i]?.title || 'Category cover'}
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