"use client";
import React, { useState } from "react";
import { Image as ImageIcon, Link as LinkIcon, Save, Settings2, Type } from "lucide-react";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  FormField,
  Input,
  Switch,
  Textarea,
} from "@/components/admin/ui";
import { assetUrl } from "@/lib/productMedia";
import { HeroSlide, HeroSlideInput } from "../services/heroAdminService";
import ImageDropzone from "../../blogs/_shared/ImageDropzone";

interface HeroSlideFormProps {
  slide?: HeroSlide;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const LIMITS = { title: 100, description: 500, buttonText: 30, ariaLabel: 100 };

function SectionTitle({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-5 w-5 text-stone-700" aria-hidden />
      <h3 className="text-sm font-semibold text-stone-900">{children}</h3>
    </div>
  );
}

function Counter({ value, max }: { value: string | undefined; max: number }) {
  const length = (value || "").length;
  return <span className={length > max ? "text-red-500" : "text-stone-400"}>({length}/{max})</span>;
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
  const savedImage = slide?.imageUrl ? assetUrl(slide.imageUrl) : "";
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

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) setErrors(prev => ({ ...prev, image: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > LIMITS.title) {
      newErrors.title = `Title cannot exceed ${LIMITS.title} characters`;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > LIMITS.description) {
      newErrors.description = `Description cannot exceed ${LIMITS.description} characters`;
    }

    if (!imageFile && !slide) {
      newErrors.image = "Image is required";
    }

    if (formData.buttonText && formData.buttonText.length > LIMITS.buttonText) {
      newErrors.buttonText = `Button text cannot exceed ${LIMITS.buttonText} characters`;
    }

    if (formData.secondButtonText && formData.secondButtonText.length > LIMITS.buttonText) {
      newErrors.secondButtonText = `Second button text cannot exceed ${LIMITS.buttonText} characters`;
    }

    if (formData.ariaLabel && formData.ariaLabel.length > LIMITS.ariaLabel) {
      newErrors.ariaLabel = `Aria label cannot exceed ${LIMITS.ariaLabel} characters`;
    }

    if (!formData.order || formData.order < 1) {
      newErrors.order = "Order must be 1 or higher";
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

    // Add image file if selected (already optimized by the picker)
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      // The page shows the error toast; keep the form open
      console.error('Form submission error:', error);
    }
  };

  const buttonGroups = [
    {
      title: "First Button",
      textName: "buttonText" as const,
      linkName: "buttonLink" as const,
      textPlaceholder: "e.g., Shop Now",
      linkPlaceholder: "e.g., /shop",
    },
    {
      title: "Second Button",
      textName: "secondButtonText" as const,
      linkName: "secondButtonLink" as const,
      textPlaceholder: "e.g., Learn More",
      linkPlaceholder: "e.g., /about",
    },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card padding="none">
        <CardHeader
          title={slide ? 'Edit Hero Slide' : 'Create Hero Slide'}
          subtitle={slide ? "Update the slide's text, buttons and image." : "Fill in the text, add an image, and choose where it sits in the carousel."}
          icon={<ImageIcon className="h-5 w-5" />}
        />

        <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-5">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-3">
            {/* Content */}
            <div>
              <SectionTitle icon={Type}>Content</SectionTitle>
              <div className="space-y-4">
                <FormField
                  label={<>Title <Counter value={formData.title} max={LIMITS.title} /></>}
                  htmlFor="title"
                  required
                  error={errors.title}
                >
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    invalid={!!errors.title}
                    onChange={handleInputChange}
                    placeholder="Enter slide title"
                    disabled={loading}
                  />
                </FormField>

                <FormField
                  label={<>Description <Counter value={formData.description} max={LIMITS.description} /></>}
                  htmlFor="description"
                  required
                  error={errors.description}
                >
                  <Textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    invalid={!!errors.description}
                    onChange={handleInputChange}
                    placeholder="Enter slide description"
                    disabled={loading}
                  />
                </FormField>
              </div>
            </div>

            {/* Buttons */}
            <div className="border-t border-stone-200 pt-5">
              <SectionTitle icon={LinkIcon}>Call to Action Buttons</SectionTitle>
              <div className="space-y-3">
                {buttonGroups.map((group) => (
                  <div key={group.textName} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500">{group.title} (optional)</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormField label="Button text" htmlFor={group.textName} error={errors[group.textName]}>
                        <Input
                          type="text"
                          name={group.textName}
                          id={group.textName}
                          value={formData[group.textName]}
                          invalid={!!errors[group.textName]}
                          onChange={handleInputChange}
                          placeholder={group.textPlaceholder}
                          disabled={loading}
                        />
                      </FormField>
                      <FormField label="Button link" htmlFor={group.linkName}>
                        <Input
                          type="text"
                          name={group.linkName}
                          id={group.linkName}
                          value={formData[group.linkName]}
                          onChange={handleInputChange}
                          placeholder={group.linkPlaceholder}
                          disabled={loading}
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="border-t border-stone-200 pt-5">
              <SectionTitle icon={Settings2}>Settings</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Order" htmlFor="order" hint="Lower numbers show first in the carousel." error={errors.order}>
                  <Input
                    type="number"
                    name="order"
                    id="order"
                    min="1"
                    value={formData.order}
                    invalid={!!errors.order}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </FormField>

                <FormField
                  label={<>Aria Label <Counter value={formData.ariaLabel} max={LIMITS.ariaLabel} /></>}
                  htmlFor="ariaLabel"
                  hint="Describes the slide for screen readers."
                  error={errors.ariaLabel}
                >
                  <Input
                    type="text"
                    name="ariaLabel"
                    id="ariaLabel"
                    value={formData.ariaLabel}
                    invalid={!!errors.ariaLabel}
                    onChange={handleInputChange}
                    placeholder="Accessibility description"
                    disabled={loading}
                  />
                </FormField>
              </div>

              <div className="mt-4 rounded-xl border border-stone-200 p-4">
                <Switch
                  id="isActive"
                  checked={Boolean(formData.isActive)}
                  onChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  disabled={loading}
                  label="Active"
                  description="Active slides are visible in the homepage carousel."
                />
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 lg:sticky lg:top-4">
              <SectionTitle icon={ImageIcon}>
                Hero Image {!slide && <span className="text-red-500">*</span>}
              </SectionTitle>
              <ImageDropzone
                id="image-upload"
                name="Hero image"
                hint="Use a wide landscape image (for example 1920 × 800px). Large photos are optimized before upload."
                file={imageFile}
                onFileChange={handleImageChange}
                currentUrl={savedImage}
                error={errors.image}
                previewClassName="aspect-[16/9]"
                disabled={loading}
              />
              {slide && !imageFile && (
                <p className="mt-2 text-xs text-stone-500">Leave as is to keep the current image, or choose Change to replace it.</p>
              )}
            </div>
          </div>
        </div>

        <CardFooter>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} loadingText="Saving..." leftIcon={<Save className="h-4 w-4" />}>
            {slide ? 'Update Slide' : 'Create Slide'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
