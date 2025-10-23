"use client";
import React, { useMemo, useState } from "react";
import {
  ProductStats,
  ProductFilters,
  ProductCard,
  ProductPagination,
  EmptyState,
  LoadingState,
  ErrorState
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
}

interface AllProductsProps {
  products: Product[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: 'published' | 'draft') => Promise<void>;
  onToggleFeatured?: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function AllProducts({ 
  products, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onToggleFeatured, 
  loading = false, 
  error = null 
}: AllProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "out_of_stock">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingStatus, setTogglingStatus] = useState<Set<string>>(new Set());
  const productsPerPage = 10;

  // Get unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(products.map(p => p.category))).sort();
    return categories;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

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

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <ProductStats 
        products={products} 
        filteredCount={filteredProducts.length} 
      />

      {/* Filters */}
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        availableCategories={availableCategories}
        onCurrentPageReset={resetCurrentPage}
      />

      {/* Products Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0 w-1/3">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Variants
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Stock
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleStatus={onToggleStatus}
                        onToggleFeatured={onToggleFeatured}
                        togglingStatus={togglingStatus}
                        handleToggleStatus={handleToggleStatus}
                      />
                    ))
                  ) : (
                    <EmptyState
                      searchQuery={searchQuery}
                      statusFilter={statusFilter}
                      categoryFilter={categoryFilter}
                      onClearFilters={handleClearAllFilters}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        filteredCount={filteredProducts.length}
        indexOfFirstProduct={indexOfFirstProduct}
        indexOfLastProduct={indexOfLastProduct}
      />
    </div>
  );
}