import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface ThemeDTO {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  isActive: boolean;
  order: number;
}

export interface SeriesDTO {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  isActive: boolean;
  order: number;
}

export interface CollectionItem {
  _id: string;
  id: string;
  title: string;
}

export const collectionService = {
  /**
   * Fetch all active themes
   */
  async getActiveThemes(): Promise<CollectionItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/themes/active`);
      const data = response.data?.data ?? response.data ?? [];

      if (Array.isArray(data)) {
        return data.map((theme: ThemeDTO) => ({
          _id: theme._id,
          id: theme.id,
          title: theme.title,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching themes:', error);
      return [];
    }
  },

  /**
   * Fetch all active series
   */
  async getActiveSeries(): Promise<CollectionItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/series/active`);
      const data = response.data?.data ?? response.data ?? [];

      if (Array.isArray(data)) {
        return data.map((series: SeriesDTO) => ({
          _id: series._id,
          id: series.id,
          title: series.title,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching series:', error);
      return [];
    }
  },

  /**
   * Fetch all themes (admin - requires auth)
   */
  async getAllThemes(): Promise<CollectionItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/themes`, {
        headers: getAuthHeader(),
      });
      const data = response.data?.data ?? response.data ?? [];

      if (Array.isArray(data)) {
        return data.map((theme: ThemeDTO) => ({
          _id: theme._id,
          id: theme.id,
          title: theme.title,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching all themes:', error);
      return [];
    }
  },

  /**
   * Fetch all series (admin - requires auth)
   */
  async getAllSeries(): Promise<CollectionItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/series`, {
        headers: getAuthHeader(),
      });
      const data = response.data?.data ?? response.data ?? [];

      if (Array.isArray(data)) {
        return data.map((series: SeriesDTO) => ({
          _id: series._id,
          id: series.id,
          title: series.title,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching all series:', error);
      return [];
    }
  },
};
