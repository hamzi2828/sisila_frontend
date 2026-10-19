"use client";
import React from "react";
import { CheckCircle2, FileEdit, Layers, Package, PackageX, Star } from "lucide-react";
import { StatCard, StatGrid } from "@/components/admin/ui";
import type { Product } from "../AllProducts";

export type ProductStatusFilter = "all" | "published" | "draft" | "out_of_stock";

interface ProductStatsProps {
  products: Product[];
  loading?: boolean;
  /** Current status filter; highlights the matching tile when `highlight` is true. */
  statusFilter?: ProductStatusFilter;
  highlight?: boolean;
  /** Makes the status tiles act as quick filters. */
  onStatusSelect?: (status: ProductStatusFilter) => void;
}

export default function ProductStats({ products, loading, statusFilter = "all", highlight = true, onStatusSelect }: ProductStatsProps) {
  const count = (fn: (p: Product) => boolean) => (loading ? "–" : products.filter(fn).length);
  const select = (status: ProductStatusFilter) => (onStatusSelect ? () => onStatusSelect(status) : undefined);
  const isActive = (status: ProductStatusFilter) => highlight && !!onStatusSelect && statusFilter === status;

  return (
    <StatGrid cols={6} className="grid-cols-3 gap-1.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        size="sm"
        label="Total"
        value={loading ? "–" : products.length}
        icon={Package}
        active={isActive("all")}
        onClick={select("all")}
      />
      <StatCard
        size="sm"
        label="Published"
        value={count((p) => p.status === "published")}
        icon={CheckCircle2}
        tone="success"
        active={isActive("published")}
        onClick={select("published")}
      />
      <StatCard
        size="sm"
        label="Draft"
        value={count((p) => p.status === "draft")}
        icon={FileEdit}
        tone="warning"
        active={isActive("draft")}
        onClick={select("draft")}
      />
      <StatCard
        size="sm"
        label="Out of stock"
        value={count((p) => p.status === "out_of_stock")}
        icon={PackageX}
        tone="danger"
        active={isActive("out_of_stock")}
        onClick={select("out_of_stock")}
      />
      <StatCard size="sm" label="Featured" value={count((p) => !!p.featured)} icon={Star} tone="warning" />
      <StatCard size="sm" label="Variants" value={count((p) => p.productType === "variant")} icon={Layers} tone="violet" />
    </StatGrid>
  );
}
