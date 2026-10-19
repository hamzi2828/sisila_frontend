"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { assetUrl } from '@/lib/productMedia';
import { Button, FormField, Input, Modal, Switch, Textarea } from "@/components/admin/ui";
import ImageDropzone from "../_shared/ImageDropzone";

export interface CategoryInput {
  name: string;
  slug: string;
  description: string;
  active: boolean;
  thumbnail?: File;
  banner?: File;
}

interface CategoryModalProps {
  open: boolean;
  mode: "create" | "edit";
  initial?: Partial<CategoryInput> & { thumbnailUrl?: string; bannerUrl?: string };
  onClose: () => void;
  onSubmit: (data: CategoryInput) => void | Promise<void>;
  /** Parent is saving: disables the form and shows a spinner on the submit button. */
  saving?: boolean;
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CategoryModal({ open, mode, initial, onClose, onSubmit, saving = false }: CategoryModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setActive(initial?.active ?? true);
      setThumbnail(null);
      setBanner(null);
      setNameError(null);
    }
  }, [open, initial]);

  const slug = useMemo(() => slugify(name), [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }
    onSubmit({
      name: name.trim(),
      slug,
      description: description.trim(),
      active,
      thumbnail: thumbnail || undefined,
      banner: banner || undefined
    });
  };

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : onClose}
      title={mode === "create" ? "Add Category" : "Edit Category"}
      description={mode === "create" ? "Create a new category to group blog posts." : "Update this category's details and images."}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="blog-category-form"
            loading={saving}
            loadingText="Saving..."
            leftIcon={<Check className="h-4 w-4" />}
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </>
      }
    >
      <form id="blog-category-form" onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="blog-category-name" required error={nameError}>
            <Input
              id="blog-category-name"
              type="text"
              placeholder="e.g., Poetry"
              value={name}
              invalid={!!nameError}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              disabled={saving}
            />
          </FormField>

          <FormField label="Slug (auto)" htmlFor="blog-category-slug" hint="Generated from the name.">
            <Input id="blog-category-slug" type="text" value={slug} readOnly disabled prefix="/" />
          </FormField>
        </div>

        <FormField label="Description" htmlFor="blog-category-description">
          <Textarea
            id="blog-category-description"
            rows={3}
            placeholder="Optional: short description of this category"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
          />
        </FormField>

        {/* Image uploads in one row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <ImageDropzone
              id="blog-category-thumbnail"
              name="Thumbnail"
              label="Thumbnail Image (Optional)"
              hint="A small square image, shown as a circle in lists."
              file={thumbnail}
              onFileChange={setThumbnail}
              currentUrl={mode === "edit" && initial?.thumbnailUrl ? assetUrl(initial.thumbnailUrl) : ""}
              circle
              disabled={saving}
            />
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <ImageDropzone
              id="blog-category-banner"
              name="Banner"
              label="Banner Image (Optional)"
              hint="A wider image used as the category's banner."
              file={banner}
              onFileChange={setBanner}
              currentUrl={mode === "edit" && initial?.bannerUrl ? assetUrl(initial.bannerUrl) : ""}
              previewClassName="aspect-[16/9]"
              disabled={saving}
            />
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 p-4">
          <Switch
            id="blog-category-active"
            checked={active}
            onChange={setActive}
            disabled={saving}
            label="Active"
            description="Turn off to deactivate this category without deleting it."
          />
        </div>
      </form>
    </Modal>
  );
}
