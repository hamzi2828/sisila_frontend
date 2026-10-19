'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Eye, EyeOff, Images, Layers, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminPage, Button, ConfirmDialog, PageHeader, StatCard, StatGrid } from '@/components/admin/ui';
import AllThemes from './components/AllThemes';
import ThemeForm from './components/ThemeForm';
import { getApiErrorMessage } from './components/collection/apiError';
import { themeAdminService, type Theme, type ThemeInput } from './services/themeAdminService';

const ThemesPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Theme | null>(null);
  const [deleting, setDeleting] = useState(false);
  const firstRender = useRef(true);

  const fetchThemes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await themeAdminService.getAllThemes();
      setThemes(data);
    } catch (error) {
      console.error('Error fetching themes:', error);
      const message = getApiErrorMessage(error, 'Failed to load themes. Please try again.');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  // Bring the header back into view when switching between the list and the form.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById('themes-page-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeView]);

  const handleEdit = (id: string) => {
    const theme = themes.find((t) => t._id === id);
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
        setThemes((prev) => prev.map((t) => (t._id === editingTheme._id ? updatedTheme : t)));
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
      toast.error(getApiErrorMessage(error, 'Failed to save theme'));
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingTheme(null);
    setActiveView('list');
  };

  const handleDelete = (id: string) => {
    const theme = themes.find((t) => t._id === id);
    if (theme) setDeleteTarget(theme);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    try {
      setDeleting(true);
      await themeAdminService.deleteTheme(id);
      setThemes((prev) => prev.filter((t) => t._id !== id));
      toast.success('Theme deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast.error(getApiErrorMessage(error, 'Failed to delete theme'));
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const prev = themes;
    setThemes((p) => p.map((t) => (t._id === id ? { ...t, isActive: newStatus } : t)));

    try {
      await themeAdminService.toggleThemeStatus(id, newStatus);
      toast.success(`Theme ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle theme status', error);
      setThemes(prev);
      toast.error(getApiErrorMessage(error, 'Failed to update theme status'));
    }
  };

  const activeCount = themes.filter((t) => t.isActive).length;
  const galleryCount = themes.reduce((sum, t) => sum + (t.gallery?.length || 0), 0);
  const isForm = activeView === 'create' || activeView === 'edit';

  return (
    <AdminPage>
      <PageHeader
        id="themes-page-top"
        className="scroll-mt-4"
        title={isForm ? (editingTheme ? 'Edit Theme' : 'Create Theme') : 'Brand Themes'}
        subtitle={
          isForm
            ? editingTheme
              ? `Update “${editingTheme.title}”`
              : 'Add a new creative pillar to the storefront'
            : 'Manage your creative pillars and brand aesthetic'
        }
        actions={
          isForm ? (
            <Button variant="secondary" onClick={handleFormCancel} disabled={formLoading} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to list
            </Button>
          ) : (
            <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
              <span className="hidden sm:inline">Create Theme</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )
        }
      />

      {activeView === 'list' && !isLoading && !error && themes.length > 0 && (
        <StatGrid cols={4}>
          <StatCard size="sm" label="Total themes" value={themes.length} icon={Layers} tone="neutral" />
          <StatCard size="sm" label="Active" value={activeCount} icon={Eye} tone="success" />
          <StatCard size="sm" label="Inactive" value={themes.length - activeCount} icon={EyeOff} tone="warning" />
          <StatCard size="sm" label="Gallery images" value={galleryCount} icon={Images} tone="info" />
        </StatGrid>
      )}

      {activeView === 'list' && (
        <AllThemes
          themes={themes}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onCreate={handleCreate}
          onRetry={fetchThemes}
          loading={isLoading}
          error={error}
        />
      )}

      {isForm && (
        <ThemeForm
          key={editingTheme?._id ?? 'new'}
          theme={editingTheme || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete theme?"
        message={
          <>
            <span className="font-medium text-stone-900">“{deleteTarget?.title}”</span> and its gallery will be removed from the
            storefront. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete theme"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </AdminPage>
  );
};

export default ThemesPage;
