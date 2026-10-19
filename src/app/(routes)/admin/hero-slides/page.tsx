'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Eye, EyeOff, Image as ImageIcon, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminPage, Button, ConfirmDialog, PageHeader, StatCard, StatGrid } from '@/components/admin/ui';
import AllHeroSlides from './components/AllHeroSlides';
import HeroSlideForm from './components/HeroSlideForm';
import { heroAdminService, type HeroSlide } from './services/heroAdminService';
import { getErrorMessage } from '../blogs/_shared/apiError';

const HeroSlidesPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<HeroSlide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSlides = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await heroAdminService.getAllSlides();
      setSlides(data);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      setError(getErrorMessage(error, 'Failed to load hero slides. Please try again.'));
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
    const hasImage = formData.has('image');
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
      toast.error(getErrorMessage(error, 'Failed to save hero slide', { upload: hasImage }), { duration: 6000 });
      throw error; // Re-throw to prevent form from closing
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setEditingSlide(null);
    setActiveView('list');
  };

  // Hero slide deletion: ask first
  const handleDelete = (id: string) => {
    const slide = slides.find(s => s._id === id);
    if (slide) setPendingDelete(slide);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete._id;
    try {
      setIsDeleting(true);
      await heroAdminService.deleteSlide(id);
      setSlides((prev) => prev.filter((s) => s._id !== id));
      toast.success('Hero slide deleted successfully');
      setPendingDelete(null);
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      toast.error(getErrorMessage(error, 'Failed to delete hero slide'));
    } finally {
      setIsDeleting(false);
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
      toast.error(getErrorMessage(error, 'Failed to update hero slide status'));
    }
  };

  const activeCount = slides.filter(s => s.isActive).length;

  return (
    <AdminPage>
      <PageHeader
        title="Hero Slides"
        subtitle={
          activeView === 'list'
            ? 'Manage your homepage hero carousel slides'
            : activeView === 'edit'
              ? `Editing "${editingSlide?.title ?? ''}"`
              : 'Add a new slide to the homepage carousel'
        }
        actions={
          activeView === 'list' ? (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
              <span className="hidden sm:inline">Create Hero Slide</span>
              <span className="sm:hidden">Add</span>
            </Button>
          ) : (
            <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={handleFormCancel} disabled={formLoading}>
              Back to List
            </Button>
          )
        }
      />

      {/* Stats - list view only */}
      {activeView === 'list' && !isLoading && !error && (
        <StatGrid cols={3}>
          <StatCard size="sm" label="Total slides" value={slides.length} icon={ImageIcon} />
          <StatCard size="sm" label="Active" value={activeCount} icon={Eye} tone="success" />
          <StatCard size="sm" label="Inactive" value={slides.length - activeCount} icon={EyeOff} />
        </StatGrid>
      )}

      {activeView === 'list' && (
        <AllHeroSlides
          slides={slides}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onCreate={handleCreate}
          onRetry={fetchSlides}
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

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete hero slide?"
        message={
          <>
            <span className="font-medium text-stone-900">&ldquo;{pendingDelete?.title}&rdquo;</span> will be removed from
            the homepage carousel permanently. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete slide"
        loading={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </AdminPage>
  );
};

export default HeroSlidesPage;
