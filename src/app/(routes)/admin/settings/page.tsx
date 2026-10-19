'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Settings, Bell, Shield, Image as ImageIcon, Link2, RotateCcw } from 'lucide-react';
import { AdminPage, Alert, Button, Card, ConfirmDialog, LoadingState, PageHeader, Tabs, type TabItem } from '@/components/admin/ui';
import { compressImage } from '@/lib/compressImage';

import GeneralSettings from './components/GeneralSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import LogoUpload from './components/LogoUpload';
import SocialLinks from './components/SocialLinks';
import { settingsService, SettingsData } from './services/settingsService';

type SettingsTab = 'general' | 'logo' | 'social' | 'notifications' | 'security';

const TABS: TabItem<SettingsTab>[] = [
  { key: 'general', label: 'General', icon: Settings },
  { key: 'logo', label: 'Logo', icon: ImageIcon },
  { key: 'social', label: 'Social Links', icon: Link2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
];

const isSettingsTab = (value: string | null): value is SettingsTab => TABS.some((t) => t.key === value);

const errorMessage = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [confirmReset, setConfirmReset] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setIsFetching(true);
      setLoadError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      const message = errorMessage(error, 'Failed to load settings');
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Deep-linkable tabs (?tab=logo) without useSearchParams (keeps the page free of Suspense requirements).
  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (isSettingsTab(tab)) setActiveTab(tab);
  }, []);

  const changeTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState(window.history.state, '', url.toString());
  };

  const updateSettings = async (updateData: Partial<SettingsData>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const data = await settingsService.updateSettings(updateData);
      setSettings(data);
      toast.success('Settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(errorMessage(error, 'Failed to update settings'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadLogo = async (file: File): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Resize / re-encode in the browser so the request stays well under Vercel's 4.5 MB body limit.
      const optimised = await compressImage(file, { maxDimension: 1200 });
      const data = await settingsService.uploadLogo(optimised);
      setSettings((prev) => (prev ? { ...prev, logoUrl: data.logoUrl } : prev));
      toast.success('Logo uploaded successfully');
      return true;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error(errorMessage(error, 'Failed to upload logo'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeLogo = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const updated = await settingsService.removeLogo();
      setSettings((prev) => (prev ? { ...prev, logoUrl: updated?.logoUrl ?? '' } : prev));
      toast.success('Logo removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error(errorMessage(error, 'Failed to remove logo'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsService.resetSettings();
      setSettings(data);
      setConfirmReset(false);
      toast.success('Settings reset to defaults');
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error(errorMessage(error, 'Failed to reset settings'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminPage className="max-w-5xl">
      <PageHeader
        title="Settings"
        subtitle="Manage your application settings and preferences"
        actions={
          <Button
            variant="secondary"
            onClick={() => setConfirmReset(true)}
            disabled={!settings || isLoading}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            <span className="hidden sm:inline">Reset to Defaults</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        }
      />

      {!settings ? (
        isFetching ? (
          <LoadingState card label="Loading settings..." />
        ) : (
          <Alert tone="error" title="Couldn't load settings" onRetry={fetchSettings}>
            {loadError || 'Something went wrong while loading settings.'}
          </Alert>
        )
      ) : (
        <Card padding="none" className="overflow-hidden">
          <Tabs tabs={TABS} value={activeTab} onChange={changeTab} />

          <div className="p-4 sm:p-6">
            {activeTab === 'general' && <GeneralSettings settings={settings} onUpdate={updateSettings} isLoading={isLoading} />}

            {activeTab === 'logo' && (
              <LogoUpload currentLogo={settings.logoUrl} onUpload={uploadLogo} onRemove={removeLogo} isLoading={isLoading} />
            )}

            {activeTab === 'social' && <SocialLinks settings={settings} onUpdate={updateSettings} isLoading={isLoading} />}

            {activeTab === 'notifications' && (
              <NotificationSettings settings={settings} onUpdate={updateSettings} isLoading={isLoading} />
            )}

            {activeTab === 'security' && <SecuritySettings settings={settings} onUpdate={updateSettings} isLoading={isLoading} />}
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Reset all settings?"
        message="All settings will be restored to their defaults, including the site details, logo and social links. This action cannot be undone."
        confirmLabel="Reset settings"
        loading={isLoading}
        onCancel={() => setConfirmReset(false)}
        onConfirm={resetSettings}
      />
    </AdminPage>
  );
}
