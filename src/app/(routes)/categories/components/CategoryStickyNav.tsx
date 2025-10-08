'use client';

import Link from 'next/link';

type Section = { id: string; title: string };

export default function CategoryStickyNav({ core }: { core: Section[] }) {
  return (
    <div className="sticky top-36 space-y-8">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Core</p>
        <nav className="grid gap-2">
          {core.map((c) => (
            <Link
              key={c.id}
              href={`#${c.id}`}
              className="group inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition"
            >
              <span>{c.title}</span>
              <span className="opacity-0 group-hover:opacity-100 transition">↗</span>
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Curations</p>
        <nav className="grid gap-2">
          <Link
            href="#curations"
            className="inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition"
          >
            <span>All Curations</span>
            <span>↓</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}