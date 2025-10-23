import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface GalleryImage {
  title: string;
  image: string;
  href?: string;
}

export interface Subitem {
  title: string;
  href?: string;
}

export interface Series {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  accent?: string;
  subitems: Subitem[];
  gallery: GalleryImage[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeriesInput {
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  accent?: string;
  subitems?: Subitem[];
  gallery: GalleryImage[];
  isActive?: boolean;
  order?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const seriesAdminService = {
  /**
   * Get all series (admin only)
   */
  async getAllSeries(): Promise<Series[]> {
    try {
      const response = await axios.get<ApiResponse<Series[]>>(`${API_BASE_URL}/series`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch series');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching all series:', error);
      throw error;
    }
  },

  /**
   * Get single series by ID
   */
  async getSeriesById(id: string): Promise<Series> {
    try {
      const response = await axios.get<ApiResponse<Series>>(`${API_BASE_URL}/series/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch series');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching series ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new series
   */
  async createSeries(data: SeriesInput): Promise<Series> {
    try {
      const response = await axios.post<ApiResponse<Series>>(
        `${API_BASE_URL}/series`,
        data,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create series');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error creating series:', error);
      throw error;
    }
  },

  /**
   * Update series
   */
  async updateSeries(id: string, data: Partial<SeriesInput>): Promise<Series> {
    try {
      const response = await axios.put<ApiResponse<Series>>(
        `${API_BASE_URL}/series/${id}`,
        data,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update series');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating series ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle series active status
   */
  async toggleSeriesStatus(id: string, isActive: boolean): Promise<Series> {
    try {
      const response = await axios.patch<ApiResponse<Series>>(
        `${API_BASE_URL}/series/${id}/status`,
        { isActive },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update series status');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating series status ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update series order
   */
  async updateSeriesOrder(id: string, order: number): Promise<Series> {
    try {
      const response = await axios.patch<ApiResponse<Series>>(
        `${API_BASE_URL}/series/${id}/order`,
        { order },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update series order');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating series order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete series
   */
  async deleteSeries(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete<ApiResponse<null>>(`${API_BASE_URL}/series/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete series');
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Error deleting series ${id}:`, error);
      throw error;
    }
  },
};

export default seriesAdminService;
