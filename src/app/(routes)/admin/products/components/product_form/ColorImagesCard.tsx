'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/admin/ui';
import { ColorSwatch } from './OptionChips';
import { ImageGalleryField, SingleImageField } from './ImageFields';

interface ColorImagesCardProps {
  color: string;
  thumbnailUrl?: string;
  bannerUrls: string[];
  hasNewThumbnail?: boolean;
  maxBanners: number;
  thumbRef: (el: HTMLInputElement | null) => void;
  bannerRef: (el: HTMLInputElement | null) => void;
  onThumbnailFiles: (files: FileList) => void;
  onBannerFiles: (files: FileList) => void;
  onRemoveBanner: (index: number) => void;
  onClear: () => void;
}

const idFor = (color: string, kind: string) => `color-${kind}-${color.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

/** Thumbnail + banner images for one colour of a variant product. */
export function ColorImagesCard({
  color,
  thumbnailUrl,
  bannerUrls,
  hasNewThumbnail,
  maxBanners,
  thumbRef,
  bannerRef,
  onThumbnailFiles,
  onBannerFiles,
  onRemoveBanner,
  onClear,
}: ColorImagesCardProps) {
  const count = (thumbnailUrl ? 1 : 0) + bannerUrls.length;
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <ColorSwatch color={color} className="h-4 w-4" />
          <span className="truncate text-sm font-semibold text-stone-900">{color}</span>
          <span className="shrink-0 text-xs text-stone-500">
            {count} image{count === 1 ? '' : 's'}
          </span>
        </div>
        {count > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} leftIcon={<Trash2 className="h-3.5 w-3.5" />} className="hover:text-red-600">
            <span className="hidden sm:inline">Clear images</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-600">Thumbnail</p>
          <SingleImageField
            id={idFor(color, 'thumbnail')}
            inputRef={thumbRef}
            src={thumbnailUrl}
            alt={`${color} thumbnail`}
            onFiles={onThumbnailFiles}
            isNew={hasNewThumbnail}
            compact
            title="Upload"
          />
        </div>
        <div className="min-w-0">
          <p className="mb-1.5 flex items-center justify-between text-xs font-medium text-stone-600">
            <span>Banner images</span>
            <span className="tabular-nums text-stone-400">
              {bannerUrls.length}/{maxBanners}
            </span>
          </p>
          <ImageGalleryField
            id={idFor(color, 'banners')}
            inputRef={bannerRef}
            urls={bannerUrls}
            max={maxBanners}
            altPrefix={`${color} banner`}
            onFiles={onBannerFiles}
            onRemove={onRemoveBanner}
            gridClassName="grid-cols-2 sm:grid-cols-3 xl:grid-cols-5"
            emptyClassName="h-[88px] sm:h-[128px]"
            emptyCompact
          />
        </div>
      </div>
    </div>
  );
}
