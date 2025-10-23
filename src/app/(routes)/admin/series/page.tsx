'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
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

  const fetchSeries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await seriesAdminService.getAllSeries();
      setSeries(data);
    } catch (error) {
      console.error('Error fetching series:', error);
      setError('Failed to load series. Please try again.');
      toast.error('Failed to load series');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const handleEdit = (id: string) => {
    const seriesItem = series.find(s => s._id === id);
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
        setSeries((prev) => prev.map(s => s._id === editingSeries._id ? updatedSeries : s));
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
      toast.error('Failed to save series');
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingSeries(null);
    setActiveView('list');
  };

  const handleDelete = async (id: string) => {
    const seriesItem = series.find(s => s._id === id);
    if (!seriesItem) return;

    if (!confirm(`Are you sure you want to delete "${seriesItem.title}"?`)) return;

    try {
      await seriesAdminService.deleteSeries(id);
      setSeries((prev) => prev.filter((s) => s._id !== id));
      toast.success('Series deleted successfully');
    } catch (error) {
      console.error('Error deleting series:', error);
      toast.error('Failed to delete series');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const prev = series;
    setSeries((p) => p.map((s) => s._id === id ? { ...s, isActive: newStatus } : s));

    try {
      await seriesAdminService.toggleSeriesStatus(id, newStatus);
      toast.success(`Series ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle series status', error);
      setSeries(prev);
      toast.error('Failed to update series status');
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editorial Series</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your cultural and literary design capsules</p>
        </div>
        {activeView === 'list' && (
          <button
            onClick={handleCreate}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Series
          </button>
        )}
      </div>

      {activeView === 'list' && (
        <AllSeries
          series={series}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          loading={isLoading}
          error={error}
        />
      )}

      {(activeView === 'create' || activeView === 'edit') && (
        <SeriesForm
          series={editingSeries || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default SeriesPage;
