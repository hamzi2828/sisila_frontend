"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FolderTree, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  Alert,
  Button,
  EmptyState,
  IconButton,
  LoadingState,
  StatusBadge,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "./all_products/productImage";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  active: boolean;
  featured?: boolean;
}

export interface CategoryWithCount extends Category {
  count: number;
  activeCount: number;
  inactiveCount: number;
}

interface CategoriesTabProps {
  categories: CategoryWithCount[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onCreate?: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function CategoryThumb({ category, className }: { category: Category; className?: string }) {
  const src = resolveImageUrl(category.thumbnailUrl);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-100",
        className
      )}
    >
      {src && failedSrc !== src ? (
        <Image src={src} alt={category.name} fill sizes="48px" className="object-cover" onError={() => setFailedSrc(src)} />
      ) : (
        <span className="text-sm font-semibold text-stone-500">{category.name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

function ActiveToggle({ category, onToggleActive }: { category: Category; onToggleActive: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onToggleActive(category.id)}
      title={category.active ? "Active – click to hide this category" : "Inactive – click to activate"}
      className="rounded-full transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30"
    >
      <StatusBadge status={category.active ? "active" : "inactive"} />
    </button>
  );
}

function CategoryActions({
  category,
  size,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  category: Category;
  size: "sm" | "md";
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1">
      <IconButton
        label={category.featured ? "Remove from featured" : "Mark as featured"}
        size={size}
        tone="warning"
        className={category.featured ? "text-amber-500 hover:text-amber-600" : undefined}
        aria-pressed={!!category.featured}
        icon={<Star className={cn("h-4 w-4", category.featured && "fill-current")} />}
        onClick={() => onToggleFeatured(category.id)}
      />
      <IconButton label="Edit category" size={size} icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(category.id)} />
      <IconButton
        label="Delete category"
        size={size}
        tone="danger"
        icon={<Trash2 className="h-4 w-4" />}
        onClick={() => onDelete(category.id)}
      />
    </div>
  );
}

/** Compact cell padding so the table fits the card at md/lg widths. */
const cell = {
  first: "pl-4 pr-3 sm:pl-4 sm:pr-3",
  mid: "px-3 sm:px-4",
  last: "pl-2 pr-3 sm:pl-2 sm:pr-3",
} as const;

const productLabel = (n: number) => `${n} ${n === 1 ? "product" : "products"}`;

export default function CategoriesTab({
  categories,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onCreate,
  loading,
  error,
  onRetry,
}: CategoriesTabProps) {
  if (loading && categories.length === 0) {
    return <LoadingState label="Loading categories..." />;
  }

  const errorBox = error ? (
    <div className="p-3 sm:p-6">
      <Alert tone="error" title="Couldn't load categories" onRetry={onRetry}>
        {error}
      </Alert>
    </div>
  ) : null;

  if (categories.length === 0) {
    return (
      <>
        {errorBox}
        {!error && (
          <EmptyState
            icon={FolderTree}
            title="No categories yet"
            description="Categories group products on the storefront."
            action={
              onCreate ? (
                <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onCreate}>
                  Add category
                </Button>
              ) : undefined
            }
          />
        )}
      </>
    );
  }

  const actionProps = { onEdit, onDelete, onToggleFeatured };

  return (
    <div className={loading ? "pointer-events-none opacity-60 transition-opacity" : "transition-opacity"} aria-busy={loading}>
      {errorBox}

      {/* Phones / small tablets: stacked cards */}
      <ul className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 sm:gap-3 sm:p-4 md:hidden">
        {categories.map((cat) => (
          <li key={cat.id} className="flex flex-col rounded-xl border border-stone-200 bg-white p-3">
            <div className="flex items-start gap-3">
              <CategoryThumb category={cat} className="h-12 w-12" />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="truncate text-sm font-semibold text-stone-900">{cat.name}</h3>
                  {cat.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />}
                </div>
                <p className="truncate text-xs text-stone-500">/{cat.slug}</p>
              </div>
              <ActiveToggle category={cat} onToggleActive={onToggleActive} />
            </div>
            {cat.description && <p className="mt-2 line-clamp-2 text-xs text-stone-500">{cat.description}</p>}
            <div className="grow" aria-hidden />
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-stone-200 pt-2">
              <p className="min-w-0 truncate text-xs text-stone-500">
                <span className="font-medium text-stone-700">{productLabel(cat.count)}</span>
                {cat.count > 0 && ` · ${cat.activeCount} published`}
              </p>
              <CategoryActions category={cat} size="sm" {...actionProps} />
            </div>
          </li>
        ))}
      </ul>

      {/* md and up: table */}
      <Table wrapperClassName="hidden md:block">
        <THead>
          <tr>
            <TH className={cell.first}>Category</TH>
            <TH className={cell.mid}>Products</TH>
            <TH className={cell.mid}>Status</TH>
            <TH align="right" className={cn("relative", cell.last)}>
              <span className="sr-only">Actions</span>
            </TH>
          </tr>
        </THead>
        <TBody>
          {categories.map((cat) => (
            <TR key={cat.id}>
              <TD className={cn("w-full max-w-0 py-3 whitespace-normal", cell.first)}>
                <div className="flex min-w-0 items-center gap-3">
                  <CategoryThumb category={cat} className="h-12 w-12" />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate font-medium text-stone-900">{cat.name}</span>
                      {cat.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />}
                      <span className="hidden truncate text-xs text-stone-400 lg:inline">/{cat.slug}</span>
                    </div>
                    {cat.description ? (
                      <p className="mt-0.5 truncate text-xs text-stone-500" title={cat.description}>
                        {cat.description}
                      </p>
                    ) : (
                      <p className="mt-0.5 truncate text-xs text-stone-500 lg:hidden">/{cat.slug}</p>
                    )}
                  </div>
                </div>
              </TD>
              <TD className={cn("py-3", cell.mid)}>
                <div className="font-medium text-stone-900">{productLabel(cat.count)}</div>
                <div className="text-xs text-stone-500">
                  {cat.activeCount} published · {cat.inactiveCount} draft
                </div>
              </TD>
              <TD className={cn("py-3", cell.mid)}>
                <ActiveToggle category={cat} onToggleActive={onToggleActive} />
              </TD>
              <TD align="right" className={cn("py-3", cell.last)}>
                <CategoryActions category={cat} size="md" {...actionProps} />
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
