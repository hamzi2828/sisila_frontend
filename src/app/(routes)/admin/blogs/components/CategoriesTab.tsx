// src/app/(routes)/admin/blogs/components/CategoriesTab.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiStar } from 'react-icons/fi';
import CategoryModal, { type CategoryInput } from './CategoryModal';
import blogCategoryService  from '../services/blogCategoryService';
import { toast } from 'react-hot-toast';


// Frontend category interface with normalized ID
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  featured?: boolean;
  thumbnailUrl?: string;
  bannerUrl?: string;
}

// Extended interface that includes the count
export interface CategoryWithCount extends Category {
  count: number;
}

export default function CategoriesTab() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();

    // Listen for the custom event to open create modal
    const handleOpenCreate = () => openCreateCategory();
    window.addEventListener('openCreateCategory', handleOpenCreate);
    
    return () => {
      window.removeEventListener('openCreateCategory', handleOpenCreate);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      // The service now returns properly typed data
      const categories = await blogCategoryService.getCategoriesWithCount();
      console.log('Fetched categories:', categories);
      
      // The categories are already in the correct format from the service
      setCategories(categories);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again.');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryModalMode('create');
    setCategoryModalOpen(true);
  };

  const openEditCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id) || null;
    setEditingCategory(cat);
    setCategoryModalMode('edit');
    setCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (data: CategoryInput | FormData) => {
    // If it's FormData, convert it to CategoryInput
    let categoryData: CategoryInput;
    if (data instanceof FormData) {
      categoryData = {
        name: data.get('name') as string,
        slug: data.get('slug') as string,
        description: data.get('description') as string,
        active: data.get('active') === 'true',
      };
    } else {
      categoryData = data;
    }
    try {
      if (categoryModalMode === 'create') {
        await blogCategoryService.createCategory({
          name: categoryData.name,
          slug: categoryData.slug || blogCategoryService.slugify(categoryData.name),
          description: categoryData.description,
          active: categoryData.active,
          thumbnail: categoryData.thumbnail,
          banner: categoryData.banner,
        });
        toast.success('Category created successfully');
      } else if (editingCategory) {
        await blogCategoryService.updateCategory(editingCategory.id, {
          name: categoryData.name,
          slug: categoryData.slug || blogCategoryService.slugify(categoryData.name),
          description: categoryData.description,
          active: categoryData.active,
          thumbnail: categoryData.thumbnail,
          banner: categoryData.banner,
        });
        toast.success('Category updated successfully');
      }
      
      setCategoryModalOpen(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error('Failed to save category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // Optional: Add confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this category? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await blogCategoryService.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
      
      // More specific error handling
      let errorMessage = 'Failed to delete category';
      
      if (error && typeof error === 'object') {
        const axiosError = error as { response?: { data?: { message?: string }, status?: number } };
        
        // Check if it's a 409 Conflict (category in use)
        if (axiosError.response?.status === 409) {
          errorMessage = 'Cannot delete category: It is currently being used by one or more blog posts. Please reassign or delete those blogs first.';
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const handleToggleActiveCategory = async (id: string) => {
    console.log('Toggle active called with ID:', id);

    if (!id || id === undefined || id === 'undefined') {
      console.error('No category ID provided or ID is undefined');
      toast.error('Error: No category selected');
      return;
    }

    // Optimistically update the UI
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );

    try {
      const updatedCategory = await blogCategoryService.toggleCategoryActive(id);

      if (!updatedCategory) {
        throw new Error('No response from server');
      }

      // Verify the server's response matches our optimistic update
      if (updatedCategory.active !== !categories.find(c => c.id === id)?.active) {
        // If not, refetch to ensure consistency
        fetchCategories();
      }

      toast.success(`Category ${updatedCategory.active ? 'activated' : 'deactivated'} successfully`);
    } catch (error: unknown) {
      // Revert optimistic update on error
      fetchCategories();

      console.error('Error toggling category active status:', error);
      let errorMessage = 'Failed to update category status';

      if (error && typeof error === 'object') {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      }

      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleToggleFeaturedCategory = async (id: string) => {
    if (!id || id === undefined || id === 'undefined') {
      console.error('No category ID provided or ID is undefined');
      toast.error('Error: No category selected');
      return;
    }

    // Optimistically update the UI
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === id ? { ...cat, featured: !cat.featured } : cat
      )
    );

    try {
      const updatedCategory = await blogCategoryService.toggleCategoryFeatured(id);

      if (!updatedCategory) {
        throw new Error('No response from server');
      }

      toast.success(`Category ${updatedCategory.featured ? 'marked as featured' : 'removed from featured'} successfully`);
    } catch (error: unknown) {
      // Revert optimistic update on error
      fetchCategories();

      console.error('Error toggling category featured status:', error);
      let errorMessage = 'Failed to update category featured status';

      if (error && typeof error === 'object') {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      }

      toast.error(`Error: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
        <button
          onClick={() => fetchCategories()}
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Categories</h3>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories found.</p>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <li key={cat.id} className="py-4">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {cat.thumbnailUrl ? (
                        <div className="relative h-12 w-12 rounded-full border-2 border-gray-200 overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${cat.thumbnailUrl}`}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-lg font-semibold border-2 border-gray-200">
                          {cat.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="truncate">
                          <p className="text-sm font-medium text-gray-900 truncate">{cat.name}</p>
                          <p className="text-xs text-gray-500 truncate">/{cat.slug}</p>
                          {cat.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{cat.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {cat.count} {cat.count === 1 ? "blog" : "blogs"}
                          </span>
                          <button
                            title={cat.featured ? "Remove from featured" : "Mark as featured"}
                            onClick={() => handleToggleFeaturedCategory(cat.id)}
                            className={cat.featured ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-gray-500"}
                          >
                            <FiStar className={`h-5 w-5 ${cat.featured ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            title={cat.active ? "Set inactive" : "Set active"}
                            onClick={() => {
                              console.log('Button clicked for category:', cat); // Debug log
                              if (cat.id) {
                                handleToggleActiveCategory(cat.id);
                              } else {
                                console.error('Category has no ID:', cat);
                                toast.error('Error: Category ID is missing');
                              }
                            }}
                            className={"text-sm " + (cat.active ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-500")}
                          >
                            {cat.active ? <FiCheckCircle className="h-5 w-5" /> : <FiXCircle className="h-5 w-5" />}
                          </button>
                          <button
                            title="Edit"
                            onClick={() => openEditCategory(cat.id)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Banner Image */}
                      {cat.bannerUrl && (
                        <div className="mt-3">
                          <div className="relative w-full h-24 rounded-lg border border-gray-200 overflow-hidden">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${cat.bannerUrl}`}
                              alt={`${cat.name} banner`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute top-2 left-2">
                              <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                Banner
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CategoryModal
        open={categoryModalOpen}
        mode={categoryModalMode}
        initial={
          editingCategory
            ? {
                name: editingCategory.name,
                description: editingCategory.description,
                active: editingCategory.active,
                thumbnailUrl: editingCategory.thumbnailUrl,
                bannerUrl: editingCategory.bannerUrl
              }
            : undefined
        }
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleSubmitCategory}
      />
    </>
  );
}