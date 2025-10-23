"use client";
import React from "react";
import { FiPackage, FiStar } from "react-icons/fi";
import { Product } from "../AllProducts";

interface ProductStatsProps {
  products: Product[];
  filteredCount: number;
}

export default function ProductStats({ products, filteredCount }: ProductStatsProps) {
  const publishedCount = products.filter(p => p.status === 'published').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const variantCount = products.filter(p => p.productType === 'variant').length;
  const featuredCount = products.filter(p => p.featured).length;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Products Overview</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {filteredCount} of {products.length} products
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FiPackage className="h-4 w-4" />
              <span>{products.length} Total</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{variantCount} Variants</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{publishedCount} Published</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{draftCount} Draft</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-yellow-600">
              <FiStar className="h-3 w-3 fill-current" />
              <span>{featuredCount} Featured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}