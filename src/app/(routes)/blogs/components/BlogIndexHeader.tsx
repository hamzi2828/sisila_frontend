'use client';

import { Dispatch, SetStateAction } from 'react';

export default function BlogIndexHeader({
  q,
  setQ,
  tag,
  setTag,
  tags,
}: {
  q: string;
  setQ: Dispatch<SetStateAction<string>>;
  tag: string;
  setTag: Dispatch<SetStateAction<string>>;
  tags: readonly string[];
}) {
  return (
    <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
      <div className="mx-auto">
        <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
          Brand Journal
        </p>

        {/* Title + Search */}
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h1
            className="text-3xl md:text-5xl font-semibold uppercase"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Stories
          </h1>

          <div className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search stories, themes, categories…"
                className="w-full rounded-full border border-stone-300/80 bg-white pl-9 pr-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
              />
            </div>
            <button
              onClick={() => setQ('')}
              className="rounded-full border border-stone-300/80 bg-white px-3 py-2 text-sm hover:bg-stone-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tag chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => {
            const active = t === tag;
            return (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={[
                  'inline-flex items-center rounded-full px-3 py-1 text-sm transition',
                  active
                    ? 'bg-black text-white'
                    : 'border border-stone-300/80 bg-white text-stone-800 hover:bg-stone-50',
                ].join(' ')}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}