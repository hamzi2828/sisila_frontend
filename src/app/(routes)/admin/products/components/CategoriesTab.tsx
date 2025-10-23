"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiStar } from "react-icons/fi";

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
}

export default function CategoriesTab({ categories, onEdit, onDelete, onToggleActive, onToggleFeatured }: CategoriesTabProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (categoryId: string) => {
    setImageErrors(prev => new Set([...prev, categoryId]));
  };

  const getImageSrc = (thumbnailUrl: string) => {
    return thumbnailUrl.startsWith('/') 
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${thumbnailUrl}` 
      : thumbnailUrl;
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Categories</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found.</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <li key={cat.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {cat.thumbnailUrl && !imageErrors.has(cat.id) ? (
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                      <Image
                        src={getImageSrc(cat.thumbnailUrl)}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        onError={() => handleImageError(cat.id)}
                      />
                    </div>
                  ) : (
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 text-sm font-semibold">
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-900 truncate">{cat.name}</p>
                    <p className="text-xs text-gray-500 truncate">/{cat.slug}</p>
                    {cat.description && (
                      <p className="text-xs text-gray-400 truncate mt-1">{cat.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {cat.activeCount} Active
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {cat.inactiveCount} Inactive
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {cat.count} {cat.count === 1 ? "product" : "products"} total
                    </span>
                  </div>
                  {cat.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                  <button
                    title={cat.featured ? "Remove from featured" : "Make featured"}
                    onClick={() => onToggleFeatured(cat.id)}
                    className={"text-sm " + (cat.featured ? "text-yellow-600 hover:text-yellow-700" : "text-gray-400 hover:text-gray-500")}
                  >
                    <FiStar className={`h-5 w-5 ${cat.featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    title={cat.active ? "Set inactive" : "Set active"}
                    onClick={() => onToggleActive(cat.id)}
                    className={"text-sm " + (cat.active ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-500")}
                  >
                    {cat.active ? <FiCheckCircle className="h-5 w-5" /> : <FiXCircle className="h-5 w-5" />}
                  </button>
                  <button title="Edit" onClick={() => onEdit(cat.id)} className="text-indigo-600 hover:text-indigo-800">
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button title="Delete" onClick={() => onDelete(cat.id)} className="text-red-600 hover:text-red-800">
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
