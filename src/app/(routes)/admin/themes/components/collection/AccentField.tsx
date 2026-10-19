'use client';

import { Check } from 'lucide-react';
import { FormField, Input } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

export const DEFAULT_ACCENT = 'from-stone-900/90 to-stone-500/10';

/**
 * Storefront accent gradients. The storefront renders `bg-gradient-to-r ${accent}`, and
 * Tailwind only generates classes it can find in the source, so these literal strings
 * also guarantee the presets render on the storefront. Includes every value already in use.
 */
export const ACCENT_PRESETS: { label: string; value: string }[] = [
  { label: 'Stone', value: 'from-stone-900/90 to-stone-500/10' },
  { label: 'Stone soft', value: 'from-stone-900/90 to-stone-600/10' },
  { label: 'Black', value: 'from-black/90 to-black/5' },
  { label: 'Amber', value: 'from-amber-900/90 to-amber-500/10' },
  { label: 'Rose', value: 'from-rose-900/90 to-rose-500/10' },
  { label: 'Pink', value: 'from-pink-900/90 to-pink-500/10' },
  { label: 'Fuchsia', value: 'from-fuchsia-900/90 to-fuchsia-500/10' },
  { label: 'Violet', value: 'from-violet-900/90 to-violet-500/10' },
  { label: 'Sky', value: 'from-sky-900/90 to-sky-500/10' },
  { label: 'Emerald', value: 'from-emerald-900/90 to-emerald-500/10' },
];

interface AccentFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Title shown in the live preview. */
  previewTitle?: string;
}

export function AccentField({ id = 'accent', value, onChange, previewTitle }: AccentFieldProps) {
  const current = value.trim();
  const isPreset = ACCENT_PRESETS.some((p) => p.value === current);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-stone-700">Presets</p>
        <div className="grid grid-cols-5 gap-2">
          {ACCENT_PRESETS.map((preset) => {
            const selected = preset.value === current;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange(preset.value)}
                title={`${preset.label} — ${preset.value}`}
                aria-label={`${preset.label} accent`}
                aria-pressed={selected}
                className={cn(
                  'relative h-9 overflow-hidden rounded-lg border bg-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30',
                  selected ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-1' : 'border-stone-200 hover:border-stone-400'
                )}
              >
                <span className={cn('absolute inset-0 bg-gradient-to-r', preset.value)} aria-hidden />
                {selected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white shadow">
                      <Check className="h-3 w-3 text-stone-900" />
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <FormField
        label="Gradient classes"
        htmlFor={id}
        hint={
          isPreset || !current
            ? 'Tailwind gradient classes used behind the section title on the storefront.'
            : 'Custom value — classes not used anywhere else in the site may not render. Prefer a preset.'
        }
      >
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={DEFAULT_ACCENT}
          className="font-mono text-xs sm:text-sm"
          spellCheck={false}
          autoComplete="off"
        />
      </FormField>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">Storefront preview</p>
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white ring-1 ring-black/5">
          <div className={cn('absolute inset-x-0 top-0 h-16 bg-gradient-to-r', current)} aria-hidden />
          <div className="relative px-4 pb-4 pt-6">
            <p className="truncate text-base font-semibold uppercase text-stone-900">{previewTitle?.trim() || 'Section title'}</p>
            <div className="mt-2 h-2 w-3/4 rounded-full bg-stone-100" />
            <div className="mt-1.5 h-2 w-1/2 rounded-full bg-stone-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
