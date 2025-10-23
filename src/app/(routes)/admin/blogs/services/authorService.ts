// authorService.ts
import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

// Types for the backend response
interface BackendAuthor {
  _id: string;
  name: string;
  slug: string;
  email: string;
  bio?: string;
  avatar?: string;
  active: boolean;
  blogCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Frontend types
export interface Author {
  id: string;
  name: string;
  slug: string;
  email: string;
  bio?: string;
  avatar?: string;
  active: boolean;
  blogCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthorInput {
  name: string;
  email: string;
  bio?: string;
  active?: boolean;
}

// Author Service interface
export interface AuthorService {
  getAllAuthors(params?: {
    page?: number;
    limit?: number;
    search?: string;
    active?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    authors: Author[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>;
  getAuthorById(id: string): Promise<Author>;
  getAuthorsForDropdown(): Promise<Author[]>;
  createAuthor(authorData: AuthorInput | FormData): Promise<Author>;
  updateAuthor(id: string, authorData: AuthorInput | FormData): Promise<Author>;
  toggleAuthorActive(id: string): Promise<Author>;
  deleteAuthor(id: string): Promise<{ success: boolean; message: string }>;
}

// API Response type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Transform backend author to frontend format
 */
const transformAuthor = (backendAuthor: BackendAuthor): Author => ({
  id: backendAuthor._id,
  name: backendAuthor.name,
  slug: backendAuthor.slug,
  email: backendAuthor.email,
  bio: backendAuthor.bio,
  avatar: backendAuthor.avatar,
  active: backendAuthor.active,
  blogCount: backendAuthor.blogCount,
  createdAt: backendAuthor.createdAt,
  updatedAt: backendAuthor.updatedAt
});

/**
 * Service for managing authors
 */
const authorService: AuthorService = {
  /**
   * Get all authors with pagination and filtering
   */
  getAllAuthors: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const response = await axios.get<ApiResponse<BackendAuthor[]>>(`${API_URL}/authors?${queryParams.toString()}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch authors');
      }
      
      return {
        authors: response.data.data.map(transformAuthor),
        pagination: response.data.pagination!
      };
    } catch (error) {
      console.error('Error fetching authors:', error);
      throw error;
    }
  },

  /**
   * Get a single author by ID
   */
  getAuthorById: async (id: string): Promise<Author> => {
    try {
      const response = await axios.get<ApiResponse<BackendAuthor>>(`${API_URL}/authors/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch author');
      }
      
      return transformAuthor(response.data.data);
    } catch (error) {
      console.error(`Error fetching author ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get authors for dropdown (active only)
   */
  getAuthorsForDropdown: async (): Promise<Author[]> => {
    try {
      const response = await axios.get<ApiResponse<BackendAuthor[]>>(`${API_URL}/authors/dropdown`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch authors for dropdown');
      }
      
      return response.data.data.map(transformAuthor);
    } catch (error) {
      console.error('Error fetching authors for dropdown:', error);
      throw error;
    }
  },

  /**
   * Create a new author
   */
  createAuthor: async (authorData: AuthorInput | FormData): Promise<Author> => {
    try {
      const isFormData = authorData instanceof FormData;
      const headers = isFormData 
        ? { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
        : getAuthHeader();
      
      const response = await axios.post<ApiResponse<BackendAuthor>>(
        `${API_URL}/authors`,
        authorData,
        { headers }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create author');
      }
      
      return transformAuthor(response.data.data);
    } catch (error) {
      console.error('Error creating author:', error);
      throw error;
    }
  },

  /**
   * Update an existing author
   */
  updateAuthor: async (id: string, authorData: AuthorInput | FormData): Promise<Author> => {
    try {
      const isFormData = authorData instanceof FormData;
      const headers = isFormData 
        ? { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
        : getAuthHeader();
      
      const response = await axios.put<ApiResponse<BackendAuthor>>(
        `${API_URL}/authors/${id}`,
        authorData,
        { headers }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update author');
      }
      
      return transformAuthor(response.data.data);
    } catch (error) {
      console.error(`Error updating author ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle author active status
   */
  toggleAuthorActive: async (id: string): Promise<Author> => {
    try {
      const response = await axios.patch<ApiResponse<BackendAuthor>>(
        `${API_URL}/authors/${id}/toggle-active`,
        {},
        { headers: getAuthHeader() }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to toggle author status');
      }
      
      return transformAuthor(response.data.data);
    } catch (error) {
      console.error(`Error toggling author ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an author
   */
  deleteAuthor: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.delete<ApiResponse<null>>(`${API_URL}/authors/${id}`, {
        headers: getAuthHeader()
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete author');
      }
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Error deleting author ${id}:`, error);
      throw error;
    }
  }
};

export default authorService;