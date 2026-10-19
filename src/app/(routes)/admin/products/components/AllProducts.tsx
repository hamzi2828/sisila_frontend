"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Table, TBody, TH, THead } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { productCell } from "./all_products/ProductCard";
import {
  ProductFilters,
  ProductCard,
  ProductRow,
  ProductPagination,
  EmptyState,
  LoadingState,
  ErrorState,
  type ProductStatusFilter,
} from "./all_products";

export interface ProductVariant {
  color: string;
  size: string;
  price: number;
  stock: number;
  sku?: string;
  discountedPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  status: "published" | "draft" | "out_of_stock";
  featured?: boolean;
  // Deprecated: kept for backward compatibility
  image?: string;
  // New fields
  thumbnailUrl?: string;
  bannerUrls?: string[];
  // Description fields
  description?: string;
  shortDescription?: string;
  features?: string;
  // Variants (optional)
  productType?: "single" | "variant";
  variants?: ProductVariant[];
  // Color media for variant products
  colorMedia?: Record<string, {
    thumbnailUrl?: string;
    bannerUrls?: string[];
  }>;
  // Collection fields
  collectionType?: "theme" | "series" | "none";
  collectionId?: string;
}

interface AllProductsProps {
  products: Product[];
  /** Status filter is owned by the page so the stat tiles can drive it. */
  statusFilter: ProductStatusFilter;
  onStatusFilterChange: (status: ProductStatusFilter) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: 'published' | 'draft') => Promise<void>;
  onToggleFeatured?: (id: string) => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string | null;
}

const productsPerPage = 10;

export default function AllProducts({
  products,
  statusFilter,
  onStatusFilterChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  onRetry,
  loading = false,
  error = null
}: AllProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [collectionFilter, setCollectionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingStatus, setTogglingStatus] = useState<Set<string>>(new Set());

  // Get unique categories for filter dropdown
  const availableCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q) ||
        product.slug?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

      const matchesCollection =
        collectionFilter === "all" ||
        (collectionFilter === "none" && (!product.collectionType || product.collectionType === "none")) ||
        (collectionFilter === "theme" && product.collectionType === "theme") ||
        (collectionFilter === "series" && product.collectionType === "series");

      return matchesSearch && matchesStatus && matchesCategory && matchesCollection;
    });
  }, [products, searchQuery, statusFilter, categoryFilter, collectionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const page = Math.min(currentPage, totalPages);
  const currentProducts = filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage);

  // Back to page 1 whenever the status filter changes (e.g. from a stat tile)
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Keep the page in range when deletes/filters shrink the list
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleToggleStatus = async (productId: string, currentStatus: 'published' | 'draft' | 'out_of_stock') => {
    if (!onToggleStatus || currentStatus === 'out_of_stock') return;

    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    setTogglingStatus(prev => new Set([...prev, productId]));

    try {
      await onToggleStatus(productId, newStatus);
    } catch (error) {
      console.error('Failed to toggle product status:', error);
    } finally {
      setTogglingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const resetCurrentPage = () => setCurrentPage(1);

  const hasFilters =
    !!searchQuery.trim() || statusFilter !== "all" || categoryFilter !== "all" || collectionFilter !== "all";

  const handleClearAllFilters = () => {
    setSearchQuery("");
    onStatusFilterChange("all");
    setCategoryFilter("all");
    setCollectionFilter("all");
    setCurrentPage(1);
  };

  const itemProps = {
    onEdit,
    onDelete,
    onToggleStatus,
    onToggleFeatured,
    togglingStatus,
    handleToggleStatus,
  };

  const showInitialLoader = loading && products.length === 0;

  return (
    <>
      {/* Filters */}
      <div className="border-b border-stone-200 p-3 sm:p-4">
        <ProductFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={onStatusFilterChange}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          availableCategories={availableCategories}
          collectionFilter={collectionFilter}
          setCollectionFilter={setCollectionFilter}
          onCurrentPageReset={resetCurrentPage}
          resultCount={filteredProducts.length}
          totalCount={products.length}
          onClearFilters={handleClearAllFilters}
        />
      </div>

      {error && (
        <div className="p-3 sm:p-6">
          <ErrorState error={error} onRetry={onRetry} />
        </div>
      )}

      {showInitialLoader ? (
        <LoadingState />
      ) : error && products.length === 0 ? null : currentProducts.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClearFilters={handleClearAllFilters} />
      ) : (
        <div className={loading ? "pointer-events-none opacity-60 transition-opacity" : "transition-opacity"} aria-busy={loading}>
          {/* Phones / small tablets: stacked cards */}
          <ul className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 sm:gap-3 sm:p-4 md:hidden">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} {...itemProps} />
            ))}
          </ul>

          {/* md and up: table */}
          <Table wrapperClassName="hidden md:block">
            <THead>
              <tr>
                <TH className={productCell.first}>Product</TH>
                <TH className={productCell.mid}>Price</TH>
                <TH className={cn("hidden xl:table-cell", productCell.mid)}>Inventory</TH>
                <TH className={productCell.mid}>Status</TH>
                <TH align="right" className={cn("relative", productCell.last)}>
                  <span className="sr-only">Actions</span>
                </TH>
              </tr>
            </THead>
            <TBody>
              {currentProducts.map((product) => (
                <ProductRow key={product.id} product={product} {...itemProps} />
              ))}
            </TBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!showInitialLoader && (
        <ProductPagination
          currentPage={page}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          filteredCount={filteredProducts.length}
          pageSize={productsPerPage}
        />
      )}
    </>
  );
}
