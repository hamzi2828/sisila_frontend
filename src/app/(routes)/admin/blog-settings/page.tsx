"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Check,
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Layout,
  Link as LinkIcon,
  Plus,
  Trash2,
  Type,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPage,
  Alert,
  Button,
  ConfirmDialog,
  EmptyState,
  FormField,
  IconButton,
  Input,
  LoadingState,
  Modal,
  PageHeader,
} from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { assetUrl } from '@/lib/productMedia';
import { blogHeroService, BlogHeroData } from './services/blogHeroService';
import ImageDropzone from '../blogs/_shared/ImageDropzone';
import { getErrorMessage } from '../blogs/_shared/apiError';

type HeroForm = Pick<
  BlogHeroData,
  | 'title'
  | 'subtitle'
  | 'backgroundImage'
  | 'primaryButtonText'
  | 'primaryButtonLink'
  | 'secondaryButtonText'
  | 'secondaryButtonLink'
  | 'isActive'
>;

const EMPTY_FORM: HeroForm = {
  title: '',
  subtitle: '',
  backgroundImage: '',
  primaryButtonText: '',
  primaryButtonLink: '',
  secondaryButtonText: '',
  secondaryButtonLink: '',
  isActive: false,
};

const heroId = (hero: BlogHeroData) => (hero.id || hero._id || '').toString();

/** Only preview strings that look like a real image location (not a half-typed URL). */
const previewable = (url: string) => (/^(https?:\/\/|\/)/.test(url.trim()) ? assetUrl(url.trim()) : '');

