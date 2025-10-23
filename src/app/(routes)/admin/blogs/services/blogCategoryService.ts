// blogCategoryService.ts
import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

// Types for the backend response
interface BackendBlogCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  featured?: boolean;
  platform?: 'gymwear' | 'gymfolio';
  count?: number; // Added count property
  thumbnailUrl?: string;
  bannerUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Frontend types
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  featured?: boolean;
  platform?: 'gymwear' | 'gymfolio';
  thumbnailUrl?: string;
  bannerUrl?: string;
}

export interface BlogCategoryInput {
  name: string;
  slug?: string;
  description: string;
  active: boolean;
  platform?: 'gymwear' | 'gymfolio';
  thumbnail?: File;
  banner?: File;
}

export interface BlogCategoryWithCount extends BlogCategory {
  count: number;
}

// Blog Category Service interface
export interface BlogCategoryService {
  getAllCategories(): Promise<BlogCategory[]>;
  getCategoriesWithCount(): Promise<BlogCategoryWithCount[]>;
  getCategoryById(id: string): Promise<BlogCategory>;
  createCategory(category: BlogCategoryInput): Promise<BlogCategory>;
  updateCategory(id: string, category: BlogCategoryInput): Promise<BlogCategory>;
  deleteCategory(id: string): Promise<{ success: boolean; message: string }>;
  toggleCategoryActive(id: string): Promise<BlogCategory>;
  toggleCategoryFeatured(id: string): Promise<BlogCategory>;
  slugify(text: string): string;
}

// API Response type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get auth headers

/**
 * Service for managing blog categories
 */
