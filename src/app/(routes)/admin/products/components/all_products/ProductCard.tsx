"use client";
import React from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { Product } from "../AllProducts";

interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: 'published' | 'draft') => Promise<void>;
  onToggleFeatured?: (id: string) => void;
  togglingStatus: Set<string>;
  handleToggleStatus: (productId: string, currentStatus: 'published' | 'draft' | 'out_of_stock') => Promise<void>;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  togglingStatus,
  handleToggleStatus
}: ProductCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) =>
    status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <tr key={product.id} className="hover:bg-gray-50">
      {/* Product Info */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            {(() => {
              // For variant products, show placeholder instead of first color thumbnail
              if (product.productType === "variant") {
                return (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-100 to-blue-200 border border-gray-200 shadow-sm flex items-center justify-center">
                    <span className="text-sm font-semibold text-indigo-600">
                      {product.variants?.length || 0}
                    </span>
                  </div>
                );
              } else {
                // For single products, use thumbnailUrl or bannerUrls
                const displayImage = product.thumbnailUrl || product.bannerUrls?.[0] || product.image || "/images/logo.png";
                return (
                  <Image
                    className="h-12 w-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                    src={displayImage.startsWith('/') ? `http://localhost:3001${displayImage}` : displayImage}
                    alt={product.name}
                    width={48}
                    height={48}
                  />
                );
              }
            })()}
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className="text-sm font-medium text-gray-900 truncate" title={product.name}>{product.name}</div>
              {product.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>
            {product.slug && (
              <div className="text-xs text-gray-500 truncate mb-1">/{product.slug}</div>
            )}
            {/* Category and Collection */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {/* Category Badge */}
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {product.category}
              </span>

              {/* Collection Badge */}
              {product.collectionType && product.collectionType !== 'none' && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  product.collectionType === 'theme'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-pink-100 text-pink-700 border border-pink-200'
                }`} title={`${product.collectionType === 'theme' ? 'Theme' : 'Series'}: ${product.collectionId}`}>
                  {product.collectionType === 'theme' ? '🎨 Theme' : '📚 Series'}: {product.collectionId}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Variants */}
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          {product.productType === "variant" ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Variant
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  {product.variants?.length || 0} variants
                </span>
              </div>
              {product.variants && product.variants.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.from(new Set(product.variants.map(v => v.color))).slice(0, 4).map((color, idx) => (
                    <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border">
                      {color}
                    </span>
                  ))}
                  {Array.from(new Set(product.variants.map(v => v.color))).length > 4 && (
                    <span className="text-xs text-gray-400">+{Array.from(new Set(product.variants.map(v => v.color))).length - 4} more</span>
                  )}
                </div>
              )}
            </>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Single
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}>
          {formatStatus(product.status)}
        </span>
      </td>

      {/* Price */}
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex flex-col">
          {product.productType === "variant" && product.variants && product.variants.length > 0 ? (
            <>
              <span className="font-medium">
                ${Math.min(...product.variants.map(v => v.price)).toFixed(2)} - ${Math.max(...product.variants.map(v => v.price)).toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                {product.variants.length} price points
              </span>
            </>
          ) : (
            <>
              <span className="font-medium">${product.price.toFixed(2)}</span>
              {product.discountedPrice && product.discountedPrice < product.price && (
                <span className="text-xs text-green-600">
                  Sale: ${product.discountedPrice.toFixed(2)}
                </span>
              )}
            </>
          )}
        </div>
      </td>

      {/* Stock */}
      <td className="px-3 py-4 whitespace-nowrap text-sm">
        <div className="flex flex-col">
          <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
            {product.stock} {product.stock === 1 ? "item" : "items"}
          </span>
          {product.productType === "variant" && product.variants && product.variants.length > 0 && (
            <span className="text-xs text-gray-500">
              {product.variants.filter(v => v.stock > 0).length} of {product.variants.length} in stock
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-red-500">Low Stock</span>
          )}
          {product.stock === 0 && (
            <span className="text-xs text-red-500">Out of Stock</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-3">
          {/* Status Toggle */}
          {onToggleStatus && product.status !== 'out_of_stock' && (
            <button
              onClick={() => handleToggleStatus(product.id, product.status)}
              disabled={togglingStatus.has(product.id)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                ${product.status === 'published' 
                  ? 'bg-green-600' 
                  : 'bg-gray-200'
                }
                ${togglingStatus.has(product.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={`Click to ${product.status === 'published' ? 'unpublish' : 'publish'}`}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
                  ${product.status === 'published' ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
              {togglingStatus.has(product.id) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                </div>
              )}
            </button>
          )}

          {/* Featured Toggle */}
          <button
            title={product.featured ? "Remove from featured" : "Make featured"}
            onClick={() => onToggleFeatured?.(product.id)}
            className={"text-sm " + (product.featured ? "text-yellow-600 hover:text-yellow-700" : "text-gray-400 hover:text-gray-500")}
          >
            <FiStar className={`h-5 w-5 ${product.featured ? 'fill-current' : ''}`} />
          </button>

          {/* Edit Button */}
          <button 
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50" 
            onClick={() => onEdit?.(product.id)}
            title="Edit product"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>

          {/* Delete Button */}
          <button 
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" 
            onClick={() => onDelete?.(product.id)}
            title="Delete product"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}