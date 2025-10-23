'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AllPackages from './components/AllPackages';
import PackageForm from './components/PackageForm';
import { packageAdminService, type Package, type PackageInput } from './services/packageAdminService';

const PackagesPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await packageAdminService.getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages. Please try again.');
      toast.error('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Package edit handlers
  const handleEdit = (id: string) => {
    const pkg = packages.find(p => p._id === id);
    if (pkg) {
      setEditingPackage(pkg);
      setActiveView('edit');
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setActiveView('create');
  };

  const handleFormSubmit = async (packageData: PackageInput) => {
    try {
      setFormLoading(true);

      if (editingPackage) {
        // Update existing package
        const updatedPackage = await packageAdminService.updatePackage(editingPackage._id, packageData);
        setPackages((prev) => prev.map(p => p._id === editingPackage._id ? updatedPackage : p));
        toast.success('Package updated successfully');
      } else {
        // Create new package
        const newPackage = await packageAdminService.createPackage(packageData);
        setPackages((prev) => [newPackage, ...prev]);
        toast.success('Package created successfully');
      }

      setActiveView('list');
      setEditingPackage(null);
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package');
      throw error; // Re-throw to prevent form from closing
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingPackage(null);
    setActiveView('list');
  };

  // Package deletion handler
  const handleDelete = async (id: string) => {
    const pkg = packages.find(p => p._id === id);
    if (!pkg) return;

    if (!confirm(`Are you sure you want to delete "${pkg.name}"?`)) return;

    try {
      await packageAdminService.deletePackage(id);
      setPackages((prev) => prev.filter((p) => p._id !== id));
      toast.success('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  // Toggle package status handler
  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const prev = packages;
    setPackages((p) => p.map((pkg) => pkg._id === id ? { ...pkg, isActive: newStatus } : pkg));

    try {
      await packageAdminService.togglePackageStatus(id, newStatus);
      toast.success(`Package ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle package status', error);
      setPackages(prev);
      toast.error('Failed to update package status');
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your pricing packages</p>
        </div>
        {activeView === 'list' && (
          <button
            onClick={handleCreate}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Package
          </button>
        )}
      </div>

      {activeView === 'list' && (
        <AllPackages
          packages={packages}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          loading={isLoading}
          error={error}
        />
      )}

      {(activeView === 'create' || activeView === 'edit') && (
        <PackageForm
          package={editingPackage || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default PackagesPage;
