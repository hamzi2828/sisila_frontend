'use client';

export default function SearchHero({ query, count }: { query: string; count: number }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6">
      <p className="text-sm text-stone-600">Search</p>
      <h1
        className="mt-1 text-2xl md:text-3xl font-semibold uppercase"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {query ? `Results for “${query}”` : 'Browse all'}
      </h1>
      <p className="mt-2 text-stone-600">
        {count} item{count === 1 ? '' : 's'}
      </p>
    </div>
  );
}