"use client";
import React from "react";
import { X } from "lucide-react";
import { SearchInput, Select } from "@/components/admin/ui";
import type { ProductStatusFilter } from "./ProductStats";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ProductStatusFilter;
  setStatusFilter: (filter: ProductStatusFilter) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  availableCategories: string[];
  collectionFilter: string;
  setCollectionFilter: (filter: string) => void;
  onCurrentPageReset: () => void;
  /** Shown under the filters when any filter is active. */
  resultCount?: number;
  totalCount?: number;
  onClearFilters?: () => void;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  availableCategories,
  collectionFilter,
  setCollectionFilter,
  onCurrentPageReset,
  resultCount,
  totalCount,
  onClearFilters,
}: ProductFiltersProps) {
  const handleSearchChange = (value: string) => {
    onCurrentPageReset();
    setSearchQuery(value);
  };

  const hasFilters =
    !!searchQuery.trim() || statusFilter !== "all" || categoryFilter !== "all" || collectionFilter !== "all";

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name, category or slug..."
          aria-label="Search products"
          wrapperClassName="col-span-2 sm:col-span-3 sm:max-w-none xl:col-span-1"
        />

        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as ProductStatusFilter);
            onCurrentPageReset();
          }}
          aria-label="Filter by status"
          className="py-2 sm:py-2.5"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="out_of_stock">Out of stock</option>
        </Select>

        <Select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            onCurrentPageReset();
          }}
          aria-label="Filter by category"
          className="py-2 sm:py-2.5"
        >
          <option value="all">All categories</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Select
          value={collectionFilter}
          onChange={(e) => {
            setCollectionFilter(e.target.value);
            onCurrentPageReset();
          }}
          aria-label="Filter by collection"
          className="col-span-2 py-2 sm:col-span-1 sm:py-2.5"
        >
          <option value="all">All collections</option>
          <option value="theme">Themes</option>
          <option value="series">Series</option>
          <option value="none">No collection</option>
        </Select>
      </div>

      {hasFilters && onClearFilters && (
        <div className="mt-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <p className="text-stone-500">
            {typeof resultCount === "number" && typeof totalCount === "number" && (
              <>
                <span className="font-medium text-stone-900">{resultCount}</span> of {totalCount} products match
              </>
            )}
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
