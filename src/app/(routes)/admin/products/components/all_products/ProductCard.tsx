"use client";
import React from "react";
import Link from "next/link";
import { Pencil, Star, Trash2 } from "lucide-react";
import { IconButton, StatusBadge, Switch, TD, TR } from "@/components/admin/ui";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import type { Product } from "../AllProducts";
import ProductThumb from "./ProductThumb";
import { formatCollectionId, getPriceRange, getVariantColors } from "./productImage";

type ProductStatus = Product["status"];

export interface ProductItemProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
  /** Present when publishing is allowed from the list. */
  onToggleStatus?: (id: string, newStatus: "published" | "draft") => Promise<void>;
  togglingStatus: Set<string>;
  handleToggleStatus: (productId: string, currentStatus: ProductStatus) => Promise<void>;
}

const editHref = (id: string) => `/admin/products/edit/${id}`;

/** "Poetry · Series: Poets" */
function metaLine(product: Product) {
  const parts = [product.category || "Uncategorised"];
  if (product.collectionType && product.collectionType !== "none") {
    const kind = product.collectionType === "theme" ? "Theme" : "Series";
    parts.push(product.collectionId ? `${kind}: ${formatCollectionId(product.collectionId)}` : kind);
  }
  return parts.join(" · ");
}

function variantSummary(product: Product) {
  if (product.productType !== "variant") return "Single product";
  const count = product.variants?.length ?? 0;
  return `${count} ${count === 1 ? "variant" : "variants"}`;
}

function Price({ product, compact }: { product: Product; compact?: boolean }) {
  const range = getPriceRange(product);
  if (range) {
    return (
      <span className="whitespace-nowrap font-semibold text-stone-900">
        {range.min === range.max ? formatPrice(range.min) : `${formatPrice(range.min)} – ${formatPrice(range.max)}`}
      </span>
    );
  }
  const onSale = !!product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price;
  if (!onSale) return <span className="whitespace-nowrap font-semibold text-stone-900">{formatPrice(product.price)}</span>;
  return (
    <span className={cn("inline-flex flex-wrap items-baseline whitespace-nowrap", compact ? "gap-x-1.5" : "gap-x-2")}>
      <span className="font-semibold text-stone-900">{formatPrice(product.discountedPrice)}</span>
      <span className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</span>
    </span>
  );
}

/** Stock + variant summary ("54 in stock" / "12 variants · 2 sold out"). */
function Inventory({ product }: { product: Product }) {
  const variants = product.productType === "variant" ? product.variants ?? [] : [];
  const soldOut = variants.filter((v) => !(v.stock > 0)).length;
  const colors = getVariantColors(product);
  const detail =
    product.productType === "variant"
      ? `${variantSummary(product)}${soldOut > 0 ? ` · ${soldOut} sold out` : colors.length > 0 ? ` · ${colors.length} ${colors.length === 1 ? "colour" : "colours"}` : ""}`
      : "Single product";

  return (
    <div className="max-w-[13rem]" title={colors.length > 0 ? `Colours: ${colors.join(", ")}` : undefined}>
      {product.stock <= 0 ? (
        <div className="font-medium text-red-600">Out of stock</div>
      ) : (
        <div>
          <span className="font-medium text-stone-900">{product.stock}</span>{" "}
          <span className={product.stock <= 5 ? "font-medium text-amber-600" : "text-stone-500"}>
            {product.stock <= 5 ? "left · low stock" : "in stock"}
          </span>
        </div>
      )}
      <div className={cn("truncate text-xs", soldOut > 0 ? "text-amber-600" : "text-stone-500")}>{detail}</div>
    </div>
  );
}

/** Compact cell padding so the table fits the card from md (no sidebar) and lg (sidebar) up. */
export const productCell = {
  first: "pl-4 pr-3 sm:pl-4 sm:pr-3",
  mid: "px-3 sm:px-3",
  last: "pl-2 pr-3 sm:pl-2 sm:pr-3",
} as const;

