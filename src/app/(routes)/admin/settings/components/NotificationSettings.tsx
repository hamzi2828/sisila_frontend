'use client';

import { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button, Switch } from '@/components/admin/ui';
import { type SettingsData } from '../services/settingsService';
import { PanelFooter, PanelHeader, PanelSection } from './SettingsPanel';

interface NotificationSettingsProps {
  settings: SettingsData;
  onUpdate: (data: Partial<SettingsData>) => Promise<boolean>;
  isLoading?: boolean;
}

const fromSettings = (settings?: SettingsData) => ({
  emailNotifications: settings?.emailNotifications ?? true,
  marketingEmails: settings?.marketingEmails ?? false,
  securityAlerts: settings?.securityAlerts ?? true,
});

type NotificationField = keyof ReturnType<typeof fromSettings>;

const OPTIONS: { field: NotificationField; label: string; description: string }[] = [
  { field: 'emailNotifications', label: 'Email Notifications', description: 'Receive general notifications via email' },
  { field: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional and marketing emails' },
  { field: 'securityAlerts', label: 'Security Alerts', description: 'Receive important security notifications' },
];

export default function NotificationSettings({ settings, onUpdate, isLoading }: NotificationSettingsProps) {
  const [formData, setFormData] = useState(() => fromSettings(settings));

  // Keep the form in sync after a save or a reset to defaults.
  useEffect(() => {
    setFormData(fromSettings(settings));
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  const handleToggle = (field: NotificationField, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const dirty = JSON.stringify(formData) !== JSON.stringify(fromSettings(settings));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PanelSection>
        <PanelHeader icon={Bell} title="Notification Settings" description="Manage your notification preferences and alerts" />
        <div className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white">
          {OPTIONS.map((option) => (
            <Switch
              key={option.field}
              id={option.field}
              checked={formData[option.field]}
              onChange={(checked) => handleToggle(option.field, checked)}
              label={option.label}
              description={option.description}
              className="px-4 py-4 transition-colors hover:bg-stone-50/60"
            />
          ))}
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
