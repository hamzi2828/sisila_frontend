'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Shield } from 'lucide-react';
import { Alert, Button, Switch } from '@/components/admin/ui';
import { type SettingsData } from '../services/settingsService';
import { PanelFooter, PanelHeader, PanelSection } from './SettingsPanel';

interface SecuritySettingsProps {
  settings: SettingsData;
  onUpdate: (data: Partial<SettingsData>) => Promise<boolean>;
  isLoading?: boolean;
}

export default function SecuritySettings({ settings, onUpdate, isLoading }: SecuritySettingsProps) {
  const [formData, setFormData] = useState({
    twoFactorAuth: settings?.twoFactorAuth ?? false,
  });

  // Keep the form in sync after a save or a reset to defaults.
  useEffect(() => {
    setFormData({ twoFactorAuth: settings?.twoFactorAuth ?? false });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  const handleToggle = (field: 'twoFactorAuth', value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const dirty = formData.twoFactorAuth !== (settings?.twoFactorAuth ?? false);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PanelSection>
        <PanelHeader icon={Shield} title="Security Settings" description="Manage your account security and authentication preferences" />
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <Switch
              id="twoFactorAuth"
              checked={formData.twoFactorAuth}
              onChange={(checked) => handleToggle('twoFactorAuth', checked)}
              label={
                <span className="inline-flex items-center gap-2">
                  Two-Factor Authentication
                  <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />
                </span>
              }
              description="Add an extra layer of security to your account with 2FA"
              className="px-4 py-4"
            />
          </div>

          {formData.twoFactorAuth && (
            <Alert tone="info" title="Two-Factor Authentication Enabled">
              Your account is now protected with 2FA. You&apos;ll need to enter a verification code from your authenticator app
              when signing in.
            </Alert>
          )}
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
