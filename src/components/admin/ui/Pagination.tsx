'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** When given, shows "Showing x to y of z {itemLabel}". */
  totalItems?: number;
  pageSize?: number;
  itemLabel?: string;
  className?: string;
}

/** Inked Wear list footer: summary on the left, prev / "Page x of y" / next on the right. */
export function Pagination({ page, totalPages, onPageChange, totalItems, pageSize, itemLabel = 'results', className }: PaginationProps) {
  const pages = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), pages);
  const from = totalItems && pageSize ? (totalItems === 0 ? 0 : (current - 1) * pageSize + 1) : null;
  const to = totalItems && pageSize ? Math.min(current * pageSize, totalItems) : null;

  const btn =
    'inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white p-2 text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20';

  return (
    <div className={cn('flex flex-col-reverse items-center justify-between gap-3 sm:flex-row', className)}>
      <p className="text-xs sm:text-sm text-stone-500">
        {from !== null && to !== null && typeof totalItems === 'number' ? (
          <>
            Showing <span className="font-medium text-stone-700">{from}</span> to{' '}
            <span className="font-medium text-stone-700">{to}</span> of{' '}
            <span className="font-medium text-stone-700">{totalItems}</span> {itemLabel}
          </>
        ) : typeof totalItems === 'number' ? (
          <>
            <span className="font-medium text-stone-700">{totalItems}</span> {itemLabel}
          </>
        ) : null}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className={btn} onClick={() => onPageChange(current - 1)} disabled={current <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[96px] text-center text-sm text-stone-600">
          Page <span className="font-medium text-stone-900">{current}</span> of {pages}
        </span>
        <button type="button" className={btn} onClick={() => onPageChange(current + 1)} disabled={current >= pages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
