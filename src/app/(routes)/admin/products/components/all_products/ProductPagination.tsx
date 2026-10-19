"use client";
import React from "react";
import { Pagination } from "@/components/admin/ui";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  filteredCount: number;
  pageSize: number;
}

/** Footer row: "Showing x to y of z products" + prev / page / next. */
export default function ProductPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  filteredCount,
  pageSize,
}: ProductPaginationProps) {
  if (filteredCount === 0) return null;

  return (
    <div className="border-t border-stone-200 px-4 py-3 sm:px-6">
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredCount}
        pageSize={pageSize}
        itemLabel={filteredCount === 1 ? "product" : "products"}
      />
    </div>
  );
}
