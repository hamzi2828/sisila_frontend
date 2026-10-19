'use client';

// Presentational image pickers for the product form. They only hand the picked files to the
// parent: ProductForm keeps the File objects and compresses them right before upload.
import Image from 'next/image';
import { ImagePlus, RefreshCw, Trash2, Undo2, Upload } from 'lucide-react';
import type { DragEvent, ReactNode, Ref } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type FilesHandler = (files: FileList) => void;

function useFileDrop(onFiles: FilesHandler, disabled?: boolean) {
  const [dragging, setDragging] = useState(false);
  return {
    dragging,
    handlers: {
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      },
      onDragLeave: () => setDragging(false),
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled && e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
      },
    },
  };
}

interface HiddenFileInputProps {
  id: string;
  inputRef?: Ref<HTMLInputElement>;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: FilesHandler;
}

/**
 * The real <input type="file">. It stays mounted (refs are used to reset it) and is opened by
 * <label htmlFor={id}> pickers, so clicking a tile needs no JavaScript.
 */
function HiddenFileInput({ id, inputRef, multiple, disabled, onFiles }: HiddenFileInputProps) {
  return (
    <input
      ref={inputRef}
      id={id}
      type="file"
      accept="image/*"
      multiple={multiple}
      disabled={disabled}
      className="peer sr-only"
      onChange={(e) => {
        const files = e.target.files;
        if (files && files.length) onFiles(files);
        // Allow picking the same file again after removing it
        e.target.value = '';
      }}
    />
  );
}

const overlayButton =
  'inline-flex h-7 items-center justify-center gap-1 rounded-lg bg-white/90 px-1.5 text-xs font-medium text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-stone-900 cursor-pointer';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  /** Small label in the bottom-left corner, e.g. "New" or "1". */
  caption?: ReactNode;
  /** Overlay buttons in the top-right corner. */
  actions?: ReactNode;
  sizes?: string;
}

function ImagePreview({ src, alt, className, caption, actions, sizes = '200px' }: ImagePreviewProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100', className)}>
      <Image src={src} alt={alt} fill unoptimized sizes={sizes} className="object-cover" />
      {caption && (
        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-stone-900/75 px-1.5 py-0.5 text-[10px] font-medium leading-none text-white">
          {caption}
        </span>
      )}
      {actions && <div className="absolute right-1.5 top-1.5 flex gap-1">{actions}</div>}
    </div>
  );
}

interface UploadTileProps {
  htmlFor: string;
  onFiles: FilesHandler;
  title: ReactNode;
  hint?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

/** Dashed click-or-drop tile. */
function UploadTile({ htmlFor, onFiles, title, hint, invalid, disabled, compact, className }: UploadTileProps) {
  const { dragging, handlers } = useFileDrop(onFiles, disabled);
  return (
    <label
      htmlFor={htmlFor}
      {...handlers}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-colors duration-200',
        compact ? 'gap-1 p-2' : 'p-4',
        invalid
          ? 'border-red-300 bg-red-50/50 hover:bg-red-50'
          : dragging
            ? 'border-stone-900 bg-stone-100'
            : 'border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100',
        'peer-focus-visible:ring-2 peer-focus-visible:ring-stone-900/20',
        disabled && 'pointer-events-none opacity-60',
        className
      )}
    >
      {compact ? (
        <ImagePlus className="h-5 w-5 text-stone-400" aria-hidden />
      ) : (
        <Upload className={cn('mb-2 h-7 w-7', invalid ? 'text-red-400' : 'text-stone-400')} aria-hidden />
      )}
      <span className={cn('font-medium text-stone-900', compact ? 'text-xs' : 'text-sm')}>{title}</span>
      {hint && <span className={cn('text-stone-500', compact ? 'text-[11px] leading-tight' : 'mt-1 text-xs')}>{hint}</span>}
    </label>
  );
}

export interface SingleImageFieldProps {
  id: string;
  inputRef?: Ref<HTMLInputElement>;
  /** Current preview: blob: URL for a new file, or the saved image URL. */
  src?: string;
  alt: string;
  onFiles: FilesHandler;
  /** Shown as a trash button (or an undo button when `removeMode` is "undo"). */
  onRemove?: () => void;
  removeMode?: 'remove' | 'undo';
  /** Marks a newly picked (unsaved) file. */
  isNew?: boolean;
  invalid?: boolean;
  title?: ReactNode;
  hint?: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Small tile (colour thumbnails): icon-only buttons, no hint. */
  compact?: boolean;
}

