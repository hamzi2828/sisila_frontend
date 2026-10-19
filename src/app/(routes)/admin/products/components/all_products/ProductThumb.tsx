"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "../AllProducts";
import { getProductImage } from "./productImage";

interface ProductThumbProps {
  product: Product;
  className?: string;
  /** Rendered pixel size, used for the `sizes` hint. */
  size?: number;
}

/** Square product image with a neutral placeholder when there is no (loadable) image. */
export default function ProductThumb({ product, className, size = 48 }: ProductThumbProps) {
  const src = getProductImage(product);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!src && failedSrc !== src;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-100",
        className
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={product.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <Package className="h-5 w-5 text-stone-400" aria-hidden />
      )}
    </div>
  );
}
