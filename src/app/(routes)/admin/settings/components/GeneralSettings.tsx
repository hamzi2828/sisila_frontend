'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Check, Clock, Globe, Store } from 'lucide-react';
import { Button, FormField, Input } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { type SettingsData } from '../services/settingsService';
import { PanelFooter, PanelHeader, PanelSection } from './SettingsPanel';

interface GeneralSettingsProps {
  settings: SettingsData;
  onUpdate: (data: Partial<SettingsData>) => Promise<boolean>;
  isLoading?: boolean;
}

// Values accepted by the backend (models/settings.js enum).
const DATE_FORMATS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] as const;

const pad = (n: number) => String(n).padStart(2, '0');

function formatExample(format: string, date: Date) {
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = String(date.getFullYear());
  if (format === 'DD/MM/YYYY') return `${d}/${m}/${y}`;
  if (format === 'YYYY-MM-DD') return `${y}-${m}-${d}`;
  return `${m}/${d}/${y}`;
}

const fromSettings = (settings?: SettingsData) => ({
  siteName: settings?.siteName || 'Silsila',
  siteUrl: settings?.siteUrl || 'https://www.silsilla.pk',
  timezone: settings?.timezone || 'UTC+05:00',
  dateFormat: settings?.dateFormat || 'MM/DD/YYYY',
});

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function GeneralSettings({ settings, onUpdate, isLoading }: GeneralSettingsProps) {
  const [formData, setFormData] = useState(() => fromSettings(settings));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [today, setToday] = useState<Date | null>(null);

  // Keep the form in sync after a save or a reset to defaults.
  useEffect(() => {
    setFormData(fromSettings(settings));
    setErrors({});
  }, [settings]);

  // Set on the client only, to avoid a server/client date mismatch.
  useEffect(() => {
    setToday(new Date());
  }, []);

  const handleChange = (field: keyof ReturnType<typeof fromSettings>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!formData.siteName.trim()) next.siteName = 'Site name is required';
    if (!formData.siteUrl.trim()) next.siteUrl = 'Site URL is required';
    else if (!isValidUrl(formData.siteUrl.trim())) next.siteUrl = 'Enter a full URL, e.g. https://www.silsilla.pk';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    await onUpdate(formData);
  };

  const dirty = JSON.stringify(formData) !== JSON.stringify(fromSettings(settings));

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <PanelSection>
        <PanelHeader icon={Store} title="Site Information" description="Manage your site's basic information and preferences" />
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <FormField label="Site Name" htmlFor="siteName" required error={errors.siteName}>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              placeholder="Enter site name"
              invalid={!!errors.siteName}
            />
          </FormField>

          <FormField label="Site URL" htmlFor="siteUrl" required error={errors.siteUrl}>
            <Input
              id="siteUrl"
              type="url"
              inputMode="url"
              value={formData.siteUrl}
              onChange={(e) => handleChange('siteUrl', e.target.value)}
              placeholder="https://your-site.com"
              invalid={!!errors.siteUrl}
              prefix={<Globe className="h-4 w-4 text-stone-400" />}
            />
          </FormField>
        </div>
      </PanelSection>

      <PanelSection>
        <PanelHeader icon={CalendarDays} title="Date & Time" description="Regional date and time preferences" />
        <div className="space-y-5">
          <FormField label="Timezone" htmlFor="timezone" hint="UTC offset, e.g. UTC+05:00" className="max-w-xs">
            <Input
              id="timezone"
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              placeholder="UTC+05:00"
              prefix={<Clock className="h-4 w-4 text-stone-400" />}
            />
          </FormField>

          <div>
            <p id="dateFormat-label" className="mb-2 text-sm font-medium text-stone-700">
              Date Format
            </p>
            <div role="radiogroup" aria-labelledby="dateFormat-label" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {DATE_FORMATS.map((format) => {
                const selected = formData.dateFormat === format;
                return (
                  <button
                    key={format}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleChange('dateFormat', format)}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30',
                      selected ? 'border-stone-900 bg-stone-50 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50/60'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                        selected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'
                      )}
                    >
                      <CalendarDays className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-sm font-medium text-stone-900">{format}</span>
                      <span className="block text-xs text-stone-500">{today ? formatExample(format, today) : ' '}</span>
                    </span>
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PanelSection>

      <PanelFooter>
        {dirty && <p className="text-xs text-stone-500 sm:mr-auto">You have unsaved changes</p>}
        <Button type="submit" loading={isLoading} loadingText="Saving..." leftIcon={<Check className="h-4 w-4" />}>
          Save Changes
        </Button>
      </PanelFooter>
    </form>
  );
}
