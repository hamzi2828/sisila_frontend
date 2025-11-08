'use client';

import { SlidersHorizontal, X, Search } from 'lucide-react';

type PriceRange = 'All' | 'Under $40' | '$40–$60' | '$60–$80' | '$80+';
type SortKey = 'Featured' | 'Price ↑' | 'Price ↓';

export default function ShopFilters({
  drawerOpen,
  setDrawerOpen,
  q,
  setQ,
  price,
  setPrice,
  sort,
  setSort,
  count,
  clearAll,
}: {
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  q: string;
  setQ: (v: string) => void;
  price: PriceRange;
  setPrice: (v: PriceRange) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  count: number;
  clearAll: () => void;
}) {
  const PRICE_RANGES: PriceRange[] = ['All', 'Under $40', '$40–$60', '$60–$80', '$80+'];
  const SORTS: SortKey[] = ['Featured', 'Price ↑', 'Price ↓'];

  return (
    <>
      {/* Row */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-3 py-2 text-sm hover:bg-stone-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-stone-300/80 bg-white px-3 py-2 text-sm outline-none"
          aria-label="Sort by"
        >
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Active summary */}
      {(price !== 'All' || q) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-stone-600">Filters:</span>
          {price !== 'All' && <Badge onClear={() => setPrice('All')}>{price}</Badge>}
          {q && <Badge onClear={() => setQ('')}>{q}</Badge>}
          <button
            onClick={clearAll}
            className="ml-1 inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1 hover:bg-stone-50"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Count */}
      <div className="mt-4 text-sm text-stone-600">
        {count} result{count !== 1 ? 's' : ''}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-base font-semibold">Filters</h3>
              <button aria-label="Close filters" onClick={() => setDrawerOpen(false)} className="rounded p-2 text-stone-700 hover:bg-stone-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Search */}
              <div>
                <p className="text-sm font-medium">Search</p>
                <div className="mt-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search products"
                    className="w-full rounded-xl border border-stone-300/80 bg-white pl-9 pr-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm font-medium">Price</p>
                <div className="mt-2 grid gap-2">
                  {PRICE_RANGES.map((r) => (
                    <label key={r} className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="price"
                        className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-stone-400"
                        checked={price === r}
                        onChange={() => setPrice(r)}
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-sm font-medium">Sort</p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="mt-2 w-full rounded-xl border border-stone-300/80 bg-white px-3 py-2 text-sm outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t p-4 flex items-center justify-between gap-3">
              <button
                onClick={clearAll}
                className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
              >
                Reset
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Apply
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function Badge({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-3 py-1">
      {children}
      <button onClick={onClear} aria-label="Remove filter" className="rounded p-1 hover:bg-stone-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}