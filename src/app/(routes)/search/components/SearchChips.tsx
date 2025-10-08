'use client';

import Link from 'next/link';

export default function SearchChips({ chips = [] }: { chips?: string[] }) {
  return (
    <div className="flex gap-2">
      {chips.map((s) => (
        <Link
          key={s}
          href={`/search?q=${encodeURIComponent(s)}`}
          className="rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
        >
          {s}
        </Link>
      ))}
    </div>
  );
}