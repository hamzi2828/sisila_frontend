import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface GalleryImage {
  _id: string;
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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const themeService = {
  /**
   * Get all active themes (public endpoint)
   */
  async getActiveThemes(): Promise<Theme[]> {
    try {
      const response = await axios.get<ApiResponse<Theme[]>>(`${API_BASE_URL}/themes/active`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch themes');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching active themes:', error);
      throw error;
    }
  }
};

export default themeService;
