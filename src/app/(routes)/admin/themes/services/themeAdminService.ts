import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface GalleryImage {
  _id?: string;
  title: string;
  image: string;
  href?: string;
}

export interface Theme {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  accent?: string;
  gallery: GalleryImage[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeInput {
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  accent?: string;
  gallery: GalleryImage[];
  isActive?: boolean;
  order?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const themeAdminService = {
  /**
   * Get all themes (admin only)
   */
  async getAllThemes(): Promise<Theme[]> {
    try {
      const response = await axios.get<ApiResponse<Theme[]>>(`${API_BASE_URL}/themes`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch themes');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching all themes:', error);
      throw error;
    }
  },

  /**
   * Get single theme by ID
   */
  async getThemeById(id: string): Promise<Theme> {
    try {
      const response = await axios.get<ApiResponse<Theme>>(`${API_BASE_URL}/themes/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch theme');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching theme ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new theme
   */
  async createTheme(data: ThemeInput): Promise<Theme> {
    try {
      const response = await axios.post<ApiResponse<Theme>>(
        `${API_BASE_URL}/themes`,
        data,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create theme');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error creating theme:', error);
      throw error;
    }
  },

  /**
   * Update theme
   */
  async updateTheme(id: string, data: Partial<ThemeInput>): Promise<Theme> {
    try {
      const response = await axios.put<ApiResponse<Theme>>(
        `${API_BASE_URL}/themes/${id}`,
        data,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update theme');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating theme ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle theme active status
   */
  async toggleThemeStatus(id: string, isActive: boolean): Promise<Theme> {
    try {
      const response = await axios.patch<ApiResponse<Theme>>(
        `${API_BASE_URL}/themes/${id}/status`,
        { isActive },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update theme status');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating theme status ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update theme order
   */
  async updateThemeOrder(id: string, order: number): Promise<Theme> {
    try {
      const response = await axios.patch<ApiResponse<Theme>>(
        `${API_BASE_URL}/themes/${id}/order`,
        { order },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update theme order');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating theme order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete theme
   */
  async deleteTheme(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete<ApiResponse<null>>(`${API_BASE_URL}/themes/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete theme');
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Error deleting theme ${id}:`, error);
      throw error;
    }
  },
};

export default themeAdminService;
