'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AllThemes from './components/AllThemes';
import ThemeForm from './components/ThemeForm';
import { themeAdminService, type Theme, type ThemeInput } from './services/themeAdminService';

const ThemesPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchThemes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await themeAdminService.getAllThemes();
      setThemes(data);
    } catch (error) {
      console.error('Error fetching themes:', error);
      setError('Failed to load themes. Please try again.');
      toast.error('Failed to load themes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const handleEdit = (id: string) => {
    const theme = themes.find(t => t._id === id);
    if (theme) {
      setEditingTheme(theme);
      setActiveView('edit');
    }
  };

  const handleCreate = () => {
    setEditingTheme(null);
    setActiveView('create');
  };

  const handleFormSubmit = async (data: ThemeInput) => {
    try {
      setFormLoading(true);

      if (editingTheme) {
        const updatedTheme = await themeAdminService.updateTheme(editingTheme._id, data);
        setThemes((prev) => prev.map(t => t._id === editingTheme._id ? updatedTheme : t));
        toast.success('Theme updated successfully');
      } else {
        const newTheme = await themeAdminService.createTheme(data);
        setThemes((prev) => [newTheme, ...prev]);
        toast.success('Theme created successfully');
      }

      setActiveView('list');
      setEditingTheme(null);
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme');
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingTheme(null);
    setActiveView('list');
  };

  const handleDelete = async (id: string) => {
    const theme = themes.find(t => t._id === id);
    if (!theme) return;

    if (!confirm(`Are you sure you want to delete "${theme.title}"?`)) return;

    try {
      await themeAdminService.deleteTheme(id);
      setThemes((prev) => prev.filter((t) => t._id !== id));
      toast.success('Theme deleted successfully');
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast.error('Failed to delete theme');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const prev = themes;
    setThemes((p) => p.map((t) => t._id === id ? { ...t, isActive: newStatus } : t));

    try {
      await themeAdminService.toggleThemeStatus(id, newStatus);
      toast.success(`Theme ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle theme status', error);
      setThemes(prev);
      toast.error('Failed to update theme status');
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Themes</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your creative pillars and brand aesthetic</p>
        </div>
        {activeView === 'list' && (
          <button
            onClick={handleCreate}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Theme
          </button>
        )}
      </div>

      {activeView === 'list' && (
        <AllThemes
          themes={themes}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          loading={isLoading}
          error={error}
        />
      )}

      {(activeView === 'create' || activeView === 'edit') && (
        <ThemeForm
          theme={editingTheme || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default ThemesPage;
