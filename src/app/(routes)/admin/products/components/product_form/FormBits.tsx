'use client';

import { Layers, Package } from 'lucide-react';
import type { ComponentType } from 'react';
import { statusTone, toneDot } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

/** "12/60" counter that turns amber near the limit and red over it. */
export function CharCount({ value, max, warnAt }: { value: string; max: number; warnAt?: number }) {
  const len = value.length;
  const warn = warnAt ?? Math.floor(max * 0.85);
  return (
    <span
      className={cn(
        'tabular-nums',
        len > max ? 'font-medium text-red-600' : len > warn ? 'text-amber-600' : 'text-stone-400'
      )}
    >
      {len}/{max}
    </span>
  );
}

/** FormField hint with text on the left and a counter on the right. */
export function HintWithCount({ text, value, max }: { text?: string; value: string; max: number }) {
  return (
    <span className="flex items-start justify-between gap-3">
      <span>{text}</span>
      <CharCount value={value} max={max} />
    </span>
  );
}

// ---------------------------------------------------------------- Status

export type ProductStatusValue = 'published' | 'draft' | 'out_of_stock';

const STATUS_OPTIONS: { value: ProductStatusValue; label: string; description: string }[] = [
  { value: 'published', label: 'Published', description: 'Visible to customers in the store' },
  { value: 'draft', label: 'Draft', description: 'Saved, but hidden from the store' },
  { value: 'out_of_stock', label: 'Out of stock', description: 'Visible, but marked as unavailable' },
];

export function StatusPicker({ value, onChange }: { value: ProductStatusValue; onChange: (value: ProductStatusValue) => void }) {
  return (
    <div role="radiogroup" aria-label="Product status" className="space-y-2">
      {STATUS_OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              'relative flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-stone-900/20',
              active ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            )}
          >
            <input
              type="radio"
              name="product-status"
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                active ? 'border-stone-900' : 'border-stone-300'
              )}
            >
              {active && <span className="h-2 w-2 rounded-full bg-stone-900" />}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-sm font-medium text-stone-900">
                <span className={cn('h-1.5 w-1.5 rounded-full', toneDot[statusTone(option.value)])} aria-hidden />
                {option.label}
              </span>
              <span className="block text-xs text-stone-500">{option.description}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- Product type

type ProductTypeValue = 'single' | 'variant';

const TYPE_OPTIONS: { value: ProductTypeValue; label: string; description: string; icon: ComponentType<{ className?: string }> }[] = [
  { value: 'single', label: 'Single product', description: 'One price and one stock level', icon: Package },
  { value: 'variant', label: 'With variants', description: 'Colours and sizes, priced separately', icon: Layers },
];

export function ProductTypePicker({
  value,
  onChange,
  disabled,
}: {
  value: ProductTypeValue;
  onChange: (value: ProductTypeValue) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Product type" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {TYPE_OPTIONS.map((option) => {
        const active = value === option.value;
        const Icon = option.icon;
        return (
          <label
            key={option.value}
            className={cn(
              'relative flex items-center gap-3 rounded-lg border p-3 transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-stone-900/20',
              active ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              disabled && !active && 'opacity-50',
              !disabled && !active && 'hover:border-stone-300 hover:bg-stone-50'
            )}
          >
            <input
              type="radio"
              name="productType"
              value={option.value}
              checked={active}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                active ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-stone-900">{option.label}</span>
              <span className="block text-xs text-stone-500">{option.description}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
