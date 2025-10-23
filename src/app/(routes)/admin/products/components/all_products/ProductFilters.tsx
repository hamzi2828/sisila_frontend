"use client";
import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "published" | "draft" | "out_of_stock";
  setStatusFilter: (filter: "all" | "published" | "draft" | "out_of_stock") => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  availableCategories: string[];
  onCurrentPageReset: () => void;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  availableCategories,
  onCurrentPageReset
}: ProductFiltersProps) {
  const handleSearchChange = (value: string) => {
    onCurrentPageReset();
    setSearchQuery(value);
  };

  const handleStatusChange = (value: "all" | "published" | "draft" | "out_of_stock") => {
    setStatusFilter(value);
    onCurrentPageReset();
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    onCurrentPageReset();
  };

  const clearSearch = () => {
    setSearchQuery("");
    onCurrentPageReset();
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search products
            </label>
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                id="search"
                aria-label="Search products"
                className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Search by name, category, or slug..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as "all" | "published" | "draft" | "out_of_stock")}
              className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}