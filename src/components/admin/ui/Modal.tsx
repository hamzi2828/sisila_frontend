'use client';

import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-4xl',
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons row, right-aligned (stacked on mobile). */
  footer?: ReactNode;
  size?: ModalSize;
  /** Close when the backdrop is clicked / Escape pressed. Default true. */
  dismissible?: boolean;
  className?: string;
  bodyClassName?: string;
}

/** Centered dialog: bg-black/50 backdrop, white rounded-2xl panel, scrollable body. */
export function Modal({ open, onClose, title, description, children, footer, size = 'lg', dismissible = true, className, bodyClassName }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={dismissible ? onClose : undefined}
        aria-hidden
      />
      <div
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl',
          sizes[size],
          className
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              {title && <h2 className="text-lg font-semibold text-stone-900">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 shrink-0 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className={cn('flex-1 overflow-y-auto px-5 py-5 sm:px-6', bodyClassName)}>{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-stone-200 bg-stone-50/60 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: ReactNode;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** danger = red confirm button (deletes). */
  tone?: 'danger' | 'primary';
  loading?: boolean;
}

/** Replacement for window.confirm(): use for deletes and other destructive actions. */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onCancel}
      title={title}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {message && <div className="text-sm text-stone-600">{message}</div>}
    </Modal>
  );
}
