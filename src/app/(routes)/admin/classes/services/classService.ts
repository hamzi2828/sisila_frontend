import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  instructor?: string;
  instructorName?: string;
}

export interface GymClass {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  videoUrl?: string;
  videoPoster?: string;
  gallery: string[];
  schedule: ScheduleItem[];
  duration?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  capacity: number;
  features: string[];
  requirements: string[];
  category: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  enrolledCount: number;
  rating: number;
  reviewsCount: number;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassInput {
  name: string;
  description: string;
  shortDescription?: string;
  videoUrl?: string;
  videoPoster?: string;
  schedule?: ScheduleItem[];
  duration?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  capacity?: number;
  features?: string[];
  requirements?: string[];
  category?: string;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  price?: number;
  currency?: string;
}

class ClassService {
  async getAllClasses(page: number = 1, limit: number = 20): Promise<{
    classes: GymClass[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gym-classes`, {
        params: { page, limit },
        headers: getAuthHeader(),
      });

      return {
        classes: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  async getClassById(id: string): Promise<GymClass> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gym-classes/${id}`, {
        headers: getAuthHeader(),
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching class:', error);
      throw error;
    }
  }

  async createClass(formData: FormData): Promise<GymClass> {
    try {
      const response = await axios.post(`${API_BASE_URL}/gym-classes`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error creating class:', error);
      throw new Error(error.response?.data?.message || 'Failed to create class');
    }
  }

  async updateClass(id: string, formData: FormData): Promise<GymClass> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gym-classes/${id}`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error updating class:', error);
      throw new Error(error.response?.data?.message || 'Failed to update class');
    }
  }

  async deleteClass(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/gym-classes/${id}`, {
        headers: getAuthHeader(),
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  async toggleClassStatus(id: string, isActive: boolean): Promise<GymClass> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/gym-classes/${id}/status`,
        { isActive },
        {
          headers: getAuthHeader(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error updating class status:', error);
      throw error;
    }
  }

  async toggleClassFeatured(id: string, isFeatured: boolean): Promise<GymClass> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/gym-classes/${id}/featured`,
        { isFeatured },
        {
          headers: getAuthHeader(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error updating class featured status:', error);
      throw error;
    }
  }
}

export const classService = new ClassService();
