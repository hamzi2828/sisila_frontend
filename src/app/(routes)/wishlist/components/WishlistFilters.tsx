'use client';

export default function WishlistFilters({
  kinds = [],
  filter,
  setFilter,
  sort,
  setSort,
  selectedCount = 0,
  onAddSelectedToCart,
  onRemoveSelected,
  onClearSelection,
  onSelectAll,
}: {
  kinds: string[];
  filter: string;
  setFilter: (v: any) => void;
  sort: string;
  setSort: (v: any) => void;
  selectedCount?: number;
  onAddSelectedToCart: () => void;
  onRemoveSelected: () => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
}) {
  return (
    <>
      <div className="mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => {
            const active = k === filter;
            return (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={[
                  'inline-flex items-center rounded-full px-3 py-1 text-sm transition',
                  active
                    ? 'bg-black text-white'
                    : 'border border-stone-300/80 bg-white text-stone-800 hover:bg-stone-50',
                ].join(' ')}
              >
                {k}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-stone-600">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-stone-300/80 bg-white px-3 py-2 text-sm outline-none"
          >
            <option>Newest</option>
            <option>Price ↑</option>
            <option>Price ↓</option>
          </select>
        </div>
      </div>

      {/* Bulk bar */}
      {selectedCount > 0 ? (
        <div className="mx-auto mt-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>
              <span className="font-medium">{selectedCount}</span> selected
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onAddSelectedToCart}
                className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
              >
                <i className="fa-solid fa-cart-plus mr-2" /> Add to cart
              </button>
              <button
                onClick={onRemoveSelected}
                className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
              >
                <i className="fa-regular fa-trash-can mr-2" /> Remove
              </button>
              <button
                onClick={onClearSelection}
                className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
              >
                Clear
              </button>
              <button
                onClick={onSelectAll}
                className="hidden sm:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
              >
                Select all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}