// src/app/(routes)/admin/products/page.tsx
'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  AdminPage,
  Button,
  ButtonLink,
  Card,
  ConfirmDialog,
  PageHeader,
} from '@/components/admin/ui';
import Tabs, { PRODUCT_TAB_KEYS, type ProductsTabKey } from './components/Tabs';
import AllProducts, { type Product } from './components/AllProducts';
import { ProductStats, type ProductStatusFilter } from './components/all_products';
import CategoriesTab, { type Category, type CategoryWithCount } from './components/CategoriesTab';
import ColorsSizesTab from './components/ColorsSizesTab';
import CategoryModal, { type CategoryInput } from './components/CategoryModal';
import { categoryService } from './services/categoryService';
import { productService } from './services/productService';

const ProductsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProductsTabKey>('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>('all');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState<string | null>(null);

  // Categories state (dynamic from API)
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  // Delete confirmations
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  // Open the tab requested in the URL (e.g. /admin/products?tab=attributes from the product form)
  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab && (PRODUCT_TAB_KEYS as string[]).includes(tab)) setActiveTab(tab as ProductsTabKey);
  }, []);

  const changeTab = (key: ProductsTabKey) => {
    setActiveTab(key);
    const url = new URL(window.location.href);
    if (key === 'all') url.searchParams.delete('tab');
    else url.searchParams.set('tab', key);
    window.history.replaceState(window.history.state, '', url.pathname + url.search);
  };

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

  const loadCategories = useCallback(async () => {
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
  }, []);

  // Load both lists once (stats + tab counts), then refetch whenever the
  // All Products / Categories tab is opened again.
  const loaded = useRef({ products: false, categories: false });
  useEffect(() => {
    if (activeTab === 'all' || !loaded.current.products) {
      loaded.current.products = true;
      loadProducts();
    }
    if (activeTab === 'categories' || !loaded.current.categories) {
      loaded.current.categories = true;
      loadCategories();
    }
  }, [activeTab, loadProducts, loadCategories]);

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

  // Category modal state and handlers
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Memoised so the modal doesn't reset its fields on unrelated re-renders
  const categoryModalInitial = useMemo<Partial<CategoryInput> | undefined>(
    () =>
      editingCategory
        ? {
            name: editingCategory.name,
            description: editingCategory.description,
            active: editingCategory.active,
            featured: editingCategory.featured,
            thumbnailUrl: editingCategory.thumbnailUrl,
            bannerUrl: editingCategory.bannerUrl,
          }
        : undefined,
    [editingCategory]
  );

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
        toast.success('Category created');
      } else if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory.id, data);
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? ((updated as unknown as Category)) : c)));
        toast.success('Category updated');
      }
      setCategoryModalOpen(false);
    } catch (e) {
      console.error('Failed to save category', e);
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const { id, name } = categoryToDelete;
    setDeletingCategory(true);
    try {
      await categoryService.deleteCategory(id);
      setCategories((p) => p.filter((c) => c.id !== id));
      toast.success(`Category "${name}" deleted`);
      setCategoryToDelete(null);
    } catch (e) {
      console.error('Failed to delete category', e);
      toast.error('Failed to delete category');
    } finally {
      setDeletingCategory(false);
    }
  };

  const handleToggleActiveCategory = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    const nextActive = !target.active;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: nextActive } : c)));
    try {
      await categoryService.setActive(id, nextActive);
      toast.success(`"${target.name}" is now ${nextActive ? 'active' : 'inactive'}`);
    } catch (e) {
      console.error('Failed to update category status', e);
      // revert on error
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: !nextActive } : c)));
      toast.error('Failed to update category');
    }
  };

  const handleToggleFeaturedCategory = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    const nextFeatured = !target.featured;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, featured: nextFeatured } : c)));
    try {
      await categoryService.setFeatured(id, nextFeatured);
      toast.success(nextFeatured ? `"${target.name}" marked as featured` : `"${target.name}" removed from featured`);
    } catch (e) {
      console.error('Failed to update category featured status', e);
      // revert on error
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, featured: !nextFeatured } : c)));
      toast.error('Failed to update category featured status');
    }
  };

  // Edit product handler
  const handleEditProduct = (id: string) => {
    router.push(`/admin/products/edit/${id}`);
  };

  // Delete product (after ConfirmDialog), then refetch
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;
    setDeletingProduct(true);
    try {
      await productService.deleteProduct(id);
      setProducts((p) => p.filter((x) => x.id !== id));
      setProductToDelete(null);
      toast.success(`"${name}" deleted`);
      loadProducts();
    } catch (e) {
      console.error('Failed to delete product', e);
      toast.error('Failed to delete product');
    } finally {
      setDeletingProduct(false);
    }
  };

  // Toggle product status handler
  const handleToggleProductStatus = async (id: string, newStatus: 'published' | 'draft') => {
    const prev = products;
    setProducts((p) => p.map((x) => x.id === id ? { ...x, status: newStatus } : x));
    try {
      await productService.toggleProductStatus(id, newStatus);
      toast.success(`Product ${newStatus === 'published' ? 'published' : 'moved to draft'}`);
    } catch (e) {
      console.error('Failed to toggle product status', e);
      setProducts(prev);
      toast.error('Failed to update product status');
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
      toast.success(nextFeatured ? 'Product marked as featured' : 'Product removed from featured');
    } catch (e) {
      console.error('Failed to toggle product featured status', e);
      // revert on error
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !nextFeatured } : p)));
      toast.error('Failed to update product featured status');
    }
  };

  const headerActions =
    activeTab === 'categories' ? (
      <Button onClick={openCreateCategory} leftIcon={<Plus className="h-4 w-4" />}>
        <span className="hidden sm:inline">Add category</span>
        <span className="sm:hidden">Add</span>
      </Button>
    ) : (
      <ButtonLink href="/admin/products/create" leftIcon={<Plus className="h-4 w-4" />}>
        <span className="hidden sm:inline">Add product</span>
        <span className="sm:hidden">Add</span>
      </ButtonLink>
    );

  return (
    <AdminPage>
      <PageHeader
        title="Products"
        subtitle="Manage your catalogue, categories, colors and sizes"
        actions={headerActions}
      />

      {/* Stats (status tiles act as quick filters) */}
      <ProductStats
        products={products}
        loading={prodLoading && products.length === 0}
        statusFilter={statusFilter}
        highlight={activeTab === 'all'}
        onStatusSelect={(status) => {
          setStatusFilter(status);
          if (activeTab !== 'all') changeTab('all');
        }}
      />

      <Card padding="none" className="overflow-hidden">
        <Tabs
          value={activeTab}
          onChange={changeTab}
          productCount={prodLoading && products.length === 0 ? undefined : products.length}
          categoryCount={catLoading && categories.length === 0 ? undefined : categories.length}
        />

        {activeTab === 'all' && (
          <AllProducts
            products={products}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onEdit={handleEditProduct}
            onDelete={(id) => setProductToDelete(products.find((p) => p.id === id) ?? null)}
            onToggleStatus={handleToggleProductStatus}
            onToggleFeatured={handleToggleFeaturedProduct}
            onRetry={loadProducts}
            loading={prodLoading}
            error={prodError}
          />
        )}
        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categoriesWithCount}
            loading={catLoading}
            error={catError}
            onRetry={loadCategories}
            onCreate={openCreateCategory}
            onEdit={openEditCategory}
            onDelete={(id) => setCategoryToDelete(categories.find((c) => c.id === id) ?? null)}
            onToggleActive={handleToggleActiveCategory}
            onToggleFeatured={handleToggleFeaturedCategory}
          />
        )}
        {activeTab === 'attributes' && <ColorsSizesTab />}
      </Card>

      <CategoryModal
        open={categoryModalOpen}
        mode={categoryModalMode}
        initial={categoryModalInitial}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleSubmitCategory}
      />

      <ConfirmDialog
        open={!!productToDelete}
        title="Delete product?"
        message={
          productToDelete ? (
            <>
              <span className="font-semibold text-stone-900">{productToDelete.name}</span> will be permanently removed
              from the catalogue and the storefront. This can&apos;t be undone.
            </>
          ) : null
        }
        confirmLabel="Delete product"
        loading={deletingProduct}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
      />

      <ConfirmDialog
        open={!!categoryToDelete}
        title="Delete category?"
        message={
          categoryToDelete ? (
            <>
              <span className="font-semibold text-stone-900">{categoryToDelete.name}</span> will be permanently
              deleted.
              {(() => {
                const count = products.filter((p) => p.category === categoryToDelete.name).length;
                return count > 0
                  ? ` ${count} ${count === 1 ? 'product uses' : 'products use'} this category and will keep its name until you reassign ${count === 1 ? 'it' : 'them'}.`
                  : '';
              })()}{' '}
              This can&apos;t be undone.
            </>
          ) : null
        }
        confirmLabel="Delete category"
        loading={deletingCategory}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteCategory}
      />
    </AdminPage>
  );
};

export default ProductsPage;
