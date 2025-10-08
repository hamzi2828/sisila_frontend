'use client';

import Link from 'next/link';
import type { SeriesSection } from '../../main/components/SeriesSection';

export default function SeriesStickyNav({ sections }: { sections: SeriesSection[] }) {
  return (
    <div className="sticky top-36 space-y-8">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Index</p>
        <nav className="grid gap-2">
          {sections.map((s) => (
            <Link
              key={s.id}
              href={`#${s.id}`}
              className="group inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition"
            >
              <span>{s.title}</span>
              <span className="opacity-0 group-hover:opacity-100 transition">↗</span>
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Rails</p>
        <nav className="grid gap-2">
          <Link
            href="#rails"
            className="inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition"
          >
            <span>All Mood Rails</span>
            <span>↓</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}