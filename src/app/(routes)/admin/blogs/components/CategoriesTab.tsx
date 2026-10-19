// src/app/(routes)/admin/blogs/components/CategoriesTab.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { CheckCircle2, Edit2, FileText, FolderOpen, Plus, Star, Trash2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  IconButton,
  LoadingState,
  StatCard,
  StatGrid,
  StatusBadge,
} from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { assetUrl } from '@/lib/productMedia';
import CategoryModal, { type CategoryInput } from './CategoryModal';
import blogCategoryService from '../services/blogCategoryService';
import { getErrorMessage } from '../_shared/apiError';


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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [pendingDelete, setPendingDelete] = useState<CategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();

    // The page header's "Add Category" button opens the create modal
    const handleOpenCreate = () => openCreateCategory();
    window.addEventListener('openCreateCategory', handleOpenCreate);

    return () => {
      window.removeEventListener('openCreateCategory', handleOpenCreate);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await blogCategoryService.getCategoriesWithCount();
      setCategories(categories);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(getErrorMessage(err, 'Failed to load categories. Please try again.'));
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
      setIsSaving(true);
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
      toast.error(getErrorMessage(error, 'Failed to save category. Please try again.', { upload: true }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!pendingDelete) return;
    try {
      setIsDeleting(true);
      await blogCategoryService.deleteCategory(pendingDelete.id);
      toast.success('Category deleted successfully');
      setPendingDelete(null);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);

      // Check if it's a 409 Conflict (category in use)
      const status = (error as { response?: { status?: number } })?.response?.status;
      toast.error(
        status === 409
          ? 'Cannot delete category: It is currently being used by one or more blog posts. Please reassign or delete those blogs first.'
          : getErrorMessage(error, 'Failed to delete category'),
        { duration: 6000 }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActiveCategory = async (id: string) => {
    if (!id || id === 'undefined') {
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
      toast.error(getErrorMessage(error, 'Failed to update category status'));
    }
  };

  const handleToggleFeaturedCategory = async (id: string) => {
    if (!id || id === 'undefined') {
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
      toast.error(getErrorMessage(error, 'Failed to update category featured status'));
    }
  };

  // Stable reference: the modal resets its fields whenever `initial` changes
  const modalInitial = useMemo(
    () =>
      editingCategory
        ? {
            name: editingCategory.name,
            description: editingCategory.description,
            active: editingCategory.active,
            thumbnailUrl: editingCategory.thumbnailUrl,
            bannerUrl: editingCategory.bannerUrl
          }
        : undefined,
    [editingCategory]
  );

  if (isLoading && categories.length === 0) {
    return <LoadingState card label="Loading categories..." />;
  }

  if (error) {
    return (
      <Alert tone="error" title="Error loading categories" onRetry={fetchCategories}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <StatGrid cols={4}>
        <StatCard size="sm" label="Total" value={categories.length} icon={FolderOpen} />
        <StatCard size="sm" label="Active" value={categories.filter(c => c.active).length} icon={CheckCircle2} tone="success" />
        <StatCard size="sm" label="Featured" value={categories.filter(c => c.featured).length} icon={Star} />
        <StatCard size="sm" label="Blogs" value={categories.reduce((acc, c) => acc + c.count, 0)} icon={FileText} tone="info" />
      </StatGrid>

      <Card padding="none">
        <div className="p-3 sm:p-6">
          {categories.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No categories yet"
              description="Get started by creating your first category."
              action={
                <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreateCategory}>
                  Add Category
                </Button>
              }
            />
          ) : (
            <ul role="list" className="space-y-2 sm:space-y-3">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="rounded-xl border border-stone-200 bg-stone-50 p-3 transition-all duration-200 hover:shadow-md sm:p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                      {/* Thumbnail */}
                      {cat.thumbnailUrl ? (
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border-2 border-stone-200 bg-white sm:h-14 sm:w-14">
                          <Image src={assetUrl(cat.thumbnailUrl)} alt={cat.name} fill className="object-cover" sizes="56px" />
                        </div>
                      ) : (
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-stone-200 bg-stone-200 text-base font-semibold text-stone-600 sm:h-14 sm:w-14 sm:text-xl">
                          {cat.name.charAt(0).toUpperCase()}
                        </span>
                      )}

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-sm font-semibold text-stone-900 sm:text-base">{cat.name}</h3>
                          {cat.featured && <Star className="h-3.5 w-3.5 flex-shrink-0 fill-current text-stone-900" aria-label="Featured" />}
                        </div>
                        <p className="truncate text-xs text-stone-500 sm:text-sm">/{cat.slug}</p>
                        {cat.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-stone-600 sm:text-sm">{cat.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Banner preview */}
                    {cat.bannerUrl && (
                      <div className="relative hidden h-14 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white lg:block">
                        <Image
                          src={assetUrl(cat.bannerUrl)}
                          alt={`${cat.name} banner`}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                        <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Banner
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 border-t border-stone-200 pt-2 sm:justify-end sm:border-0 sm:pt-0">
                      {/* Badges */}
                      <div className="flex items-center gap-2">
                        <Badge size="sm">
                          {cat.count} {cat.count === 1 ? 'blog' : 'blogs'}
                        </Badge>
                        <StatusBadge size="sm" status={cat.active ? 'active' : 'inactive'} />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <IconButton
                          label={cat.featured ? 'Remove from featured' : 'Mark as featured'}
                          icon={<Star className={cn('h-4 w-4', cat.featured && 'fill-current')} />}
                          onClick={() => handleToggleFeaturedCategory(cat.id)}
                          className={cn(
                            cat.featured
                              ? 'bg-stone-900 text-white hover:bg-stone-800 hover:text-white'
                              : 'bg-white text-stone-400 ring-1 ring-stone-200 hover:bg-stone-100 hover:text-stone-700'
                          )}
                        />
                        <IconButton
                          label={cat.active ? 'Deactivate' : 'Activate'}
                          icon={cat.active ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          onClick={() => {
                            if (cat.id) {
                              handleToggleActiveCategory(cat.id);
                            } else {
                              toast.error('Error: Category ID is missing');
                            }
                          }}
                          className={cn(
                            cat.active
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
                              : 'bg-white text-stone-400 ring-1 ring-stone-200 hover:bg-stone-100 hover:text-stone-700'
                          )}
                        />
                        <IconButton
                          label="Edit"
                          icon={<Edit2 className="h-4 w-4" />}
                          onClick={() => openEditCategory(cat.id)}
                          className="bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
                        />
                        <IconButton
                          label="Delete"
                          tone="danger"
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => setPendingDelete(cat)}
                          className="bg-white text-red-500 ring-1 ring-stone-200 hover:bg-red-50 hover:text-red-600"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <CategoryModal
        open={categoryModalOpen}
        mode={categoryModalMode}
        saving={isSaving}
        initial={modalInitial}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleSubmitCategory}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete category?"
        message={
          <div className="space-y-2">
            <p>
              <span className="font-medium text-stone-900">{pendingDelete?.name}</span> will be removed permanently. This
              action cannot be undone.
            </p>
            {pendingDelete && pendingDelete.count > 0 && (
              <p className="text-amber-700">
                It is used by {pendingDelete.count} {pendingDelete.count === 1 ? 'blog' : 'blogs'}. Move those posts to
                another category first so they aren&apos;t left without one.
              </p>
            )}
          </div>
        }
        confirmLabel="Delete category"
        loading={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDeleteCategory}
      />
    </>
  );
}
