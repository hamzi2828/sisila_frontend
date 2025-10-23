'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AllClasses from './components/AllClasses';
import ClassForm from './components/ClassForm';
import { classService, type GymClass } from './services/classService';

const ClassesPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchClasses = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const { classes: data, pagination: paginationData } = await classService.getAllClasses(page, 20);
      setClasses(data);
      setPagination(paginationData);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes. Please try again.');
      toast.error('Failed to load classes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === 'list') {
      fetchClasses(currentPage);
    }
  }, [activeView, currentPage, fetchClasses]);

  const handleEdit = (id: string) => {
    const gymClass = classes.find(c => c._id === id);
    if (gymClass) {
      setEditingClass(gymClass);
      setActiveView('edit');
    }
  };

  const handleCreate = () => {
    setEditingClass(null);
    setActiveView('create');
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setFormLoading(true);

      if (editingClass) {
        const updatedClass = await classService.updateClass(editingClass._id, formData);
        setClasses((prev) => prev.map(c => c._id === editingClass._id ? updatedClass : c));
        toast.success('Class updated successfully');
      } else {
        const newClass = await classService.createClass(formData);
        setClasses((prev) => [newClass, ...prev]);
        toast.success('Class created successfully');
      }

      setActiveView('list');
      setEditingClass(null);
      fetchClasses(currentPage);
    } catch (error: any) {
      console.error('Error saving class:', error);
      toast.error(error.message || 'Failed to save class');
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingClass(null);
    setActiveView('list');
  };

  const handleDelete = async (id: string) => {
    const gymClass = classes.find(c => c._id === id);
    if (!gymClass) return;

    if (!confirm(`Are you sure you want to delete "${gymClass.name}"?`)) return;

    try {
      await classService.deleteClass(id);
      setClasses((prev) => prev.filter((c) => c._id !== id));
      toast.success('Class deleted successfully');
      fetchClasses(currentPage);
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const prev = classes;
    setClasses((p) => p.map((c) => c._id === id ? { ...c, isActive: newStatus } : c));

    try {
      await classService.toggleClassStatus(id, newStatus);
      toast.success(`Class ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle class status', error);
      setClasses(prev);
      toast.error('Failed to update class status');
    }
  };

  const handleToggleFeatured = async (id: string, newFeatured: boolean) => {
    const prev = classes;
    setClasses((p) => p.map((c) => c._id === id ? { ...c, isFeatured: newFeatured } : c));

    try {
      await classService.toggleClassFeatured(id, newFeatured);
      toast.success(`Class ${newFeatured ? 'marked as featured' : 'removed from featured'} successfully`);
    } catch (error) {
      console.error('Failed to toggle class featured status', error);
      setClasses(prev);
      toast.error('Failed to update class featured status');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your gym classes and programs</p>
        </div>
        {activeView === 'list' && (
          <button
            onClick={handleCreate}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Class
          </button>
        )}
      </div>

      {activeView === 'list' && (
        <AllClasses
          classes={classes}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onToggleFeatured={handleToggleFeatured}
          loading={isLoading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {(activeView === 'create' || activeView === 'edit') && (
        <ClassForm
          gymClass={editingClass || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default ClassesPage;
