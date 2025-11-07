'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import CreateProduct from '../components/CreateProduct';
import { type Category } from '../components/CategoriesTab';
import { categoryService } from '../services/categoryService';
import { loadCreateTabData } from '../services/productOptionsService';

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

  const handleSuccess = () => {
    toast.success('Product created successfully');
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
            <p className="mt-1 text-sm text-gray-500">Add a new product to your inventory</p>
          </div>
        </div>
      </div>

      <CreateProduct
        categories={categories.filter((c) => c.active)}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        onManageAttributes={() => router.push('/admin/products?tab=attributes')}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CreateProductPage;
