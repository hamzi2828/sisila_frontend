import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Package {
  _id: string;
  name: string;
  price: string;
  currency: string;
  period: string;
  features: string[];
  theme?: 'light' | 'dark';
  badge?: string;
  supportingText?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageInput {
  name: string;
  price: string;
  currency: string;
  period: string;
  features: string[];
  theme?: 'light' | 'dark';
  badge?: string;
  supportingText?: string;
  isActive?: boolean;
  order?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const packageAdminService = {
  /**
   * Get all active packages
   */
  async getActivePackages(): Promise<Package[]> {
    try {
      const response = await axios.get<ApiResponse<Package[]>>(`${API_BASE_URL}/packages/active`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch packages');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching active packages:', error);
      throw error;
    }
  },

  /**
   * Get all packages (admin only)
   */
  async getAllPackages(): Promise<Package[]> {
    try {
      const response = await axios.get<ApiResponse<Package[]>>(`${API_BASE_URL}/packages`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch packages');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching all packages:', error);
      throw error;
    }
  },

  /**
   * Get single package by ID
   */
  async getPackageById(id: string): Promise<Package> {
    try {
      const response = await axios.get<ApiResponse<Package>>(`${API_BASE_URL}/packages/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch package');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching package ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new package
   */
  async createPackage(packageData: PackageInput): Promise<Package> {
    try {
      const response = await axios.post<ApiResponse<Package>>(
        `${API_BASE_URL}/packages`,
        packageData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create package');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  },

  /**
   * Update package
   */
  async updatePackage(id: string, packageData: Partial<PackageInput>): Promise<Package> {
    try {
      const response = await axios.put<ApiResponse<Package>>(
        `${API_BASE_URL}/packages/${id}`,
        packageData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update package');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating package ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle package active status
   */
  async togglePackageStatus(id: string, isActive: boolean): Promise<Package> {
    try {
      const response = await axios.patch<ApiResponse<Package>>(
        `${API_BASE_URL}/packages/${id}/status`,
        { isActive },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update package status');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating package status ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update package order
   */
  async updatePackageOrder(id: string, order: number): Promise<Package> {
    try {
      const response = await axios.patch<ApiResponse<Package>>(
        `${API_BASE_URL}/packages/${id}/order`,
        { order },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update package order');
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating package order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete package
   */
  async deletePackage(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete<ApiResponse<null>>(`${API_BASE_URL}/packages/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete package');
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Error deleting package ${id}:`, error);
      throw error;
    }
  },
};

export default packageAdminService;
