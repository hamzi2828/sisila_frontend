'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, BookOpen, Eye, EyeOff, ListTree, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminPage, Button, ConfirmDialog, PageHeader, StatCard, StatGrid } from '@/components/admin/ui';
import { getApiErrorMessage } from '@/app/(routes)/admin/themes/components/collection/apiError';
import AllSeries from './components/AllSeries';
import SeriesForm from './components/SeriesForm';
import { seriesAdminService, type Series, type SeriesInput } from './services/seriesAdminService';

const SeriesPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Series | null>(null);
  const [deleting, setDeleting] = useState(false);
  const firstRender = useRef(true);

  const fetchSeries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await seriesAdminService.getAllSeries();
      setSeries(data);
    } catch (error) {
      console.error('Error fetching series:', error);
      const message = getApiErrorMessage(error, 'Failed to load series. Please try again.');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  // Bring the header back into view when switching between the list and the form.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById('series-page-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeView]);

  const handleEdit = (id: string) => {
    const seriesItem = series.find((s) => s._id === id);
    if (seriesItem) {
      setEditingSeries(seriesItem);
      setActiveView('edit');
    }
  };

  const handleCreate = () => {
    setEditingSeries(null);
    setActiveView('create');
  };

  const handleFormSubmit = async (data: SeriesInput) => {
    try {
      setFormLoading(true);

      if (editingSeries) {
        const updatedSeries = await seriesAdminService.updateSeries(editingSeries._id, data);
        setSeries((prev) => prev.map((s) => (s._id === editingSeries._id ? updatedSeries : s)));
        toast.success('Series updated successfully');
      } else {
        const newSeries = await seriesAdminService.createSeries(data);
        setSeries((prev) => [newSeries, ...prev]);
        toast.success('Series created successfully');
      }

      setActiveView('list');
      setEditingSeries(null);
    } catch (error) {
      console.error('Error saving series:', error);
      toast.error(getApiErrorMessage(error, 'Failed to save series'));
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingSeries(null);
    setActiveView('list');
  };

  const handleDelete = (id: string) => {
    const seriesItem = series.find((s) => s._id === id);
    if (seriesItem) setDeleteTarget(seriesItem);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    try {
      setDeleting(true);
      await seriesAdminService.deleteSeries(id);
      setSeries((prev) => prev.filter((s) => s._id !== id));
      toast.success('Series deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting series:', error);
      toast.error(getApiErrorMessage(error, 'Failed to delete series'));
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const prev = series;
    setSeries((p) => p.map((s) => (s._id === id ? { ...s, isActive: newStatus } : s)));

    try {
      await seriesAdminService.toggleSeriesStatus(id, newStatus);
      toast.success(`Series ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle series status', error);
      setSeries(prev);
      toast.error(getApiErrorMessage(error, 'Failed to update series status'));
    }
  };

  const activeCount = series.filter((s) => s.isActive).length;
  const subitemCount = series.reduce((sum, s) => sum + (s.subitems?.length || 0), 0);
  const isForm = activeView === 'create' || activeView === 'edit';

  return (
    <AdminPage>
      <PageHeader
        id="series-page-top"
        className="scroll-mt-4"
        title={isForm ? (editingSeries ? 'Edit Series' : 'Create Series') : 'Editorial Series'}
        subtitle={
          isForm
            ? editingSeries
              ? `Update “${editingSeries.title}”`
              : 'Add a new cultural or literary design capsule'
            : 'Manage your cultural and literary design capsules'
        }
        actions={
          isForm ? (
            <Button variant="secondary" onClick={handleFormCancel} disabled={formLoading} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to list
            </Button>
          ) : (
            <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
              <span className="hidden sm:inline">Create Series</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )
        }
      />

      {activeView === 'list' && !isLoading && !error && series.length > 0 && (
        <StatGrid cols={4}>
          <StatCard size="sm" label="Total series" value={series.length} icon={BookOpen} tone="neutral" />
          <StatCard size="sm" label="Active" value={activeCount} icon={Eye} tone="success" />
          <StatCard size="sm" label="Inactive" value={series.length - activeCount} icon={EyeOff} tone="warning" />
          <StatCard size="sm" label="Subitems" value={subitemCount} icon={ListTree} tone="info" />
        </StatGrid>
      )}

      {activeView === 'list' && (
        <AllSeries
          series={series}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onCreate={handleCreate}
          onRetry={fetchSeries}
          loading={isLoading}
          error={error}
        />
      )}

      {isForm && (
        <SeriesForm
          key={editingSeries?._id ?? 'new'}
          series={editingSeries || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete series?"
        message={
          <>
            <span className="font-medium text-stone-900">“{deleteTarget?.title}”</span> and its gallery will be removed from the
            storefront. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete series"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </AdminPage>
  );
};

export default SeriesPage;
