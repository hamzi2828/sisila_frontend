'use client';

export default function SearchEmpty({
  query,
  children,
}: {
  query: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <p className="text-stone-700">
        No results for “{query}”. Try “tee”, “hoodie”, “Poetry”, or “Street”.
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}