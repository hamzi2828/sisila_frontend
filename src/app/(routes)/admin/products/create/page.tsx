'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AdminPage, LoadingState, PageHeader } from '@/components/admin/ui';
import CreateProduct from '../components/CreateProduct';
import { type Category } from '../components/CategoriesTab';
import { loadCreateTabData } from '../services/productOptionsService';

const breadcrumbs = [
  { label: 'Products', href: '/admin/products' },
  { label: 'New product' },
];

const CreateProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { categories: cats, colorOptions: co, sizeOptions: so } = await loadCreateTabData();
        setCategories(cats as unknown as Category[]);
        setColorOptions(co);
        setSizeOptions(so);
      } catch (e) {
        console.error('Failed to load Create page data', e);
        toast.error('Failed to load product creation data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ProductForm already shows the progress + success toast, so just navigate back.
  const handleSuccess = () => {
    router.push('/admin/products');
  };

  return (
    <AdminPage>
      <PageHeader
        title="Create product"
        subtitle="Add a new product to your catalogue"
        backHref="/admin/products"
        breadcrumbs={breadcrumbs}
      />

      {loading ? (
        <LoadingState label="Loading product options..." card />
      ) : (
        <CreateProduct
          categories={categories.filter((c) => c.active)}
          colorOptions={colorOptions}
          sizeOptions={sizeOptions}
          onManageAttributes={() => router.push('/admin/products?tab=attributes')}
          onSuccess={handleSuccess}
        />
      )}
    </AdminPage>
  );
};

export default CreateProductPage;
