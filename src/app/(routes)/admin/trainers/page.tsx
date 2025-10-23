'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AllTrainers from './components/AllTrainers';
import TrainerForm from './components/TrainerForm';
import { trainerService, type Trainer, type TrainerInput } from './services/trainerService';

const TrainersPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
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

  const fetchTrainers = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const { trainers: data, pagination: paginationData } = await trainerService.getAllTrainers(page, 20);
      setTrainers(data);
      setPagination(paginationData);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      setError('Failed to load trainers. Please try again.');
      toast.error('Failed to load trainers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === 'list') {
      fetchTrainers(currentPage);
    }
  }, [activeView, currentPage, fetchTrainers]);

  const handleEdit = (id: string) => {
    const trainer = trainers.find(t => t._id === id);
    if (trainer) {
      setEditingTrainer(trainer);
      setActiveView('edit');
    }
  };

  const handleCreate = () => {
    setEditingTrainer(null);
    setActiveView('create');
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setFormLoading(true);

      if (editingTrainer) {
        const updatedTrainer = await trainerService.updateTrainer(editingTrainer._id, formData);
        setTrainers((prev) => prev.map(t => t._id === editingTrainer._id ? updatedTrainer : t));
        toast.success('Trainer updated successfully');
      } else {
        const newTrainer = await trainerService.createTrainer(formData);
        setTrainers((prev) => [newTrainer, ...prev]);
        toast.success('Trainer created successfully');
      }

      setActiveView('list');
      setEditingTrainer(null);
      fetchTrainers(currentPage);
    } catch (error: any) {
      console.error('Error saving trainer:', error);
      toast.error(error.message || 'Failed to save trainer');
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingTrainer(null);
    setActiveView('list');
  };

  const handleDelete = async (id: string) => {
    const trainer = trainers.find(t => t._id === id);
    if (!trainer) return;

    if (!confirm(`Are you sure you want to delete "${trainer.name}"?`)) return;

    try {
      await trainerService.deleteTrainer(id);
      setTrainers((prev) => prev.filter((t) => t._id !== id));
      toast.success('Trainer deleted successfully');
      fetchTrainers(currentPage);
    } catch (error) {
      console.error('Error deleting trainer:', error);
      toast.error('Failed to delete trainer');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const prev = trainers;
    setTrainers((p) => p.map((trainer) => trainer._id === id ? { ...trainer, isActive: newStatus } : trainer));

    try {
      await trainerService.toggleTrainerStatus(id, newStatus);
      toast.success(`Trainer ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle trainer status', error);
      setTrainers(prev);
      toast.error('Failed to update trainer status');
    }
  };

  const handleToggleFeatured = async (id: string, newFeatured: boolean) => {
    const prev = trainers;
    setTrainers((p) => p.map((trainer) => trainer._id === id ? { ...trainer, isFeatured: newFeatured } : trainer));

    try {
      await trainerService.toggleTrainerFeatured(id, newFeatured);
      toast.success(`Trainer ${newFeatured ? 'marked as featured' : 'removed from featured'} successfully`);
    } catch (error) {
      console.error('Failed to toggle trainer featured status', error);
      setTrainers(prev);
      toast.error('Failed to update trainer featured status');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your gym trainers and instructors</p>
        </div>
        {activeView === 'list' && (
          <button
            onClick={handleCreate}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Trainer
          </button>
        )}
      </div>

      {activeView === 'list' && (
        <AllTrainers
          trainers={trainers}
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
        <TrainerForm
          trainer={editingTrainer || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default TrainersPage;
