"use client";
import React, { useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";
import { ImagePlus, Save, X } from "lucide-react";
import { Button, FormField, Input, Modal, Switch, Textarea } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export interface CategoryInput {
  name: string;
  slug: string;
  description: string;
  active: boolean;
  featured?: boolean;
  thumbnailUrl?: string;
  bannerUrl?: string;
}

interface CategoryModalProps {
  open: boolean;
  mode: "create" | "edit";
  initial?: Partial<CategoryInput>;
  onClose: () => void;
  /** May return a promise; the modal shows a saving state until it settles. */
  onSubmit: (data: CategoryInput | FormData) => void | Promise<void>;
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function ImageField({
  id,
  label,
  hint,
  preview,
  wide,
  onFile,
  onRemove,
}: {
  id: string;
  label: string;
  hint: string;
  preview: string | null;
  wide?: boolean;
  onFile: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>
      {preview ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100",
            wide ? "h-32 w-full" : "h-32 w-32"
          )}
        >
          <Image src={preview} alt={`${label} preview`} fill sizes={wide ? "320px" : "128px"} className="object-cover" />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${label.toLowerCase()}`}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-stone-700 shadow-sm transition-colors hover:bg-white hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-4 text-center text-sm text-stone-500 transition-colors hover:border-stone-400 hover:bg-stone-100 focus-within:border-stone-900",
            wide ? "h-32 w-full" : "h-32 w-32"
          )}
        >
          <ImagePlus className="h-6 w-6 text-stone-400" aria-hidden />
          <span className="font-medium text-stone-700">Upload</span>
          <span className="text-xs">{hint}</span>
          <input
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}

export default function CategoryModal({ open, mode, initial, onClose, onSubmit }: CategoryModalProps) {
  const uid = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initial?.thumbnailUrl || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initial?.bannerUrl || null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setActive(initial?.active ?? true);
      setFeatured(initial?.featured ?? false);
      setThumbnailFile(null);
      setBannerFile(null);
      setThumbnailPreview(initial?.thumbnailUrl || null);
      setBannerPreview(initial?.bannerUrl || null);
      setSaving(false);
    }
  }, [open, initial]);

  const readPreview = (file: File, set: (v: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => set(reader.result as string);
    reader.readAsDataURL(file);
  };

  const slug = useMemo(() => slugify(name), [name]);
  const formId = `${uid}-category-form`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || saving) return;

    let payload: CategoryInput | FormData;
    // If we have files, use FormData
    if (thumbnailFile || bannerFile) {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("slug", slug);
      formData.append("description", description.trim());
      formData.append("active", active.toString());
      formData.append("featured", featured.toString());
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      if (bannerFile) formData.append("banner", bannerFile);
      payload = formData;
    } else {
      // Otherwise use regular JSON
      payload = {
        name: name.trim(),
        slug,
        description: description.trim(),
        active,
        featured,
        thumbnailUrl: thumbnailPreview || undefined,
        bannerUrl: bannerPreview || undefined,
      };
    }

    setSaving(true);
    try {
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : onClose}
      dismissible={!saving}
      size="xl"
      title={mode === "create" ? "Add category" : "Edit category"}
      description={mode === "create" ? "Group products together on the storefront." : "Update this category's details and images."}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            loading={saving}
            loadingText="Saving..."
            disabled={!name.trim()}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {mode === "create" ? "Create category" : "Save changes"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor={`${uid}-name`} required>
            <Input
              id={`${uid}-name`}
              type="text"
              placeholder="e.g. Bottoms"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </FormField>
          <FormField label="Slug" htmlFor={`${uid}-slug`} hint="Generated from the name">
            <Input id={`${uid}-slug`} type="text" value={slug} readOnly className="bg-stone-50 text-stone-500" />
          </FormField>
        </div>

        <FormField label="Description" htmlFor={`${uid}-description`}>
          <Textarea
            id={`${uid}-description`}
            rows={3}
            placeholder="Optional: short description of this category"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
          <ImageField
            id={`${uid}-thumbnail`}
            label="Thumbnail"
            hint="Square, up to 10MB"
            preview={thumbnailPreview}
            onFile={(file) => {
              setThumbnailFile(file);
              readPreview(file, setThumbnailPreview);
            }}
            onRemove={() => {
              setThumbnailFile(null);
              setThumbnailPreview(null);
            }}
          />
          <ImageField
            id={`${uid}-banner`}
            label="Banner"
            hint="Wide image, up to 10MB"
            preview={bannerPreview}
            wide
            onFile={(file) => {
              setBannerFile(file);
              readPreview(file, setBannerPreview);
            }}
            onRemove={() => {
              setBannerFile(null);
              setBannerPreview(null);
            }}
          />
        </div>

        <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-stone-50/60">
          <Switch
            id={`${uid}-active`}
            className="px-4 py-3"
            checked={active}
            onChange={setActive}
            label="Active"
            description="Only active categories can be picked in the product form and featured on the storefront."
          />
          <Switch
            id={`${uid}-featured`}
            className="px-4 py-3"
            checked={featured}
            onChange={setFeatured}
            label="Featured"
            description="Highlight this category on the storefront."
          />
        </div>
      </form>
    </Modal>
  );
}
