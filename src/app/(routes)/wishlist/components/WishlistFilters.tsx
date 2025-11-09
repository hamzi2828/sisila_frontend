'use client';

export default function WishlistFilters({
  selectedCount = 0,
  onAddSelectedToCart,
  onRemoveSelected,
  onClearSelection,
  onSelectAll,
}: {
  selectedCount?: number;
  onAddSelectedToCart: () => void;
  onRemoveSelected: () => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
}) {
  return (
    <>
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