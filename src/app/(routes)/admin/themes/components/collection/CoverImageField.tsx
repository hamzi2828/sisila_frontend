'use client';

import { FormField, Input } from '@/components/admin/ui';
import { ImageThumb } from './ImageThumb';

interface CoverImageFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

/** Cover image URL input with a 16:9 live preview. */
export function CoverImageField({ id = 'cover', value, onChange, error, label = 'Cover image URL' }: CoverImageFieldProps) {
  return (
    <div className="space-y-3" data-field-error={error ? 'true' : undefined}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
        <ImageThumb src={value} alt="Cover preview" className="h-full w-full" showLabel />
      </div>
      <FormField label={label} htmlFor={id} required error={error} hint="Paste the full URL of a hosted image.">
        <Input
          id={id}
          type="text"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          invalid={!!error}
          className="font-mono text-xs sm:text-sm"
          spellCheck={false}
          autoComplete="off"
        />
      </FormField>
    </div>
  );
}
