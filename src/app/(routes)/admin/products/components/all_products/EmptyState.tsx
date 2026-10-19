"use client";
import React from "react";
import { Package, Plus, X } from "lucide-react";
import { Button, ButtonLink, EmptyState as AdminEmptyState } from "@/components/admin/ui";

interface EmptyStateProps {
  /** True when search/filters are hiding products (vs. an empty catalogue). */
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return hasFilters ? (
    <AdminEmptyState
      icon={Package}
      title="No products match"
      description="Try adjusting your search or filters."
      action={
        <Button variant="secondary" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={onClearFilters}>
          Clear filters
        </Button>
      }
    />
  ) : (
    <AdminEmptyState
      icon={Package}
      title="No products yet"
      description="Create your first product to start selling."
      action={
        <ButtonLink href="/admin/products/create" leftIcon={<Plus className="h-4 w-4" />}>
          Add product
        </ButtonLink>
      }
    />
  );
}