function ProductActions({
  product,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
  togglingStatus,
  handleToggleStatus,
  size,
  idPrefix,
}: ProductItemProps & { size: "sm" | "md"; idPrefix: "row" | "card" }) {
  const toggling = togglingStatus.has(product.id);
  const canPublish = !!onToggleStatus && product.status !== "out_of_stock";
  const switchId = `publish-${idPrefix}-${product.id}`;
  const switchTitle =
    product.status === "out_of_stock"
      ? "Out of stock products can't be published from the list"
      : product.status === "published"
        ? "Published – click to unpublish"
        : "Draft – click to publish";

  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
      {onToggleStatus && (
        <span title={switchTitle} className={cn("relative mr-1 inline-flex", toggling && "animate-pulse")}>
          <label htmlFor={switchId} className="sr-only">
            {product.status === "published" ? "Unpublish" : "Publish"} {product.name}
          </label>
          <Switch
            id={switchId}
            checked={product.status === "published"}
            disabled={!canPublish || toggling}
            onChange={() => handleToggleStatus(product.id, product.status)}
          />
        </span>
      )}
      <IconButton
        label={product.featured ? "Remove from featured" : "Mark as featured"}
        size={size}
        tone="warning"
        className={product.featured ? "text-amber-500 hover:text-amber-600" : undefined}
        icon={<Star className={cn("h-4 w-4", product.featured && "fill-current")} />}
        aria-pressed={!!product.featured}
        onClick={() => onToggleFeatured?.(product.id)}
      />
      <IconButton label="Edit product" size={size} icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit?.(product.id)} />
      <IconButton
        label="Delete product"
        size={size}
        tone="danger"
        icon={<Trash2 className="h-4 w-4" />}
        onClick={() => onDelete?.(product.id)}
      />
    </div>
  );
}

/** Table row (md and up). */
export function ProductRow(props: ProductItemProps) {
  const { product } = props;

  return (
    <TR>
      <TD className={cn("w-full max-w-0 py-3 whitespace-normal", productCell.first)}>
        <div className="flex min-w-0 items-center gap-3">
          <ProductThumb product={product} className="h-12 w-12" />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <Link
                href={editHref(product.id)}
                title={product.name}
                className="truncate font-medium text-stone-900 underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
              >
                {product.name}
              </Link>
              {product.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />}
            </div>
            <p className="mt-0.5 truncate text-xs text-stone-500" title={metaLine(product)}>
              {metaLine(product)}
            </p>
          </div>
        </div>
      </TD>

      <TD className={cn("py-3", productCell.mid)}>
        <Price product={product} />
      </TD>

      <TD className={cn("hidden py-3 xl:table-cell", productCell.mid)}>
        <Inventory product={product} />
      </TD>

      <TD className={cn("py-3", productCell.mid)}>
        <StatusBadge status={product.status} />
      </TD>

      <TD align="right" className={cn("py-3", productCell.last)}>
        <div className="flex justify-end">
          <ProductActions {...props} size="sm" idPrefix="row" />
        </div>
      </TD>
    </TR>
  );
}

/** Stacked card (below md). */
export default function ProductCard(props: ProductItemProps) {
  const { product } = props;
  const stockLabel = product.stock <= 0 ? "Out of stock" : `${product.stock} in stock`;

  return (
    <li className="flex flex-col rounded-xl border border-stone-200 bg-white p-3 transition-shadow duration-200 hover:shadow-md">
      <div className="flex gap-3">
        <ProductThumb product={product} className="h-16 w-16" size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={editHref(product.id)}
              className="line-clamp-2 text-sm font-semibold text-stone-900 underline-offset-4 hover:underline"
            >
              {product.name}
              {product.featured && (
                <Star className="ml-1 inline h-3.5 w-3.5 -translate-y-px fill-amber-400 text-amber-400" aria-label="Featured" />
              )}
            </Link>
            <StatusBadge status={product.status} size="sm" className="shrink-0" />
          </div>
          <p className="mt-0.5 truncate text-xs text-stone-500">{metaLine(product)}</p>
          <div className="mt-1 text-sm">
            <Price product={product} compact />
          </div>
        </div>
      </div>

      <div className="grow" aria-hidden />
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-stone-200 pt-2">
        <p
          className={cn(
            "min-w-0 truncate text-xs",
            product.stock <= 0 ? "font-medium text-red-600" : product.stock <= 5 ? "font-medium text-amber-600" : "text-stone-500"
          )}
        >
          {stockLabel}
          {product.productType === "variant" && <span className="text-stone-500"> · {variantSummary(product)}</span>}
        </p>
        <ProductActions {...props} size="sm" idPrefix="card" />
      </div>
    </li>
  );
}
