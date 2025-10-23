"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export interface CategoryInput {
  name: string;
  slug: string;
  description: string;
  active: boolean;
  platform?: 'gymwear' | 'gymfolio';
  thumbnail?: File;
  banner?: File;
}

interface CategoryModalProps {
  open: boolean;
  mode: "create" | "edit";
  initial?: Partial<CategoryInput> & { thumbnailUrl?: string; bannerUrl?: string };
  onClose: () => void;
  onSubmit: (data: CategoryInput) => void;
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CategoryModal({ open, mode, initial, onClose, onSubmit }: CategoryModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [platform, setPlatform] = useState<'gymwear' | 'gymfolio'>((initial as any)?.platform ?? 'gymwear');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setActive(initial?.active ?? true);
      setPlatform((initial as any)?.platform ?? 'gymwear');
      setThumbnail(null);
      setBanner(null);
    }
  }, [open, initial]);

  const slug = useMemo(() => slugify(name), [name]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {mode === "create" ? "Add Category" : "Edit Category"}
          </h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              name: name.trim(),
              slug,
              description: description.trim(),
              active,
              platform,
              thumbnail: thumbnail || undefined,
              banner: banner || undefined
            });
          }}
        >
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="e.g., Bottoms"
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Slug (auto)</label>
              <input
                type="text"
                className="mt-1 h-11 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600"
                value={slug}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Platform</label>
              <select
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as 'gymwear' | 'gymfolio')}
                required
              >
                <option value="gymwear">Gymwear</option>
                <option value="gymfolio">Gymfolio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                placeholder="Optional: short description of this category"
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Image uploads in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Thumbnail Image (Optional)</label>
                {/* Show current image preview if editing */}
                {mode === "edit" && initial?.thumbnailUrl && !thumbnail && (
                  <div className="mt-1 mb-2">
                    <div className="relative h-16 w-16 rounded border overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${initial.thumbnailUrl}`}
                        alt="Current thumbnail"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current thumbnail</p>
                  </div>
                )}
                {/* Show new file preview */}
                {thumbnail && (
                  <div className="mt-1 mb-2">
                    <div className="relative h-16 w-16 rounded border overflow-hidden">
                      <Image
                        src={URL.createObjectURL(thumbnail)}
                        alt="New thumbnail preview"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">New thumbnail preview</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                />
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Banner Image (Optional)</label>
                {/* Show current banner preview if editing */}
                {mode === "edit" && initial?.bannerUrl && !banner && (
                  <div className="mt-1 mb-2">
                    <div className="relative h-16 w-32 rounded border overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${initial.bannerUrl}`}
                        alt="Current banner"
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current banner</p>
                  </div>
                )}
                {/* Show new banner preview */}
                {banner && (
                  <div className="mt-1 mb-2">
                    <div className="relative h-16 w-32 rounded border overflow-hidden">
                      <Image
                        src={URL.createObjectURL(banner)}
                        alt="New banner preview"
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">New banner preview</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => setBanner(e.target.files?.[0] || null)}
                />
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label htmlFor="active" className="text-sm text-gray-700">Active</label>
            </div>
          </div>

          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
