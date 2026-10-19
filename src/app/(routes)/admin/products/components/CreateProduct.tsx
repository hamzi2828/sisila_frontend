"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";
import type { Category } from "./CategoriesTab";

interface CreateProductProps {
  categories: Category[];
  colorOptions: string[];
  sizeOptions: string[];
  onManageAttributes?: () => void;
  onSuccess?: () => void;
  /** Defaults to going back to the product list. */
  onCancel?: () => void;
}

export default function CreateProduct({
  categories,
  colorOptions,
  sizeOptions,
  onManageAttributes,
  onSuccess,
  onCancel
}: CreateProductProps) {
  const router = useRouter();
  return (
    <ProductForm
      mode="create"
      categories={categories}
      colorOptions={colorOptions}
      sizeOptions={sizeOptions}
      onManageAttributes={onManageAttributes}
      onSuccess={onSuccess}
      onCancel={onCancel ?? (() => router.push("/admin/products"))}
    />
  );
}
