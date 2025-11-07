'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import EditProduct from '../../components/EditProduct';
import { type Category } from '../../components/CategoriesTab';
import { categoryService } from '../../services/categoryService';
import { loadCreateTabData } from '../../services/productOptionsService';

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

  const handleSuccess = () => {
    toast.success('Product updated successfully');
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (!productId) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
          <div className="text-center">
            <p className="text-red-600">Product ID is missing</p>
            <button
              onClick={handleCancel}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </button>
        </div>
        <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="mt-1 text-sm text-gray-500">Update product information</p>
          </div>
        </div>
      </div>

      <EditProduct
        productId={productId}
        categories={categories.filter((c) => c.active)}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        onManageAttributes={() => router.push('/admin/products?tab=attributes')}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default EditProductPage;
