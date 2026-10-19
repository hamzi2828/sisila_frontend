'use client';

import { useState } from 'react';
import { ImageIcon, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageThumbProps {
  src?: string | null;
  alt: string;
  /** Size / shape classes, e.g. "h-full w-full" or "h-10 w-10 rounded-md". */
  className?: string;
  /** Show a short caption under the placeholder icon ("No image" / "Can't load image"). */
  showLabel?: boolean;
}

/**
 * Plain <img> for externally hosted URLs (themes/series store raw image URLs, which may
 * point at any host), with a stone placeholder when the URL is empty or fails to load.
 */
export function ImageThumb({ src, alt, className, showLabel }: ImageThumbProps) {
  const url = src?.trim() || '';
  // Remember which URL failed, so a new URL is retried automatically.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = failedUrl === url;

  if (!url || failed) {
    const Icon = url ? ImageOff : ImageIcon;
    return (
      <div
        role="img"
        aria-label={url ? `${alt} (image failed to load)` : `${alt} (no image)`}
        className={cn('flex flex-col items-center justify-center gap-1 bg-stone-100 text-stone-400', className)}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden />
        {showLabel && <span className="px-2 text-center text-[11px] leading-tight">{url ? "Can't load image" : 'No image'}</span>}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} loading="lazy" onError={() => setFailedUrl(url)} className={cn('object-cover', className)} />
  );
}
