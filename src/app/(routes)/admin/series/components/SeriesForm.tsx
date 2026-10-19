'use client';

import { useState } from 'react';
import { Eye, FileText, Image as ImageIcon, Images, ListTree, Palette, Save } from 'lucide-react';
import { Button, FormField, Input, Section, Switch, Textarea } from '@/components/admin/ui';
import { AccentField, DEFAULT_ACCENT } from '@/app/(routes)/admin/themes/components/collection/AccentField';
import { CoverImageField } from '@/app/(routes)/admin/themes/components/collection/CoverImageField';
import { GalleryEditor } from '@/app/(routes)/admin/themes/components/collection/GalleryEditor';
import { focusFirstError } from '@/app/(routes)/admin/themes/components/collection/focusFirstError';
import { type Series, type SeriesInput, type GalleryImage, type Subitem } from '../services/seriesAdminService';
import SubitemsEditor from './SubitemsEditor';

interface SeriesFormProps {
  series?: Series;
  onSubmit: (data: SeriesInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// Mirrors sisila_backend/src/models/seriesModel.js
const LIMITS = { id: 50, title: 100, tagline: 200, description: 500, itemTitle: 100, galleryMin: 4, galleryMax: 12 };

const counter = (value: string, max: number) => `${value.length}/${max}`;

export default function SeriesForm({ series, onSubmit, onCancel, loading = false }: SeriesFormProps) {
  const [formData, setFormData] = useState<SeriesInput>({
    id: series?.id || '',
    title: series?.title || '',
    tagline: series?.tagline || '',
    description: series?.description || '',
    cover: series?.cover || '',
    accent: series?.accent || DEFAULT_ACCENT,
    subitems: series?.subitems || [],
    gallery: series?.gallery || [],
    isActive: series?.isActive ?? true,
    order: series?.order || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const setField = <K extends keyof SeriesInput>(field: K, value: SeriesInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field as string);
  };

  const dropErrors = (prefix: string) =>
    setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !k.startsWith(prefix))));

