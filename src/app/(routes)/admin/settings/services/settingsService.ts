const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
import { getAuthHeader } from "@/helper/helper";
interface SettingsData {
  siteName: string;
  siteUrl: string;
  logoUrl: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  twoFactorAuth: boolean;
  isActive: boolean;
  version: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

/**
 * Builds an Error carrying the backend's own message (e.g. "Invalid file type. Please upload
 * PNG, JPG, GIF, or WebP images only.") so the UI can show it instead of a generic failure.
 */
async function toApiError(response: Response, fallback: string): Promise<Error> {
  if (response.status === 413) {
    return new Error('The file is too large for the server (limit is about 4.5 MB). Please use a smaller image.');
  }

  let message = '';
  try {
    const body = await response.clone().json();
    const main = typeof body?.message === 'string' ? body.message.trim() : '';
    const detail = typeof body?.error === 'string' ? body.error.trim() : '';
    // Append the technical detail only when the main message is a generic "Failed to ..." line.
    const generic = /^(failed to|validation error|internal server error)/i.test(main);
    message = main ? (generic && detail && detail !== main ? `${main}: ${detail}` : main) : detail;
  } catch {
    try {
      const text = (await response.text()).trim();
      if (text && text.length < 300 && !text.startsWith('<')) message = text;
    } catch {
      // ignore unreadable bodies
    }
  }

  return new Error(message || `${fallback} (HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''})`);
}

/** fetch() rejects with a TypeError when the server can't be reached (or a proxy dropped the request). */
function toNetworkError(error: unknown, uploading = false): Error {
  if (error instanceof TypeError) {
    return new Error(
      uploading
        ? 'Could not reach the server. If you were uploading an image, it may be too large — try a smaller file.'
        : 'Could not reach the server. Check your connection and try again.'
    );
  }
  return error instanceof Error ? error : new Error(String(error));
}

class SettingsService {
  async getSettings(): Promise<SettingsData> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw await toApiError(response, 'Failed to fetch settings');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw toNetworkError(error);
    }
  }

  async updateSettings(updateData: Partial<SettingsData>): Promise<SettingsData> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw await toApiError(response, 'Failed to update settings');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw toNetworkError(error);
    }
  }

  async uploadLogo(file: File): Promise<{ logoUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch(`${API_BASE_URL}/settings/logo`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      });

      if (!response.ok) {
        throw await toApiError(response, 'Failed to upload logo');
      }

      // Backend responds with { success, message, data: { logoUrl, settings } }
      const data = await response.json();
      const logoUrl: string | undefined = data?.data?.logoUrl ?? data?.logoUrl;
      if (!logoUrl) {
        throw new Error('The server did not return the uploaded logo URL');
      }
      return { logoUrl };
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw toNetworkError(error, true);
    }
  }

  /** Resets the logo to the backend default; returns the updated settings when provided. */
  async removeLogo(): Promise<SettingsData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/logo`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw await toApiError(response, 'Failed to remove logo');
      }

      const data = await response.json().catch(() => null);
      return data?.data ?? null;
    } catch (error) {
      console.error('Error removing logo:', error);
      throw toNetworkError(error);
    }
  }

  async resetSettings(): Promise<SettingsData> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/reset`, {
        method: 'POST',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw await toApiError(response, 'Failed to reset settings');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw toNetworkError(error);
    }
  }
}

// Export a singleton instance
export const settingsService = new SettingsService();
export type { SettingsData };
