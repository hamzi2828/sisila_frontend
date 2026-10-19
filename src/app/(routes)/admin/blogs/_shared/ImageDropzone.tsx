'use client';

// Click-or-drop image picker with preview, used by the Blogs, Blog Settings and
// Hero Slides admin forms. Files are shrunk with `prepareImage` before they reach
// the parent, so forms can append them to FormData as-is.
import Image from 'next/image';
import { ImagePlus, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/admin/ui';
import { formatBytes, oversizeMessage, prepareImage, validateImageFile } from './imageUpload';

export interface ImageDropzoneProps {
  id: string;
  /** Newly picked (already prepared) file, controlled by the parent. */
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Image already saved on the server, shown when no new file is picked. */
  currentUrl?: string;
  /** Lets the admin clear the saved image (only where the form supports it). */
  onClearCurrent?: () => void;
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  /** Classes for the preview frame, e.g. "aspect-[16/9]" or "h-40 w-40". */
  previewClassName?: string;
  /** Round preview (avatars, category thumbnails). */
  circle?: boolean;
  disabled?: boolean;
  /** Label used in size messages ("Cover image is 6 MB..."). */
  name?: string;
  className?: string;
}

export default function ImageDropzone({
  id,
  file,
  onFileChange,
  currentUrl,
  onClearCurrent,
  label,
  required,
  hint,
  error,
  previewClassName = 'aspect-[16/9]',
  circle = false,
  disabled = false,
  name = 'Image',
  className,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl('');
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!file) setNote(null);
  }, [file]);

  const previewUrl = objectUrl || currentUrl || '';
  const busy = disabled || processing;

  const openPicker = () => {
    if (!busy) inputRef.current?.click();
  };

  const handleFile = async (picked: File | undefined) => {
    if (!picked) return;
    setLocalError(null);
    const invalid = validateImageFile(picked);
    if (invalid) {
      setLocalError(invalid);
      return;
    }
    setProcessing(true);
    try {
      const prepared = await prepareImage(picked);
      const tooBig = oversizeMessage(prepared, name);
      if (tooBig) {
        setLocalError(tooBig);
        return;
      }
      setNote(
        prepared.size < picked.size
          ? `${picked.name} · optimized from ${formatBytes(picked.size)} to ${formatBytes(prepared.size)}`
          : `${picked.name} · ${formatBytes(prepared.size)}`
      );
      onFileChange(prepared);
    } catch (err) {
      console.error('Could not prepare image:', err);
      setLocalError(err instanceof Error && err.message ? err.message : 'Could not read that image. Try a different file.');
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setLocalError(null);
    if (file) onFileChange(null);
    else onClearCurrent?.();
  };

  const canRemove = Boolean(file) || Boolean(currentUrl && onClearCurrent);
  const shownError = localError || error;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {hint && <p className="mb-2 text-xs text-stone-500">{hint}</p>}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={busy}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {previewUrl ? (
        <div className={cn('flex gap-4', circle ? 'items-center' : 'flex-col')}>
          <div
            className={cn(
              'group relative shrink-0 overflow-hidden border border-stone-200 bg-stone-100',
              circle ? 'h-20 w-20 rounded-full' : 'w-full rounded-xl',
              !circle && previewClassName
            )}
          >
            <Image
              src={previewUrl}
              alt={`${name} preview`}
              fill
              unoptimized
              sizes={circle ? '80px' : '(max-width: 768px) 100vw, 640px'}
              className="object-cover"
            />
            {processing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 className="h-6 w-6 animate-spin text-stone-500" aria-hidden />
              </div>
            )}
            {!circle && (
              <div className="absolute right-2 top-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={busy}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1.5 text-xs font-medium text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                  Change
                </button>
                {canRemove && (
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={busy}
                    aria-label={`Remove ${name.toLowerCase()}`}
                    title="Remove"
                    className="inline-flex items-center rounded-lg bg-white/90 p-1.5 text-stone-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={cn('min-w-0', circle ? 'flex-1' : '')}>
            {circle && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                  Change
                </button>
                {canRemove && (
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Remove
                  </button>
                )}
              </div>
            )}
            <p className={cn('truncate text-xs text-stone-500', circle && 'mt-1.5')}>
              {processing ? 'Optimizing image…' : note || (file ? file.name : 'Current image')}
            </p>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={busy ? -1 : 0}
          aria-disabled={busy}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!busy) handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-stone-50 p-6 text-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20',
            circle ? 'h-28 w-28 rounded-full p-3' : 'rounded-xl',
            shownError ? 'border-red-300' : dragging ? 'border-stone-900 bg-stone-100' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-100',
            busy && 'cursor-not-allowed opacity-60'
          )}
        >
          {processing ? (
            <Loader2 className="h-7 w-7 animate-spin text-stone-400" aria-hidden />
          ) : circle ? (
            <ImagePlus className="h-7 w-7 text-stone-400" aria-hidden />
          ) : (
            <Upload className="mb-2 h-8 w-8 text-stone-400" aria-hidden />
          )}
          {!circle && (
            <>
              <p className="text-sm text-stone-600">
                <span className="font-medium text-stone-900">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-xs text-stone-400">PNG, JPG, WebP or GIF. Large photos are optimized automatically.</p>
            </>
          )}
          {circle && <span className="mt-1 text-[11px] font-medium text-stone-500">Upload</span>}
        </div>
      )}

      {shownError && <p className="mt-1.5 text-xs text-red-600">{shownError}</p>}
    </div>
  );
}
