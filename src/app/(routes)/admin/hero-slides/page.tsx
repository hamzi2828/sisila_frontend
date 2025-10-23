'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AllHeroSlides from './components/AllHeroSlides';
import HeroSlideForm from './components/HeroSlideForm';
import { heroAdminService, type HeroSlide } from './services/heroAdminService';

const HeroSlidesPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchSlides = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await heroAdminService.getAllSlides();
      setSlides(data);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      setError('Failed to load hero slides. Please try again.');
      toast.error('Failed to load hero slides');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch slides on component mount
  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // Hero slide edit handlers
  const handleEdit = (id: string) => {
    const slide = slides.find(s => s._id === id);
    if (slide) {
      setEditingSlide(slide);
      setActiveView('edit');
    }
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setActiveView('create');
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setFormLoading(true);
      
      if (editingSlide) {
        // Update existing slide
        const updatedSlide = await heroAdminService.updateSlide(editingSlide._id, formData);
        setSlides((prev) => prev.map(s => s._id === editingSlide._id ? updatedSlide : s));
        toast.success('Hero slide updated successfully');
      } else {
        // Create new slide
        const newSlide = await heroAdminService.createSlide(formData);
        setSlides((prev) => [newSlide, ...prev]);
        toast.success('Hero slide created successfully');
      }
      
      setActiveView('list');
      setEditingSlide(null);
    } catch (error) {
      console.error('Error saving hero slide:', error);
      toast.error('Failed to save hero slide');
      throw error; // Re-throw to prevent form from closing
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingSlide(null);
    setActiveView('list');
  };

  // Hero slide deletion handler
  const handleDelete = async (id: string) => {
    const slide = slides.find(s => s._id === id);
    if (!slide) return;

    if (!confirm(`Are you sure you want to delete "${slide.title}"?`)) return;
    
    try {
      await heroAdminService.deleteSlide(id);
      setSlides((prev) => prev.filter((s) => s._id !== id));
      toast.success('Hero slide deleted successfully');
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      toast.error('Failed to delete hero slide');
    }
  };

  // Toggle slide status handler
  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const prev = slides;
    setSlides((p) => p.map((s) => s._id === id ? { ...s, isActive: newStatus } : s));
    
    try {
      await heroAdminService.toggleSlideStatus(id, newStatus);
      toast.success(`Hero slide ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle hero slide status', error);
      setSlides(prev);
      toast.error('Failed to update hero slide status');
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your homepage hero carousel slides</p>
        </div>
        {activeView === 'list' && (
          <button
            onClick={handleCreate}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Hero Slide
          </button>
        )}
      </div>

      {activeView === 'list' && (
        <AllHeroSlides
          slides={slides}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          loading={isLoading}
          error={error}
        />
      )}

      {(activeView === 'create' || activeView === 'edit') && (
        <HeroSlideForm
          slide={editingSlide || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default HeroSlidesPage;