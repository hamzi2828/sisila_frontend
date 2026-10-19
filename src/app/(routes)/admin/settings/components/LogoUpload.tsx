'use client';

import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, ImageOff, Loader2, RefreshCw, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button, ConfirmDialog } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { PanelHeader } from './SettingsPanel';

interface LogoUploadProps {
  currentLogo?: string;
  /** Resolves true when the upload succeeded. */
  onUpload: (file: File) => Promise<boolean>;
  /** Resolves true when the logo was reset. */
  onRemove: () => Promise<boolean>;
  isLoading?: boolean;
}

// Types the backend's settings controller accepts for the logo (SVG is rejected there).
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
// Large photos are compressed in the browser before upload, so only reject absurdly large picks here.
const MAX_PICK_BYTES = 25 * 1024 * 1024;
// What the backend stores when no custom logo is set (it is not a real file in this frontend).
const DEFAULT_LOGO_PATHS = new Set(['', '/images/logo.png']);

/** logoUrl may be a Vercel Blob URL, a legacy backend /uploads path or a frontend /public path. */
function resolveLogoUrl(src: string) {
  if (/^(data:|blob:|https?:\/\/)/i.test(src)) return src;
  if (src.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${src}`;
  return src.startsWith('/') ? src : `/${src}`;
}

export default function LogoUpload({ currentLogo, onUpload, onRemove, isLoading }: LogoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  // Tracked per image URL so switching between preview / saved logo never shows stale values.
  const [measured, setMeasured] = useState<{ src: string; width: number; height: number } | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const savedLogo = (currentLogo || '').trim();
  const hasCustomLogo = !DEFAULT_LOGO_PATHS.has(savedLogo);
  const logoSrc = preview || (hasCustomLogo ? resolveLogoUrl(savedLogo) : null);
  const busy = !!isLoading || uploading || removing;
  const failed = !!logoSrc && failedSrc === logoSrc;
  const dimensions = measured && measured.src === logoSrc ? measured : null;

  // Release the object URL used for the local preview.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const openPicker = () => {
    if (!busy) fileInputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
    // Allow picking the same file again after a failed upload.
    e.target.value = '';
  };

  const handleFileUpload = async (file: File) => {
    if (busy) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please choose a PNG, JPG, WebP or GIF image');
      return;
    }

    if (file.size > MAX_PICK_BYTES) {
      toast.error('That image is too large. Please choose a file under 25 MB.');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      // On success the saved logo URL takes over; on failure the previous logo comes back.
      setUploading(false);
      setPreview(null);
    }
  };

  const handleRemoveLogo = async () => {
    setRemoving(true);
    try {
      const ok = await onRemove();
      if (ok) setConfirmRemove(false);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        icon={ImageIcon}
        title="Site Logo"
        description="Upload your site logo. Recommended size: 200x60px or similar aspect ratio."
        className="mb-0"
      />

      {logoSrc ? (
        <div className="space-y-4">
          <div className="relative flex min-h-[10rem] items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-8">
            {failed ? (
              <div className="flex flex-col items-center gap-2 text-center text-sm text-stone-500">
                <ImageOff className="h-6 w-6 text-stone-400" />
                The logo could not be displayed.
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt="Site Logo"
                className={cn('max-h-24 w-auto max-w-full object-contain transition-opacity', uploading && 'opacity-40')}
                onLoad={(e) =>
                  setMeasured({ src: logoSrc, width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })
                }
                onError={() => setFailedSrc(logoSrc)}
              />
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm ring-1 ring-stone-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Optimising & uploading...
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-stone-600">
              {dimensions ? (
                <>
                  Current: <span className="font-semibold text-stone-900">{dimensions.width}×{dimensions.height}px</span>
                </>
              ) : (
                ' '
              )}
            </span>
            <span className="text-stone-600">
              Recommended: <span className="font-semibold text-stone-900">200×60px</span>
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button variant="secondary" onClick={openPicker} disabled={busy} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Replace Logo
            </Button>
            {hasCustomLogo && (
              <Button variant="danger-outline" onClick={() => setConfirmRemove(true)} disabled={busy} leftIcon={<X className="h-4 w-4" />}>
                Remove Logo
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload logo"
          aria-disabled={busy}
          className={cn(
            'relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 sm:p-12',
            dragActive ? 'border-stone-900 bg-stone-100' : 'border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100',
            busy && 'pointer-events-none opacity-60'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPicker();
            }
          }}
        >
          <div className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-stone-200">
              <Upload className="h-6 w-6 text-stone-500" />
            </div>
            <div>
              <p className="text-base font-medium text-stone-900">
                Drop your logo here, or <span className="underline underline-offset-2">browse</span>
              </p>
              <p className="mt-1 text-sm text-stone-500">PNG, JPG, WebP or GIF up to 5MB</p>
              {savedLogo && !hasCustomLogo && <p className="mt-2 text-xs text-stone-400">No custom logo is set — the default logo is used.</p>}
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-stone-900">Logo Guidelines</h4>
        <ul className="space-y-1 text-sm text-stone-600">
          <li>• Use a transparent PNG for best results</li>
          <li>• Recommended dimensions: 200×60 pixels or a similar aspect ratio</li>
          <li>• Large images are optimised automatically before upload</li>
        </ul>
      </div>

      <ConfirmDialog
        open={confirmRemove}
        title="Remove logo?"
        message="The site logo will be reset to the default logo."
        confirmLabel="Remove logo"
        loading={removing}
        onCancel={() => setConfirmRemove(false)}
        onConfirm={handleRemoveLogo}
      />
    </div>
  );
}
