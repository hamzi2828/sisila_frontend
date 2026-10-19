"use client";
import React, { useState, useEffect, useRef } from "react";
import ProductForm from "./ProductForm";
import type { Product } from "./AllProducts";
import type { Category } from "./CategoriesTab";
import { productService } from "../services/productService";
import { toast } from "react-hot-toast";
import { ArrowLeft, Package } from "lucide-react";
import { getApiErrorMessage } from "@/lib/apiError";
import { Button, EmptyState, LoadingState } from "@/components/admin/ui";

interface EditProductProps {
  productId: string;
  categories: Category[];
  colorOptions: string[];
  sizeOptions: string[];
  onManageAttributes?: () => void;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditProduct({
  productId,
  categories,
  colorOptions,
  sizeOptions,
  onManageAttributes,
  onCancel,
  onSuccess
}: EditProductProps) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  // Parents pass a new onCancel on every render; keep it out of the effect deps so a re-render
  // does not reload the product and wipe the admin's unsaved edits.
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error(`Could not load product: ${getApiErrorMessage(error)}`);
        onCancelRef.current();
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);
  
  if (loading) {
    return <LoadingState label="Loading product..." card />;
  }

  if (!product) {
    return (
      <EmptyState
        card
        icon={Package}
        title="Product not found"
        description="It may have been deleted. Go back to the product list and try again."
        action={
          <Button variant="secondary" onClick={onCancel} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to products
          </Button>
        }
      />
    );
  }

  return (
    <ProductForm
      mode="edit"
      initialData={product}
      categories={categories}
      colorOptions={colorOptions}
      sizeOptions={sizeOptions}
      onCancel={onCancel}
      onSuccess={onSuccess}
      onManageAttributes={onManageAttributes}
    />
  );
}