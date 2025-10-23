'use client';

import { useState } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { type Series, type SeriesInput, type GalleryImage, type Subitem } from '../services/seriesAdminService';

interface SeriesFormProps {
  series?: Series;
  onSubmit: (data: SeriesInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function SeriesForm({ series, onSubmit, onCancel, loading = false }: SeriesFormProps) {
  const [formData, setFormData] = useState<SeriesInput>({
    id: series?.id || '',
    title: series?.title || '',
    tagline: series?.tagline || '',
    description: series?.description || '',
    cover: series?.cover || '',
    accent: series?.accent || 'from-stone-900/90 to-stone-500/10',
    subitems: series?.subitems || [],
    gallery: series?.gallery || [],
    isActive: series?.isActive ?? true,
    order: series?.order || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, { title: '', image: '' }]
    }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleGalleryImageChange = (index: number, field: keyof GalleryImage, value: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const handleAddSubitem = () => {
    setFormData(prev => ({
      ...prev,
      subitems: [...(prev.subitems || []), { title: '' }]
    }));
  };

  const handleRemoveSubitem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subitems: (prev.subitems || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubitemChange = (index: number, field: keyof Subitem, value: string) => {
    setFormData(prev => ({
      ...prev,
      subitems: (prev.subitems || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Series ID is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.id)) {
      newErrors.id = 'ID must be lowercase letters, numbers, and dashes only';
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

    if (formData.gallery.length < 4 || formData.gallery.length > 12) {
      newErrors.gallery = 'Gallery must contain between 4 and 12 images';
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
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {series ? 'Edit Series' : 'Create Series'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Series ID */}
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                  Series ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="id"
                  id="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={!!series}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.id ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100`}
                  placeholder="poets"
                />
                {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  placeholder="Poets Series"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Tagline */}
              <div>
                <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
                  Tagline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tagline"
                  id="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.tagline ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  placeholder="Verses, voices, and enduring resonance."
                />
                {errors.tagline && <p className="mt-1 text-sm text-red-600">{errors.tagline}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  placeholder="Featuring inspirations and visual homages..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label htmlFor="cover" className="block text-sm font-medium text-gray-700">
                  Cover Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cover"
                  id="cover"
                  value={formData.cover}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.cover ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  placeholder="https://..."
                />
                {errors.cover && <p className="mt-1 text-sm text-red-600">{errors.cover}</p>}
                {formData.cover && (
                  <img src={formData.cover} alt="Cover preview" className="mt-2 h-32 w-full object-cover rounded" />
                )}
              </div>

              {/* Accent */}
              <div>
                <label htmlFor="accent" className="block text-sm font-medium text-gray-700">
                  Accent Gradient (Tailwind classes)
                </label>
                <input
                  type="text"
                  name="accent"
                  id="accent"
                  value={formData.accent}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="from-stone-900/90 to-stone-600/10"
                />
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    id="order"
                    min="0"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Subitems */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Subitems (Optional)
                <span className="ml-2 text-xs text-gray-500">e.g., poet names, alphabet letters</span>
              </label>
              <button
                type="button"
                onClick={handleAddSubitem}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
              >
                <FiPlus className="mr-1 h-3 w-3" />
                Add Subitem
              </button>
            </div>

            {(formData.subitems && formData.subitems.length > 0) && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.subitems.map((item, index) => (
                  <div key={index} className="flex gap-2 p-2 border border-gray-200 rounded">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleSubitemChange(index, 'title', e.target.value)}
                      className={`flex-1 block rounded-md border ${
                        errors[`subitem-${index}-title`] ? 'border-red-300' : 'border-gray-300'
                      } px-2 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      placeholder="e.g., Ghalib, Alif"
                    />
                    <input
                      type="text"
                      value={item.href || ''}
                      onChange={(e) => handleSubitemChange(index, 'href', e.target.value)}
                      className="flex-1 block rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Link (optional)"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubitem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Gallery Images <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-gray-500">(4-12 images required)</span>
              </label>
              <button
                type="button"
                onClick={handleAddGalleryImage}
                disabled={formData.gallery.length >= 12}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none disabled:opacity-50"
              >
                <FiPlus className="mr-1 h-3 w-3" />
                Add Image
              </button>
            </div>

            {errors.gallery && <p className="mb-2 text-sm text-red-600">{errors.gallery}</p>}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {formData.gallery.map((img, index) => (
                <div key={index} className="flex gap-2 p-3 border border-gray-200 rounded">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        value={img.title}
                        onChange={(e) => handleGalleryImageChange(index, 'title', e.target.value)}
                        className={`block w-full rounded-md border ${
                          errors[`gallery-${index}-title`] ? 'border-red-300' : 'border-gray-300'
                        } px-2 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                        placeholder="Image title"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={img.image}
                        onChange={(e) => handleGalleryImageChange(index, 'image', e.target.value)}
                        className={`block w-full rounded-md border ${
                          errors[`gallery-${index}-image`] ? 'border-red-300' : 'border-gray-300'
                        } px-2 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                        placeholder="Image URL"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              {series ? 'Update Series' : 'Create Series'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
