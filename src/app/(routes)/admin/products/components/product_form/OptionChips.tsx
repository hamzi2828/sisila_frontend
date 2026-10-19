'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** CSS colour for a colour name ("Off White" -> "offwhite"); unknown names just render an empty ring. */
export const swatchColor = (name: string) => name.toLowerCase().replace(/\s+/g, '');

export function ColorSwatch({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-stone-300', className)}
      style={{ backgroundColor: swatchColor(color) }}
    />
  );
}

interface OptionChipsProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  /** Show a colour dot before each label. */
  swatches?: boolean;
  invalid?: boolean;
  /** Accessible name for the group, e.g. "Colours". */
  label: string;
}

/** Multi-select toggle chips (selected = bg-stone-900). */
export function OptionChips({ options, selected, onToggle, swatches, invalid, label }: OptionChipsProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2" data-field-error={invalid ? 'true' : undefined}>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20',
              active
                ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                : invalid
                  ? 'border-red-300 bg-white text-stone-700 hover:bg-stone-50'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
            )}
          >
            {swatches && <ColorSwatch color={option} className={active ? 'border-white/60' : undefined} />}
            {option}
            {active && <Check className="h-3.5 w-3.5" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}
