"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import { HeroSlide, HeroSlideInput } from "../services/heroAdminService";

interface HeroSlideFormProps {
  slide?: HeroSlide;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function HeroSlideForm({ slide, onSubmit, onCancel, loading = false }: HeroSlideFormProps) {
  const [formData, setFormData] = useState<HeroSlideInput>({
    title: slide?.title || "",
    description: slide?.description || "",
    buttonText: slide?.buttonText || "",
    buttonLink: slide?.buttonLink || "",
    secondButtonText: slide?.secondButtonText || "",
    secondButtonLink: slide?.secondButtonLink || "",
    isActive: slide?.isActive ?? true,
    order: slide?.order || 1,
    ariaLabel: slide?.ariaLabel || ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    slide?.imageUrl ? (slide.imageUrl.startsWith("http") ? slide.imageUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}${slide.imageUrl}`) : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image file size must be less than 5MB" }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!imageFile && !slide) {
      newErrors.image = "Image is required";
    }

    if (formData.buttonText && formData.buttonText.length > 30) {
      newErrors.buttonText = "Button text cannot exceed 30 characters";
    }

    if (formData.secondButtonText && formData.secondButtonText.length > 30) {
      newErrors.secondButtonText = "Second button text cannot exceed 30 characters";
    }

    if (formData.ariaLabel && formData.ariaLabel.length > 100) {
      newErrors.ariaLabel = "Aria label cannot exceed 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = new FormData();
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        submitData.append(key, value.toString());
      }
    });

    // Add image file if selected
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {slide ? 'Edit Hero Slide' : 'Create Hero Slide'}
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
                  placeholder="Enter slide title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
                  placeholder="Enter slide description"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">
                    First Button Text
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.buttonText ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                    placeholder="e.g., Shop Now"
                  />
                  {errors.buttonText && <p className="mt-1 text-sm text-red-600">{errors.buttonText}</p>}
                </div>

                <div>
                  <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700">
                    First Button Link
                  </label>
                  <input
                    type="text"
                    name="buttonLink"
                    id="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., /shop"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="secondButtonText" className="block text-sm font-medium text-gray-700">
                    Second Button Text
                  </label>
                  <input
                    type="text"
                    name="secondButtonText"
                    id="secondButtonText"
                    value={formData.secondButtonText}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.secondButtonText ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                    placeholder="e.g., Learn More"
                  />
                  {errors.secondButtonText && <p className="mt-1 text-sm text-red-600">{errors.secondButtonText}</p>}
                </div>

                <div>
                  <label htmlFor="secondButtonLink" className="block text-sm font-medium text-gray-700">
                    Second Button Link
                  </label>
                  <input
                    type="text"
                    name="secondButtonLink"
                    id="secondButtonLink"
                    value={formData.secondButtonLink}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., /about"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    id="order"
                    min="1"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="ariaLabel" className="block text-sm font-medium text-gray-700">
                    Aria Label
                  </label>
                  <input
                    type="text"
                    name="ariaLabel"
                    id="ariaLabel"
                    value={formData.ariaLabel}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.ariaLabel ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                    placeholder="Accessibility description"
                  />
                  {errors.ariaLabel && <p className="mt-1 text-sm text-red-600">{errors.ariaLabel}</p>}
                </div>
              </div>

              {/* Active Status */}
              <div>
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active (slide will be visible on the website)
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image <span className="text-red-500">*</span>
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                {imagePreview ? (
                  <div className="relative w-full">
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      Click the X to remove and upload a different image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload an image</span>
                        <input
                          ref={fileInputRef}
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
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
              {slide ? 'Update Slide' : 'Create Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}