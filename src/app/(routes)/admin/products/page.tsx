// src/app/(routes)/admin/products/page.tsx
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';
import Tabs from './components/Tabs';
import AllProducts, { type Product } from './components/AllProducts';
import CategoriesTab, { type Category, type CategoryWithCount } from './components/CategoriesTab';
import ColorsSizesTab from './components/ColorsSizesTab';
import CategoryModal, { type CategoryInput } from './components/CategoryModal';
import { categoryService } from './services/categoryService';
import { slugify } from './services/productCreateService';
import { productService } from './services/productService';

const ProductsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'categories' | 'attributes'>('all');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodError, setProdError] = useState<string | null>(null);

  // Categories state (dynamic from API)
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    msg: '',
    type: 'success',
  });
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type }), 2500);
  };

  useEffect(() => {
    const load = async () => {
      setCatLoading(true);
      setCatError(null);
      try {
        const list = await categoryService.listCategories();
        setCategories(list as unknown as Category[]);
      } catch (e) {
        console.error('Failed to load categories', e);
        // Fallback seed from product categories so UI still works
        const unique = Array.from(new Set(products.map((p) => p.category)));
        setCategories(
          unique.map((name, i) => ({
            id: `c-${i + 1}`,
            name,
            slug: slugify(name),
            description: '',
            active: true,
          }))
        );
        setCatError('Could not fetch categories from server. Using local fallback.');
      } finally {
        setCatLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loader to fetch products
  const loadProducts = useCallback(async () => {
    setProdLoading(true);
    setProdError(null);
    try {
      const list = await productService.listProducts();
      setProducts(list as unknown as Product[]);
    } catch (e) {
      console.error('Failed to load products', e);
      setProdError('Could not fetch products from server.');
    } finally {
      setProdLoading(false);
    }
  }, []);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Refetch whenever switching to the All Products tab
  useEffect(() => {
    if (activeTab === 'all') {
      loadProducts();
    }
  }, [activeTab, loadProducts]);

  // Refetch categories when switching to the Categories tab
  useEffect(() => {
    const loadCategories = async () => {
      if (activeTab !== 'categories') return;
      setCatLoading(true);
      setCatError(null);
      try {
        const list = await categoryService.listCategories();
        setCategories(list as unknown as Category[]);
      } catch (e) {
        console.error('Failed to load categories', e);
        setCatError('Could not fetch categories from server.');
      } finally {
        setCatLoading(false);
      }
    };
    loadCategories();
  }, [activeTab]);

  const categoriesWithCount: CategoryWithCount[] = useMemo(
    () =>
      categories.map((cat) => {
        const categoryProducts = products.filter((p) => p.category === cat.name);
        const activeCount = categoryProducts.filter(p => p.status === 'published').length;
        const inactiveCount = categoryProducts.filter(p => p.status === 'draft').length;
        return {
          ...cat,
          count: categoryProducts.length,
          activeCount,
          inactiveCount,
        };
      }),
    [categories, products]
  );

  // Calculate active and inactive product counts
  const productCounts = useMemo(() => {
    const activeCount = products.filter(p => p.status === 'published').length;
    const inactiveCount = products.filter(p => p.status === 'draft').length;
    return { active: activeCount, inactive: inactiveCount, total: products.length };
  }, [products]);

  

  // Category modal state and handlers
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
    try {
      if (categoryModalMode === 'create') {
        const created = await categoryService.createCategory(data);
        setCategories((prev) => [(created as unknown as Category), ...prev]);
      } else if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory.id, data);
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? ((updated as unknown as Category)) : c)));
      }
    } catch (e) {
      console.error('Failed to save category', e);
      alert('Failed to save category');
    } finally {
      setCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const prev = categories;
    setCategories((p) => p.filter((c) => c.id !== id));
    try {
      await categoryService.deleteCategory(id);
    } catch (e) {
      console.error('Failed to delete category', e);
      setCategories(prev);
      alert('Failed to delete category');
    }
  };

  const handleToggleActiveCategory = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    const nextActive = !target.active;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: nextActive } : c)));
    try {
      await categoryService.setActive(id, nextActive);
    } catch (e) {
      console.error('Failed to update category status', e);
      // revert on error
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: !nextActive } : c)));
      alert('Failed to update category');
    }
  };

  const handleToggleFeaturedCategory = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    const nextFeatured = !target.featured;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, featured: nextFeatured } : c)));
    try {
      await categoryService.setFeatured(id, nextFeatured);
    } catch (e) {
      console.error('Failed to update category featured status', e);
      // revert on error
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, featured: !nextFeatured } : c)));
      alert('Failed to update category featured status');
    }
  };

  // Edit product handler
  const handleEditProduct = (id: string) => {
    router.push(`/admin/products/edit/${id}`);
  };

  // Delete product with confirm, optimistic UI, and refetch
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const prev = products;
    setProducts((p) => p.filter((x) => x.id !== id));
    try {
      await productService.deleteProduct(id);
      await loadProducts();
      showToast('Product deleted successfully', 'success');
    } catch (e) {
      console.error('Failed to delete product', e);
      setProducts(prev);
      showToast('Failed to delete product', 'error');
      alert('Failed to delete product');
    }
  };

  // Toggle product status handler
  const handleToggleProductStatus = async (id: string, newStatus: 'published' | 'draft') => {
    const prev = products;
    setProducts((p) => p.map((x) => x.id === id ? { ...x, status: newStatus } : x));
    try {
      await productService.toggleProductStatus(id, newStatus);
      showToast(`Product ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`, 'success');
    } catch (e) {
      console.error('Failed to toggle product status', e);
      setProducts(prev);
      showToast('Failed to update product status', 'error');
    }
  };

  // Toggle product featured handler
  const handleToggleFeaturedProduct = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const nextFeatured = !target.featured;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: nextFeatured } : p)));
    try {
      await productService.toggleFeatured(id, nextFeatured);
      showToast(`Product ${nextFeatured ? 'marked as featured' : 'removed from featured'} successfully`, 'success');
    } catch (e) {
      console.error('Failed to toggle product featured status', e);
      // revert on error
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !nextFeatured } : p)));
      showToast('Failed to update product featured status', 'error');
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow ${
            toast.type === 'success'
              ? 'bg-green-50 text-gray-800 border-l-4 border-green-400'
              : toast.type === 'error'
              ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
              : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
          }`}
        >
          <div className="flex items-center">
            <span className="font-medium">{toast.msg}</span>
            <button onClick={() => setToast({ show: false, msg: '', type: toast.type })} className="ml-3 text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your product inventory and listings</p>
        </div>
        {activeTab === 'categories' ? (
          <button
            onClick={openCreateCategory}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Category
          </button>
        ) : (
          <button
            onClick={() => router.push('/admin/products/create')}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Product
          </button>
        )}
      </div>

      <Tabs
        tabs={[
          {
            key: 'all',
            label: 'All Products',
            count: productCounts.total,
            additionalInfo: `${productCounts.active} Active • ${productCounts.inactive} Inactive`
          },
          { key: 'categories', label: 'Categories', count: categories.length },
          { key: 'attributes', label: 'Colors & Sizes' },
        ]}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'all' | 'categories' | 'attributes')}
      />

      {catError && (
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <p className="text-sm text-yellow-800">{catError}</p>
        </div>
      )}

      {activeTab === 'all' && (
        <AllProducts
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onToggleStatus={handleToggleProductStatus}
          onToggleFeatured={handleToggleFeaturedProduct}
          loading={prodLoading}
          error={prodError}
        />
      )}
      {activeTab === 'categories' && (
        catLoading ? (
          <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 text-sm text-gray-500">Loading categories…</div>
        ) : (
          <CategoriesTab
            categories={categoriesWithCount}
            onEdit={openEditCategory}
            onDelete={handleDeleteCategory}
            onToggleActive={handleToggleActiveCategory}
            onToggleFeatured={handleToggleFeaturedCategory}
          />
        )
      )}
      {activeTab === 'attributes' && (
        <ColorsSizesTab />
      )}

      <CategoryModal
        open={categoryModalOpen}
        mode={categoryModalMode}
        initial={editingCategory ? { 
          name: editingCategory.name, 
          description: editingCategory.description, 
          active: editingCategory.active,
          thumbnailUrl: editingCategory.thumbnailUrl,
          bannerUrl: editingCategory.bannerUrl
        } : undefined}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
};

export default ProductsPage;