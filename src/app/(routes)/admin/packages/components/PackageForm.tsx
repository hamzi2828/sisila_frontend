"use client";
import React, { useState } from "react";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { Package, PackageInput } from "../services/packageAdminService";

interface PackageFormProps {
  package?: Package;
  onSubmit: (packageData: PackageInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PackageForm({ package: pkg, onSubmit, onCancel, loading = false }: PackageFormProps) {
  const [formData, setFormData] = useState<PackageInput>({
    name: pkg?.name || "",
    price: pkg?.price || "",
    currency: pkg?.currency || "PKR",
    period: pkg?.period || "",
    features: pkg?.features || [""],
    theme: pkg?.theme || "light",
    badge: pkg?.badge || "",
    supportingText: pkg?.supportingText || "",
    isActive: pkg?.isActive ?? true,
    order: pkg?.order || 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Package name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Package name cannot exceed 100 characters";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }

    if (!formData.currency.trim()) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.period.trim()) {
      newErrors.period = "Period is required";
    }

    const validFeatures = formData.features.filter(f => f.trim() !== "");
    if (validFeatures.length === 0) {
      newErrors.features = "At least one feature is required";
    }

    if (formData.badge && formData.badge.length > 50) {
      newErrors.badge = "Badge text cannot exceed 50 characters";
    }

    if (formData.supportingText && formData.supportingText.length > 500) {
      newErrors.supportingText = "Supporting text cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filter out empty features
    const submitData: PackageInput = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== "")
    };

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
            {pkg ? 'Edit Package' : 'Create Package'}
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
              {/* Package Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Package Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  placeholder="e.g., Starter, Pro, Elite"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  placeholder="e.g., 5,000 or Custom"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              {/* Currency and Period */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="currency"
                    id="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.currency ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                    placeholder="PKR"
                  />
                  {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency}</p>}
                </div>

                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                    Period <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="period"
                    id="period"
                    value={formData.period}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.period ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                    placeholder="per month"
                  />
                  {errors.period && <p className="mt-1 text-sm text-red-600">{errors.period}</p>}
                </div>
              </div>

              {/* Badge */}
              <div>
                <label htmlFor="badge" className="block text-sm font-medium text-gray-700">
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  name="badge"
                  id="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.badge ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  placeholder="e.g., Popular, Best Value"
                />
                {errors.badge && <p className="mt-1 text-sm text-red-600">{errors.badge}</p>}
              </div>

              {/* Supporting Text */}
              <div>
                <label htmlFor="supportingText" className="block text-sm font-medium text-gray-700">
                  Supporting Text (Optional)
                </label>
                <textarea
                  name="supportingText"
                  id="supportingText"
                  rows={3}
                  value={formData.supportingText}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.supportingText ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  placeholder="Additional information about this package"
                />
                {errors.supportingText && <p className="mt-1 text-sm text-red-600">{errors.supportingText}</p>}
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
                    Active (package will be visible on the website)
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                        title="Remove feature"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.features && <p className="mt-2 text-sm text-red-600">{errors.features}</p>}
              <button
                type="button"
                onClick={addFeature}
                className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="h-4 w-4 mr-1" />
                Add Feature
              </button>
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
              {pkg ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