const blogCategoryService: BlogCategoryService = {
  /**
   * Get all blog categories
   * @returns Promise with array of blog categories
   */
  getAllCategories: async (): Promise<BlogCategory[]> => {
    try {
      const response = await axios.get<{data: BackendBlogCategory[]}>(`${API_URL}/blog-categories`);
      // Map backend _id to frontend id
      return response.data.data.map(category => ({
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        active: category.active,
        platform: category.platform || 'gymwear'
      }));
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  },

  /**
   * Get blog categories with post counts
   * @returns Promise with array of blog categories with counts
   */
  getCategoriesWithCount: async (): Promise<BlogCategoryWithCount[]> => {
    try {
      const response = await axios.get<{data: BackendBlogCategory[]}>(
        `${API_URL}/blog-categories/with-count`
      );
      
      // Transform backend data to frontend format
      return response.data.data.map(category => ({
        id: category._id, // Map _id to id
        name: category.name,
        slug: category.slug,
        description: category.description,
        active: category.active,
        featured: category.featured || false,
        platform: category.platform || 'gymwear',
        thumbnailUrl: category.thumbnailUrl,
        bannerUrl: category.bannerUrl,
        count: category.count || 0 // Ensure count is always a number
      }));
    } catch (error) {
      console.error('Error fetching blog categories with counts:', error);
      throw error;
    }
  },

  /**
   * Get a single blog category by ID
   * @param id Category ID
   * @returns Promise with blog category
   */
  getCategoryById: async (id: string): Promise<BlogCategory> => {
    try {
      const response = await axios.get<{data: BackendBlogCategory}>(`${API_URL}/blog-categories/${id}`);
      const category = response.data.data;
      return {
        id: category._id, // Map _id to id
        name: category.name,
        slug: category.slug,
        description: category.description,
        active: category.active
      };
    } catch (error) {
      console.error(`Error fetching blog category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new blog category
   * @param category Blog category data
   * @returns Promise with created blog category
   */
  createCategory: async (category: BlogCategoryInput): Promise<BlogCategory> => {
    try {
      const formData = new FormData();
      formData.append('name', category.name);
      formData.append('slug', category.slug || '');
      formData.append('description', category.description);
      formData.append('active', category.active.toString());
      formData.append('platform', category.platform || 'gymwear');

      if (category.thumbnail) {
        formData.append('thumbnail', category.thumbnail);
      }
      if (category.banner) {
        formData.append('banner', category.banner);
      }

      const response = await axios.post(`${API_URL}/blog-categories`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating blog category:', error);
      throw error;
    }
  },

  /**
   * Update an existing blog category
   * @param id Category ID
   * @param category Updated blog category data
   * @returns Promise with updated blog category
   */
  updateCategory: async (id: string, category: BlogCategoryInput): Promise<BlogCategory> => {
    try {
      const formData = new FormData();
      formData.append('name', category.name);
      formData.append('slug', category.slug || '');
      formData.append('description', category.description);
      formData.append('active', category.active.toString());
      formData.append('platform', category.platform || 'gymwear');

      if (category.thumbnail) {
        formData.append('thumbnail', category.thumbnail);
      }
      if (category.banner) {
        formData.append('banner', category.banner);
      }

      const response = await axios.put(`${API_URL}/blog-categories/${id}`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error updating blog category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a blog category
   * @param id Category ID
   * @returns Promise with success message
   */
  deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.delete(`${API_URL}/blog-categories/${id}`, {
        headers: getAuthHeader()
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Error deleting blog category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle the active status of a blog category
   * @param id Category ID
   * @returns Promise with updated blog category
   */
  toggleCategoryActive: async (id: string): Promise<BlogCategory> => {
    try {
      console.log(`Toggling active status for category ${id}...`);
      
      // Get the current category to verify it exists and get its current active status
      const currentCategory = await blogCategoryService.getCategoryById(id);
      console.log('Current category:', currentCategory);
      
      // Toggle the active status
      const newActiveStatus = !currentCategory.active;
      console.log(`New active status will be: ${newActiveStatus}`);
      
      // Make the API call to update the category
      const response = await axios.patch<ApiResponse<BackendBlogCategory>>(
        `${API_URL}/blog-categories/${id}/toggle-active`,
        { active: newActiveStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          }
        }
      );
      
      console.log('Toggle active response:', response.data);
      
      if (!response.data.success) {
        console.error('Error in toggle active response:', response.data);
        throw new Error(response.data.message || 'Failed to toggle category active status');
      }
      
      // Transform the backend response to match our frontend type
      const updatedCategory = response.data.data;
      return {
        id: updatedCategory._id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        description: updatedCategory.description,
        active: updatedCategory.active,
        featured: updatedCategory.featured
      };

    } catch (error) {
      console.error('Error in toggleCategoryActive:', error);

      // If we have a response with an error message, use that
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || 'Failed to toggle category active status';
        console.error('Server error:', error.response.data);
        throw new Error(errorMessage);
      }

      // For other types of errors, rethrow with a generic message
      throw error instanceof Error ? error : new Error('An unexpected error occurred while toggling category status');
    }
  },

  /**
   * Toggle the featured status of a blog category
   * @param id Category ID
   * @returns Promise with updated blog category
   */
  toggleCategoryFeatured: async (id: string): Promise<BlogCategory> => {
    try {
      console.log(`Toggling featured status for category ${id}...`);

      const response = await axios.patch(
        `${API_URL}/blog-categories/${id}/toggle-featured`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          }
        }
      );

      console.log('Toggle featured response:', response.data);

      if (!response.data.success) {
        console.error('Error in toggle featured response:', response.data);
        throw new Error(response.data.message || 'Failed to toggle category featured status');
      }

      // Transform the backend response to match our frontend type
      const updatedCategory = response.data.data;
      return {
        id: updatedCategory._id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        description: updatedCategory.description,
        active: updatedCategory.active,
        featured: updatedCategory.featured
      };

    } catch (error) {
      console.error('Error in toggleCategoryFeatured:', error);

      // If we have a response with an error message, use that
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || 'Failed to toggle category featured status';
        console.error('Server error:', error.response.data);
        throw new Error(errorMessage);
      }

      // For other types of errors, rethrow with a generic message
      throw error instanceof Error ? error : new Error('An unexpected error occurred while toggling category featured status');
    }
  },

  /**
   * Helper function to slugify a string
   * @param text Text to slugify
   * @returns Slugified string
   */
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
};

export default blogCategoryService;
