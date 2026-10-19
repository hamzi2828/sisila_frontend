'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminPage, ButtonLink, EmptyState, LoadingState, PageHeader } from '@/components/admin/ui';
import EditProduct from '../../components/EditProduct';
import { type Category } from '../../components/CategoriesTab';
import { loadCreateTabData } from '../../services/productOptionsService';

const breadcrumbs = [
  { label: 'Products', href: '/admin/products' },
  { label: 'Edit product' },
];

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

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
        console.error('Failed to load Edit page data', e);
        toast.error('Failed to load product data');
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

  const handleCancel = () => {
    router.push('/admin/products');
  };

  const header = (
    <PageHeader
      title="Edit product"
      subtitle="Update product details, media and stock"
      backHref="/admin/products"
      breadcrumbs={breadcrumbs}
    />
  );

  if (!productId) {
    return (
      <AdminPage>
        {header}
        <EmptyState
          card
          icon={Package}
          title="Product not found"
          description="The product ID is missing from the URL."
          action={<ButtonLink href="/admin/products">Back to products</ButtonLink>}
        />
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      {header}

      {loading ? (
        <LoadingState label="Loading product..." card />
      ) : (
        <EditProduct
          productId={productId}
          categories={categories.filter((c) => c.active)}
          colorOptions={colorOptions}
          sizeOptions={sizeOptions}
          onManageAttributes={() => router.push('/admin/products?tab=attributes')}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}
    </AdminPage>
  );
};

export default EditProductPage;