export default function BlogSettingsPage() {
  const [heroes, setHeroes] = useState<BlogHeroData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingHero, setEditingHero] = useState<BlogHeroData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<HeroForm>(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof HeroForm, string>>>({});
  const [pendingDelete, setPendingDelete] = useState<BlogHeroData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await blogHeroService.getAllBlogHeros();
      setHeroes(data);
    } catch (error) {
      console.error('Error fetching heroes:', error);
      const message = getErrorMessage(error, 'Failed to load hero sections');
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const setField = <K extends keyof HeroForm>(key: K, value: HeroForm[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof HeroForm, string>> = {};
    if (!formData.title.trim()) next.title = 'Title is required';
    if (!formData.subtitle.trim()) next.subtitle = 'Subtitle is required';
    if (!selectedFile && !formData.backgroundImage.trim()) next.backgroundImage = 'Upload a background image or paste an image URL';
    if (!formData.primaryButtonText.trim()) next.primaryButtonText = 'Button text is required';
    if (!formData.primaryButtonLink.trim()) next.primaryButtonLink = 'Button link is required';
    if (!formData.secondaryButtonText.trim()) next.secondaryButtonText = 'Button text is required';
    if (!formData.secondaryButtonLink.trim()) next.secondaryButtonLink = 'Button link is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSaving(true);

      if (editingHero) {
        await blogHeroService.updateBlogHero(heroId(editingHero), formData, selectedFile || undefined);
        toast.success('Hero section updated successfully');
      } else {
        await blogHeroService.createBlogHero(formData, selectedFile || undefined);
        toast.success('Hero section created successfully');
      }

      await fetchHeroes();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving hero:', error);
      toast.error(getErrorMessage(error, 'Failed to save hero section', { upload: Boolean(selectedFile) }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;

    try {
      setIsDeleting(true);
      await blogHeroService.deleteBlogHero(heroId(pendingDelete));
      toast.success('Hero section deleted successfully');
      setPendingDelete(null);
      await fetchHeroes();
    } catch (error) {
      console.error('Error deleting hero:', error);
      toast.error(getErrorMessage(error, 'Failed to delete hero section'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      setTogglingId(id);
      await blogHeroService.toggleActiveStatus(id);
      toast.success('Hero status updated successfully');
      await fetchHeroes();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(getErrorMessage(error, 'Failed to update hero status'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleEdit = (hero: BlogHeroData) => {
    setEditingHero(hero);
    setSelectedFile(null);
    setErrors({});
    setFormData({
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      backgroundImage: hero.backgroundImage || '',
      primaryButtonText: hero.primaryButtonText || '',
      primaryButtonLink: hero.primaryButtonLink || '',
      secondaryButtonText: hero.secondaryButtonText || '',
      secondaryButtonLink: hero.secondaryButtonLink || '',
      isActive: Boolean(hero.isActive),
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingHero(null);
    setSelectedFile(null);
    setErrors({});
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHero(null);
    setSelectedFile(null);
    setErrors({});
    setFormData(EMPTY_FORM);
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file && errors.backgroundImage) setErrors(prev => ({ ...prev, backgroundImage: undefined }));
  };

  const ctaFields = [
    {
      title: 'Primary Button',
      textKey: 'primaryButtonText' as const,
      linkKey: 'primaryButtonLink' as const,
      textPlaceholder: 'e.g., Read the Journal',
      linkPlaceholder: 'e.g., /blog',
    },
    {
      title: 'Secondary Button',
      textKey: 'secondaryButtonText' as const,
      linkKey: 'secondaryButtonLink' as const,
      textPlaceholder: 'e.g., Shop the Collection',
      linkPlaceholder: 'e.g., /shop',
    },
  ];

  return (
    <AdminPage>
      <PageHeader
        title="Blog Hero Settings"
        subtitle="Manage hero sections for your blog page"
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            <span className="hidden sm:inline">Add Hero Section</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      />

      {heroes.length > 0 && (
        <p className="text-xs text-stone-500 sm:text-sm">
          The blog page shows the active hero. Activating a hero automatically deactivates the others.
        </p>
      )}

      {/* Loading State */}
      {isLoading && heroes.length === 0 && <LoadingState card label="Loading hero sections..." />}

      {/* Error State */}
      {!isLoading && loadError && heroes.length === 0 && (
        <Alert tone="error" title="Couldn't load hero sections" onRetry={fetchHeroes}>
          {loadError}
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !loadError && heroes.length === 0 && (
        <EmptyState
          card
          icon={Layout}
          title="No hero sections yet"
          description="Create your first hero section to display on the blog page."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
              Create Hero Section
            </Button>
          }
        />
      )}

      {/* Heroes List */}
      {heroes.length > 0 && (
        <div className="grid gap-3 sm:gap-4">
          {heroes.map((hero, index) => {
            const id = heroId(hero);
            const image = previewable(hero.backgroundImage || '');
            return (
              <div
                key={id || index}
                className={cn(
                  'overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all duration-200 hover:shadow-md',
                  hero.isActive ? 'border-emerald-200' : 'border-stone-200'
                )}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image Preview */}
                  <div className="relative h-40 w-full flex-shrink-0 bg-stone-100 sm:h-auto sm:min-h-[9rem] sm:w-56">
                    {image ? (
                      <Image src={image} alt={hero.title || 'Hero background'} fill unoptimized className="object-cover" sizes="224px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-stone-300" aria-hidden />
                      </div>
                    )}
                    <span
                      className={cn(
                        'absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium shadow-sm',
                        hero.isActive ? 'bg-emerald-600 text-white' : 'bg-white/90 text-stone-600'
                      )}
                    >
                      {hero.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-stone-900 sm:text-lg">{hero.title}</h3>
                        <p className="mt-1 text-sm text-stone-500">{hero.subtitle}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-shrink-0 items-center gap-1.5">
                        <IconButton
                          label={hero.isActive ? 'Deactivate' : 'Activate'}
                          icon={hero.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          loading={togglingId === id}
                          disabled={Boolean(togglingId)}
                          onClick={() => handleToggleActive(id)}
                          className={cn(
                            hero.isActive
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                          )}
                        />
                        <IconButton
                          label="Edit"
                          icon={<Edit2 className="h-4 w-4" />}
                          onClick={() => handleEdit(hero)}
                          className="bg-stone-100 text-stone-600 hover:bg-stone-200"
                        />
                        <IconButton
                          label="Delete"
                          tone="danger"
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => setPendingDelete(hero)}
                          className="bg-stone-100 text-red-500 hover:bg-red-50 hover:text-red-600"
                        />
                      </div>
                    </div>

                    {/* Button Links */}
                    <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
                      {[
                        { label: hero.primaryButtonText, link: hero.primaryButtonLink },
                        { label: hero.secondaryButtonText, link: hero.secondaryButtonLink },
                      ]
                        .filter((b) => b.label)
                        .map((b, i) => (
                          <div key={i} className="flex min-w-0 items-center gap-2 text-stone-600">
                            <LinkIcon className="h-3.5 w-3.5 flex-shrink-0 text-stone-400" aria-hidden />
                            <span className="font-medium text-stone-800">{b.label}</span>
                            <span className="text-stone-400">→</span>
                            <span className="truncate text-stone-500">{b.link}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / edit modal */}
      <Modal
        open={isModalOpen}
        onClose={isSaving ? () => {} : handleCloseModal}
        title={editingHero ? 'Edit Hero Section' : 'Create Hero Section'}
        description="Shown at the top of the blog page."
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="blog-hero-form"
              loading={isSaving}
              loadingText="Saving..."
              leftIcon={<Check className="h-4 w-4" />}
            >
              {editingHero ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="blog-hero-form" onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Title & Subtitle */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-stone-700" aria-hidden />
              <h3 className="text-sm font-semibold text-stone-900">Content</h3>
            </div>
            <FormField label="Title" htmlFor="hero-title" required error={errors.title}>
              <Input
                id="hero-title"
                value={formData.title}
                invalid={!!errors.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="Enter hero title"
                disabled={isSaving}
              />
            </FormField>
            <FormField label="Subtitle" htmlFor="hero-subtitle" required error={errors.subtitle}>
              <Input
                id="hero-subtitle"
                value={formData.subtitle}
                invalid={!!errors.subtitle}
                onChange={(e) => setField('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
                disabled={isSaving}
              />
            </FormField>
          </div>

          {/* Background Image */}
          <div className="space-y-3 border-t border-stone-200 pt-5">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-stone-700" aria-hidden />
              <h3 className="text-sm font-semibold text-stone-900">
                Background Image <span className="text-red-500">*</span>
              </h3>
            </div>
            <ImageDropzone
              id="hero-background"
              name="Background image"
              file={selectedFile}
              onFileChange={handleFileChange}
              currentUrl={previewable(formData.backgroundImage)}
              onClearCurrent={() => setField('backgroundImage', '')}
              error={errors.backgroundImage}
              previewClassName="aspect-[21/9]"
              disabled={isSaving}
            />
            {!selectedFile && (
              <FormField
                label="Or use an image URL"
                htmlFor="hero-background-url"
                hint="Paste a link to an image that is already online. An uploaded image takes priority."
              >
                <Input
                  id="hero-background-url"
                  value={formData.backgroundImage}
                  onChange={(e) => setField('backgroundImage', e.target.value)}
                  placeholder="https://..."
                  disabled={isSaving}
                />
              </FormField>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3 border-t border-stone-200 pt-5">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-stone-700" aria-hidden />
              <h3 className="text-sm font-semibold text-stone-900">Call to Action Buttons</h3>
            </div>

            {ctaFields.map((cta) => (
              <div key={cta.textKey} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500">{cta.title}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormField label="Button text" htmlFor={`hero-${cta.textKey}`} required error={errors[cta.textKey]}>
                    <Input
                      id={`hero-${cta.textKey}`}
                      value={formData[cta.textKey]}
                      invalid={!!errors[cta.textKey]}
                      onChange={(e) => setField(cta.textKey, e.target.value)}
                      placeholder={cta.textPlaceholder}
                      disabled={isSaving}
                    />
                  </FormField>
                  <FormField label="Button link" htmlFor={`hero-${cta.linkKey}`} required error={errors[cta.linkKey]}>
                    <Input
                      id={`hero-${cta.linkKey}`}
                      value={formData[cta.linkKey]}
                      invalid={!!errors[cta.linkKey]}
                      onChange={(e) => setField(cta.linkKey, e.target.value)}
                      placeholder={cta.linkPlaceholder}
                      disabled={isSaving}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>

          {/* Status Toggle */}
          <div className="border-t border-stone-200 pt-5">
            <button
              type="button"
              role="switch"
              aria-checked={formData.isActive}
              disabled={isSaving}
              onClick={() => setField('isActive', !formData.isActive)}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 disabled:opacity-60',
                formData.isActive ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 bg-stone-50 hover:border-stone-300'
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                    formData.isActive ? 'bg-emerald-600' : 'bg-stone-300'
                  )}
                >
                  {formData.isActive ? <Eye className="h-5 w-5 text-white" /> : <EyeOff className="h-5 w-5 text-white" />}
                </span>
                <span>
                  <span className={cn('block font-medium', formData.isActive ? 'text-emerald-800' : 'text-stone-700')}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="block text-sm text-stone-500">
                    {formData.isActive
                      ? 'This hero is shown on the blog page (others are deactivated).'
                      : 'This hero is hidden from visitors.'}
                  </span>
                </span>
              </span>
              {formData.isActive && <Check className="h-5 w-5 flex-shrink-0 text-emerald-600" aria-hidden />}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete hero section?"
        message={
          <>
            <span className="font-medium text-stone-900">&ldquo;{pendingDelete?.title}&rdquo;</span> will be removed
            permanently. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete hero"
        loading={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </AdminPage>
  );
}