/** One image (thumbnail): dropzone when empty, preview with Replace / Remove when set. */
export function SingleImageField({
  id,
  inputRef,
  src,
  alt,
  onFiles,
  onRemove,
  removeMode = 'remove',
  isNew,
  invalid,
  title = 'Upload image',
  hint,
  className,
  disabled,
  compact,
}: SingleImageFieldProps) {
  const { dragging, handlers } = useFileDrop(onFiles, disabled);
  return (
    <div className="relative">
      <HiddenFileInput id={id} inputRef={inputRef} onFiles={onFiles} disabled={disabled} />
      {src ? (
        <div {...handlers} className={cn('rounded-xl peer-focus-visible:ring-2 peer-focus-visible:ring-stone-900/20', dragging && 'ring-2 ring-stone-900')}>
          <ImagePreview
            src={src}
            alt={alt}
            className={cn('aspect-square w-full', invalid && 'border-red-300', className)}
            sizes="(max-width: 640px) 60vw, 240px"
            caption={isNew ? 'New' : undefined}
            actions={
              <>
                <label htmlFor={id} className={cn(overlayButton, compact && 'w-7 px-0')} title="Replace image">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                  {compact ? <span className="sr-only">Replace</span> : 'Replace'}
                </label>
                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    title={removeMode === 'undo' ? 'Undo change' : 'Remove image'}
                    aria-label={removeMode === 'undo' ? `Undo ${alt.toLowerCase()} change` : `Remove ${alt.toLowerCase()}`}
                    className={cn(overlayButton, 'w-7 px-0', removeMode === 'remove' && 'hover:text-red-600')}
                  >
                    {removeMode === 'undo' ? <Undo2 className="h-3.5 w-3.5" aria-hidden /> : <Trash2 className="h-3.5 w-3.5" aria-hidden />}
                  </button>
                )}
              </>
            }
          />
        </div>
      ) : (
        <UploadTile
          htmlFor={id}
          onFiles={onFiles}
          title={title}
          hint={compact ? undefined : hint}
          invalid={invalid}
          disabled={disabled}
          compact={compact}
          className={cn('aspect-square w-full', className)}
        />
      )}
    </div>
  );
}

export interface ImageGalleryFieldProps {
  id: string;
  inputRef?: Ref<HTMLInputElement>;
  urls: string[];
  max: number;
  altPrefix: string;
  onFiles: FilesHandler;
  onRemove: (index: number) => void;
  /** Grid columns, e.g. "grid-cols-3 sm:grid-cols-5". */
  gridClassName?: string;
  /** Size of the wide dropzone shown while there are no images, e.g. "h-[88px] sm:h-[128px]". */
  emptyClassName?: string;
  /** Use the small icon/text style for the empty dropzone (narrow colour cards). */
  emptyCompact?: boolean;
  disabled?: boolean;
}

/** Several images (banners): preview tiles with remove buttons plus an "Add" tile until `max`. */
export function ImageGalleryField({
  id,
  inputRef,
  urls,
  max,
  altPrefix,
  onFiles,
  onRemove,
  gridClassName = 'grid-cols-3 sm:grid-cols-4',
  emptyClassName = 'h-32',
  emptyCompact,
  disabled,
}: ImageGalleryFieldProps) {
  const full = urls.length >= max;
  if (urls.length === 0) {
    return (
      <div className="relative">
        <HiddenFileInput id={id} inputRef={inputRef} multiple onFiles={onFiles} disabled={disabled} />
        <UploadTile
          htmlFor={id}
          onFiles={onFiles}
          disabled={disabled}
          compact={emptyCompact}
          title="Add images"
          hint={emptyCompact ? `Up to ${max}` : `Click or drop up to ${max} images`}
          className={cn('w-full', emptyClassName)}
        />
      </div>
    );
  }
  return (
    <div className="relative">
      <HiddenFileInput id={id} inputRef={inputRef} multiple onFiles={onFiles} disabled={disabled || full} />
      <div className={cn('grid gap-2.5 rounded-xl sm:gap-3 peer-focus-visible:ring-2 peer-focus-visible:ring-stone-900/20 peer-focus-visible:ring-offset-2', gridClassName)}>
        {urls.map((url, index) => (
          <ImagePreview
            key={`${url}-${index}`}
            src={url}
            alt={`${altPrefix} ${index + 1}`}
            className="aspect-square"
            sizes="(max-width: 640px) 30vw, 160px"
            caption={url.startsWith('blob:') ? 'New' : String(index + 1)}
            actions={
              <button
                type="button"
                onClick={() => onRemove(index)}
                title="Remove image"
                aria-label={`Remove ${altPrefix.toLowerCase()} ${index + 1}`}
                className={cn(overlayButton, 'w-7 px-0 hover:text-red-600')}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            }
          />
        ))}
        {!full && (
          <UploadTile
            htmlFor={id}
            onFiles={onFiles}
            compact
            disabled={disabled}
            title="Add images"
            hint={`${max - urls.length} left`}
            className="aspect-square"
          />
        )}
      </div>
    </div>
  );
}