  const handleAddGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { title: '', image: '' }],
    }));
    clearError('gallery');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
    dropErrors('gallery-');
  };

  const handleGalleryImageChange = (index: number, field: keyof GalleryImage, value: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    }));
    clearError(`gallery-${index}-${field}`);
  };

  const handleAddSubitem = () => {
    setFormData((prev) => ({
      ...prev,
      subitems: [...(prev.subitems || []), { title: '' }],
    }));
  };

  const handleRemoveSubitem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subitems: (prev.subitems || []).filter((_, i) => i !== index),
    }));
    dropErrors('subitem-');
  };

  const handleSubitemChange = (index: number, field: keyof Subitem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      subitems: (prev.subitems || []).map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
    clearError(`subitem-${index}-${field}`);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Series ID is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.id)) {
      newErrors.id = 'ID must be lowercase letters, numbers, and dashes only';
    } else if (formData.id.length > LIMITS.id) {
      newErrors.id = `ID cannot exceed ${LIMITS.id} characters`;
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.cover.trim()) {
      newErrors.cover = 'Cover image URL is required';
    }

    if (formData.gallery.length < LIMITS.galleryMin || formData.gallery.length > LIMITS.galleryMax) {
      newErrors.gallery = `Gallery must contain between ${LIMITS.galleryMin} and ${LIMITS.galleryMax} images`;
    }

    formData.gallery.forEach((img, index) => {
      if (!img.title.trim()) {
        newErrors[`gallery-${index}-title`] = 'Image title is required';
      }
      if (!img.image.trim()) {
        newErrors[`gallery-${index}-image`] = 'Image URL is required';
      }
    });

    (formData.subitems || []).forEach((item, index) => {
      if (!item.title.trim()) {
        newErrors[`subitem-${index}-title`] = 'Subitem title is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      focusFirstError();
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // The page shows the backend's error message in a toast; keep the form open.
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          <Section title="Basic information" subtitle="How this series is introduced on the storefront" icon={<FileText className="h-5 w-5" />}>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              <FormField
                label="Series ID"
                htmlFor="id"
                required
                error={errors.id}
                hint={series ? "The ID can't be changed after the series is created." : 'Lowercase letters, numbers and dashes, e.g. poets.'}
              >
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setField('id', e.target.value)}
                  disabled={!!series}
                  maxLength={LIMITS.id}
                  invalid={!!errors.id}
                  placeholder="poets"
                  className="font-mono"
                  spellCheck={false}
                  autoComplete="off"
                />
              </FormField>

              <FormField label="Title" htmlFor="title" required error={errors.title} hint={counter(formData.title, LIMITS.title)}>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setField('title', e.target.value)}
                  maxLength={LIMITS.title}
                  invalid={!!errors.title}
                  placeholder="Poets Series"
                />
              </FormField>

              <FormField
                label="Tagline"
                htmlFor="tagline"
                required
                error={errors.tagline}
                hint={counter(formData.tagline, LIMITS.tagline)}
                className="md:col-span-2"
              >
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setField('tagline', e.target.value)}
                  maxLength={LIMITS.tagline}
                  invalid={!!errors.tagline}
                  placeholder="Verses, voices, and enduring resonance."
                />
              </FormField>

              <FormField
                label="Description"
                htmlFor="description"
                required
                error={errors.description}
                hint={counter(formData.description, LIMITS.description)}
                className="md:col-span-2"
              >
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setField('description', e.target.value)}
                  maxLength={LIMITS.description}
                  invalid={!!errors.description}
                  placeholder="Featuring inspirations and visual homages..."
                  className="resize-y"
                />
              </FormField>
            </div>
          </Section>

          <Section title="Subitems" subtitle="Optional — e.g. poet names, alphabet letters" icon={<ListTree className="h-5 w-5" />}>
            <SubitemsEditor
              items={formData.subitems || []}
              onAdd={handleAddSubitem}
              onRemove={handleRemoveSubitem}
              onChangeItem={handleSubitemChange}
              errors={errors}
              titleMaxLength={LIMITS.itemTitle}
            />
          </Section>

          <Section
            title="Gallery"
            subtitle={`${LIMITS.galleryMin}–${LIMITS.galleryMax} images shown with this series on the storefront`}
            icon={<Images className="h-5 w-5" />}
          >
            <div data-field-error={errors.gallery ? 'true' : undefined}>
              {errors.gallery && (
                <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errors.gallery}</p>
              )}
              <GalleryEditor
                items={formData.gallery}
                onAdd={handleAddGalleryImage}
                onRemove={handleRemoveGalleryImage}
                onChangeItem={handleGalleryImageChange}
                errors={errors}
                min={LIMITS.galleryMin}
                max={LIMITS.galleryMax}
                titleMaxLength={LIMITS.itemTitle}
              />
            </div>
          </Section>
        </div>

        {/* Side column */}
        <div className="space-y-4 sm:space-y-6">
          <Section title="Cover image" icon={<ImageIcon className="h-5 w-5" />}>
            <CoverImageField value={formData.cover} onChange={(v) => setField('cover', v)} error={errors.cover} />
          </Section>

          <Section title="Accent" subtitle="Gradient behind the title on the storefront" icon={<Palette className="h-5 w-5" />}>
            <AccentField value={formData.accent || ''} onChange={(v) => setField('accent', v)} previewTitle={formData.title} />
          </Section>

          <Section title="Visibility" icon={<Eye className="h-5 w-5" />}>
            <div className="space-y-5">
              <FormField label="Display order" htmlFor="order" hint="Lower numbers appear first.">
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) => setField('order', Math.max(0, parseInt(e.target.value) || 0))}
                />
              </FormField>
              <Switch
                id="isActive"
                checked={!!formData.isActive}
                onChange={(checked) => setField('isActive', checked)}
                label="Active"
                description="Show this series on the storefront"
              />
            </div>
          </Section>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-2 rounded-xl border border-stone-200 bg-white/95 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:p-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} loadingText={series ? 'Updating...' : 'Creating...'} leftIcon={<Save className="h-4 w-4" />}>
          {series ? 'Update Series' : 'Create Series'}
        </Button>
      </div>
    </form>
  );
}
