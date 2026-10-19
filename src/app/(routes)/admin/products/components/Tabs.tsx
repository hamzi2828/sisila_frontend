"use client";
import React from "react";
import type { ComponentType } from "react";
import { FolderTree, Package, Palette } from "lucide-react";
import { Tabs as AdminTabs, type TabItem } from "@/components/admin/ui";

export type ProductsTabKey = "all" | "categories" | "attributes";

export const PRODUCT_TAB_KEYS: ProductsTabKey[] = ["all", "categories", "attributes"];

interface ProductTabsProps {
  value: ProductsTabKey;
  onChange: (key: ProductsTabKey) => void;
  productCount?: number;
  categoryCount?: number;
  className?: string;
}

/** Icon shown from sm up only, so all three tabs fit on a phone. */
function TabIcon({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return <Icon className="hidden h-4 w-4 sm:block" aria-hidden />;
}

/** Underline tabs at the top of the products card: All Products / Categories / Colors & Sizes. */
export default function Tabs({ value, onChange, productCount, categoryCount, className }: ProductTabsProps) {
  const tabs: TabItem<ProductsTabKey>[] = [
    {
      key: "all",
      label: (
        <>
          <TabIcon icon={Package} />
          <span className="sm:hidden">Products</span>
          <span className="hidden sm:inline">All Products</span>
        </>
      ),
      count: productCount,
    },
    {
      key: "categories",
      label: (
        <>
          <TabIcon icon={FolderTree} />
          Categories
        </>
      ),
      count: categoryCount,
    },
    {
      key: "attributes",
      label: (
        <>
          <TabIcon icon={Palette} />
          Colors &amp; Sizes
        </>
      ),
    },
  ];

  return <AdminTabs tabs={tabs} value={value} onChange={onChange} className={className} />;
}
