import axios from 'axios';

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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const seriesService = {
  /**
   * Get all active series (public endpoint)
   */
  async getActiveSeries(): Promise<Series[]> {
    try {
      const response = await axios.get<ApiResponse<Series[]>>(`${API_BASE_URL}/series/active`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch series');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching active series:', error);
      throw error;
    }
  }
};

export default seriesService;
