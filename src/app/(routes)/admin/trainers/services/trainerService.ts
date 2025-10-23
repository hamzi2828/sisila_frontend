import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Trainer {
  _id: string;
  name: string;
  slug: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  specialties: string[];
  certifications: string[];
  experience?: number;
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
  availability?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  rating?: number;
  totalClasses?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerInput {
  name: string;
  role: string;
  bio?: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  certifications?: string[];
  experience?: number;
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
  availability?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
}

class TrainerService {
  async getAllTrainers(page: number = 1, limit: number = 20): Promise<{
    trainers: Trainer[];
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
      const response = await axios.get(`${API_BASE_URL}/trainers`, {
        params: { page, limit },
        headers: getAuthHeader(),
      });

      return {
        trainers: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Error fetching trainers:', error);
      throw error;
    }
  }

  async getTrainerById(id: string): Promise<Trainer> {
    try {
      const response = await axios.get(`${API_BASE_URL}/trainers/${id}`, {
        headers: getAuthHeader(),
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching trainer:', error);
      throw error;
    }
  }

  async createTrainer(formData: FormData): Promise<Trainer> {
    try {
      const response = await axios.post(`${API_BASE_URL}/trainers`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error creating trainer:', error);
      throw new Error(error.response?.data?.message || 'Failed to create trainer');
    }
  }

  async updateTrainer(id: string, formData: FormData): Promise<Trainer> {
    try {
      const response = await axios.put(`${API_BASE_URL}/trainers/${id}`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error updating trainer:', error);
      throw new Error(error.response?.data?.message || 'Failed to update trainer');
    }
  }

  async deleteTrainer(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/trainers/${id}`, {
        headers: getAuthHeader(),
      });
    } catch (error) {
      console.error('Error deleting trainer:', error);
      throw error;
    }
  }

  async toggleTrainerStatus(id: string, isActive: boolean): Promise<Trainer> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/trainers/${id}/status`,
        { isActive },
        {
          headers: getAuthHeader(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error updating trainer status:', error);
      throw error;
    }
  }

  async toggleTrainerFeatured(id: string, isFeatured: boolean): Promise<Trainer> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/trainers/${id}/featured`,
        { isFeatured },
        {
          headers: getAuthHeader(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error updating trainer featured status:', error);
      throw error;
    }
  }
}

export const trainerService = new TrainerService();
