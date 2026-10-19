'use client';

import { ImagePlus, Plus, X } from 'lucide-react';
import { Badge, Button, Input } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { ImageThumb } from './ImageThumb';

export interface GalleryItem {
  _id?: string;
  title: string;
  image: string;
  href?: string;
}

interface GalleryEditorProps<T extends GalleryItem> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChangeItem: (index: number, field: 'title' | 'image', value: string) => void;
  /** Field errors keyed `gallery-${index}-title` / `gallery-${index}-image`. */
  errors: Record<string, string>;
  min?: number;
  max?: number;
  titleMaxLength?: number;
}

/** Gallery management grid: image preview tiles with title + URL fields, 4–12 count indicator. */
export function GalleryEditor<T extends GalleryItem>({
  items,
  onAdd,
  onRemove,
  onChangeItem,
  errors,
  min = 4,
  max = 12,
  titleMaxLength,
}: GalleryEditorProps<T>) {
  const count = items.length;
  const withinRange = count >= min && count <= max;
  const remainingToMin = Math.max(0, min - count);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone={withinRange ? 'success' : 'warning'} dot>
            {count} / {max} images
          </Badge>
          <span className="text-xs text-stone-500">
            {remainingToMin > 0
              ? `Add ${remainingToMin} more (minimum ${min})`
              : count >= max
                ? 'Maximum reached'
                : `${min}–${max} images required`}
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={onAdd} disabled={count >= max} leftIcon={<Plus className="h-4 w-4" />}>
          Add image
        </Button>
      </div>

      {count === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-500 transition-colors hover:border-stone-400 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-500 ring-1 ring-stone-200">
            <ImagePlus className="h-5 w-5" />
          </span>
          <span className="font-medium text-stone-900">No gallery images yet</span>
          <span>Add between {min} and {max} images by pasting their URLs.</span>
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const titleError = errors[`gallery-${index}-title`];
            const imageError = errors[`gallery-${index}-image`];
            return (
              <div
                key={item._id || index}
                data-field-error={titleError || imageError ? 'true' : undefined}
                className={cn(
                  'overflow-hidden rounded-xl border bg-white transition-shadow duration-200 hover:shadow-md',
                  titleError || imageError ? 'border-red-300' : 'border-stone-200'
                )}
              >
                <div className="relative aspect-[4/3] bg-stone-100">
                  <ImageThumb src={item.image} alt={item.title || `Gallery image ${index + 1}`} className="h-full w-full" showLabel />
                  <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold text-stone-900 shadow-sm backdrop-blur-sm">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    title="Remove image"
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-stone-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 p-3">
                  <div>
                    <label htmlFor={`gallery-${index}-title`} className="sr-only">
                      Image {index + 1} title
                    </label>
                    <Input
                      id={`gallery-${index}-title`}
                      value={item.title}
                      onChange={(e) => onChangeItem(index, 'title', e.target.value)}
                      placeholder="Image title"
                      maxLength={titleMaxLength}
                      invalid={!!titleError}
                      className="py-2"
                    />
                    {titleError && <p className="mt-1 text-xs text-red-600">{titleError}</p>}
                  </div>
                  <div>
                    <label htmlFor={`gallery-${index}-image`} className="sr-only">
                      Image {index + 1} URL
                    </label>
                    <Input
                      id={`gallery-${index}-image`}
                      type="text"
                      inputMode="url"
                      value={item.image}
                      onChange={(e) => onChangeItem(index, 'image', e.target.value)}
                      placeholder="https://..."
                      invalid={!!imageError}
                      className="py-2 font-mono text-xs"
                      spellCheck={false}
                      autoComplete="off"
                    />
                    {imageError && <p className="mt-1 text-xs text-red-600">{imageError}</p>}
                  </div>
                </div>
              </div>
            );
          })}

          {count < max && (
            <button
              type="button"
              onClick={onAdd}
              className="flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500 transition-colors hover:border-stone-400 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20"
            >
              <ImagePlus className="h-6 w-6 text-stone-400" />
              <span className="font-medium text-stone-700">Add image</span>
              <span className="text-xs">{max - count} slot{max - count === 1 ? '' : 's'} left</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
