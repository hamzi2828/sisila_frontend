'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Check, ExternalLink, Facebook, Instagram, Link2, Youtube } from 'lucide-react';
import { Button, Input } from '@/components/admin/ui';
import { SettingsData } from '../services/settingsService';
import { PanelFooter, PanelHeader, PanelSection } from './SettingsPanel';

interface SocialLinksProps {
  settings: SettingsData;
  onUpdate: (data: Partial<SettingsData>) => Promise<boolean>;
  isLoading: boolean;
}

interface SocialLinksData {
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
}

const fromSettings = (settings?: SettingsData): SocialLinksData => ({
  youtubeUrl: settings?.youtubeUrl || '',
  facebookUrl: settings?.facebookUrl || '',
  instagramUrl: settings?.instagramUrl || '',
});

const PLATFORMS: { id: keyof SocialLinksData; label: string; icon: typeof Youtube; placeholder: string }[] = [
  { id: 'youtubeUrl', label: 'YouTube Channel', icon: Youtube, placeholder: 'https://youtube.com/@yourchannel' },
  { id: 'facebookUrl', label: 'Facebook Page', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
  { id: 'instagramUrl', label: 'Instagram Profile', icon: Instagram, placeholder: 'https://instagram.com/youraccount' },
];

const validateUrl = (url: string) => {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function SocialLinks({ settings, onUpdate, isLoading }: SocialLinksProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>(() => fromSettings(settings));
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setSocialLinks(fromSettings(settings));
      setHasChanges(false);
    }
  }, [settings]);

  const handleInputChange = (field: keyof SocialLinksData, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const ok = await onUpdate(socialLinks);
    if (ok) setHasChanges(false);
  };

  const handleReset = () => {
    setSocialLinks(fromSettings(settings));
    setHasChanges(false);
  };

  const allValid = PLATFORMS.every((p) => validateUrl(socialLinks[p.id]));
  const configured = PLATFORMS.filter((p) => socialLinks[p.id] && validateUrl(socialLinks[p.id]));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (hasChanges && allValid) handleSave();
      }}
      noValidate
      className="space-y-6"
    >
      <PanelSection>
        <PanelHeader icon={Link2} title="Social Media Links" description="Add your social media profiles to display on your website" />

        <div className="space-y-4">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const value = socialLinks[platform.id];
            const invalid = !!value && !validateUrl(value);
            return (
              <div key={platform.id}>
                <label htmlFor={platform.id} className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                  <span className="rounded-md bg-stone-100 p-1">
                    <Icon className="h-4 w-4 text-stone-700" />
                  </span>
                  {platform.label}
                </label>
                <Input
                  id={platform.id}
                  type="url"
                  inputMode="url"
                  placeholder={platform.placeholder}
                  value={value}
                  onChange={(e) => handleInputChange(platform.id, e.target.value)}
                  invalid={invalid}
                  suffix={invalid ? <AlertCircle className="h-5 w-5 text-red-500" /> : undefined}
                />
                {invalid && <p className="mt-1 text-xs text-red-600">Please enter a valid URL (starting with https://)</p>}
              </div>
            );
          })}
        </div>
      </PanelSection>

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
        <h4 className="mb-3 text-sm font-medium text-stone-900">Preview</h4>
        {configured.length > 0 ? (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {configured.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.id}
                  href={socialLinks[platform.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 transition-colors hover:border-stone-300 hover:text-stone-900"
                >
                  <Icon className="h-4 w-4" />
                  {platform.label.split(' ')[0]}
                  <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-stone-500">No social links configured</p>
        )}
      </div>

      {hasChanges && (
        <PanelFooter className="sm:justify-between">
          <Button variant="secondary" onClick={handleReset} disabled={isLoading}>
            Discard Changes
          </Button>
          <Button type="submit" loading={isLoading} loadingText="Saving..." disabled={!allValid} leftIcon={<Check className="h-4 w-4" />}>
            Save Changes
          </Button>
        </PanelFooter>
      )}
    </form>
  );
}
