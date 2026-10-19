'use client';

import type { ReactNode } from 'react';
import { Input } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '../AllProducts';
import { ColorSwatch } from './OptionChips';

interface VariantEditorProps {
  variants: ProductVariant[];
  onChange: (index: number, patch: Partial<ProductVariant>) => void;
  /** Errors keyed "variant-<index>-<field>" (see ProductForm validate()). */
  errors: Record<string, string>;
}

// Same columns for the md+ header and every row
const columns = 'md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))_minmax(0,1.2fr)]';

const numberOrUndefined = (value: string) => (value === '' ? undefined : Number(value));

function Cell({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative min-w-0', className)}>
      {/* Labels are visible on phones (stacked cards); the md+ table header replaces them */}
      <span className="mb-1 block text-xs font-medium text-stone-600 md:sr-only">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** Price / discount / stock / SKU for every colour x size combination. */
export function VariantEditor({ variants, onChange, errors }: VariantEditorProps) {
  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <div
        className={cn(
          'hidden gap-3 border-b border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-stone-500 md:grid',
          columns
        )}
      >
        <span>Variant</span>
        <span>Price</span>
        <span>Discounted</span>
        <span>Stock</span>
        <span>SKU</span>
      </div>

      <ul className="divide-y divide-stone-100">
        {variants.map((variant, index) => {
          const name = `${variant.color} / ${variant.size}`;
          const err = (field: string) => errors[`variant-${index}-${field}`];
          return (
            <li
              key={`${variant.color}-${variant.size}`}
              className={cn('grid grid-cols-2 gap-x-3 gap-y-3 bg-white p-3 sm:p-4 md:items-start md:py-3', columns)}
            >
              <div className="col-span-2 flex min-w-0 items-center gap-2 md:col-span-1 md:pt-2">
                <ColorSwatch color={variant.color} />
                <span className="truncate text-sm font-medium text-stone-900">{variant.color}</span>
                <span className="shrink-0 rounded-md bg-stone-100 px-1.5 py-0.5 text-xs font-medium text-stone-700">
                  {variant.size}
                </span>
              </div>

              <Cell label="Price (Rs)" error={err('price')}>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  prefix="Rs"
                  placeholder="0"
                  aria-label={`${name} price (Rs)`}
                  invalid={!!err('price')}
                  className="py-2"
                  value={variant.price || ''}
                  onChange={(e) => onChange(index, { price: Number(e.target.value) })}
                />
              </Cell>

              <Cell label="Discounted (Rs)" error={err('discountedPrice')}>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  prefix="Rs"
                  placeholder="—"
                  aria-label={`${name} discounted price (Rs)`}
                  invalid={!!err('discountedPrice')}
                  className="py-2"
                  value={variant.discountedPrice ?? ''}
                  onChange={(e) => onChange(index, { discountedPrice: numberOrUndefined(e.target.value) })}
                />
              </Cell>

              <Cell label="Stock" error={err('stock')}>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  placeholder="0"
                  aria-label={`${name} stock`}
                  invalid={!!err('stock')}
                  className="py-2"
                  value={variant.stock || ''}
                  onChange={(e) => onChange(index, { stock: Number(e.target.value) })}
                />
              </Cell>

              <Cell label="SKU">
                <Input
                  type="text"
                  placeholder="Auto"
                  aria-label={`${name} SKU`}
                  className="py-2 font-mono text-xs sm:text-xs"
                  spellCheck={false}
                  autoComplete="off"
                  value={variant.sku ?? ''}
                  onChange={(e) => onChange(index, { sku: e.target.value || undefined })}
                />
              </Cell>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-500">
        <span>
          {variants.length} variant{variants.length === 1 ? '' : 's'} · {totalStock} in stock
        </span>
        <span>Leave SKU empty to generate one automatically</span>
      </div>
    </div>
  );
}
