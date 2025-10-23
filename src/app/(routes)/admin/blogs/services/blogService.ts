// blogService.ts
import axios from 'axios';
import { getAuthHeader } from '@/helper/helper';

// Types for the backend response
interface BackendBlog {
  _id: string;
  title: string;
  content?: string;
  categoryId: string | {
    _id: string;
    name: string;
  };
  categoryName?: string;
  status: 'published' | 'draft';
  featured?: boolean;
  image: string;
  thumbnail?: string;
  slug: string;
  views?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  platform?: 'gymwear' | 'gymfolio';
  author?: {
    _id: string;
    name?: string;
  };
}

// Frontend types
export interface Blog {
  id: string;
  title: string;
  content?: string;
  category: string;
  categoryId: string;
  status: 'published' | 'draft';
  featured?: boolean;
  image: string;
  thumbnail?: string;
  slug: string;
  views?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  platform?: 'gymwear' | 'gymfolio';
  author: {
    _id: string;
    name?: string;
  };
}

export interface BlogInput {
  title: string;
  slug: string;
  content?: string;
  categoryId: string;
  status: 'published' | 'draft';
  image: string;
}

// Blog Service interface
export interface BlogService {
  getAllBlogs(page?: number, limit?: number): Promise<{ blogs: Blog[]; pagination: PaginationInfo }>;
  getBlogById(id: string): Promise<Blog>;
  createBlog(formData: FormData): Promise<Blog>;
  updateBlog(id: string, blogData: BlogInput | FormData): Promise<Blog>;
  deleteBlog(id: string): Promise<{ success: boolean; message: string }>;
  toggleFeatured(id: string, featured: boolean): Promise<Blog>;
  toggleStatus(id: string, status: 'published' | 'draft'): Promise<Blog>;
}

// API Response type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination type
interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}



const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Service for managing blogs
 */
const blogService: BlogService = {
  /**
   * Get all blogs with pagination
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @returns Promise with array of blogs and pagination info
   */
  getAllBlogs: async (page: number = 1, limit: number = 10): Promise<{ blogs: Blog[]; pagination: PaginationInfo }> => {
    try {
      const response = await axios.get(
        `${API_URL}/blogs?page=${page}&limit=${limit}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch blogs');
      }

      // Transform backend data to frontend format
      const blogs = response.data.data.map((blog: BackendBlog) => ({
        id: blog._id,
        title: blog.title,
        content: blog.content,
        category: blog.categoryName || (typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId.name : '') || '',
        categoryId: typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId._id : blog.categoryId || '',
        status: blog.status,
        featured: blog.featured || false,
        image: blog.image,
        thumbnail: blog.thumbnail,
        slug: blog.slug,
        views: blog.views,
        tags: blog.tags,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        platform: blog.platform || 'gymwear',
        author: {
          _id: blog.author?._id || '',
          name: blog.author?.name || ''
        }
      }));

      return {
        blogs,
        pagination: response.data.pagination || {
          total: blogs.length,
          page: 1,
          pages: 1,
          limit: limit,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  /**
   * Get a single blog by ID
   * @param id Blog ID
   * @returns Promise with blog
   */
  getBlogById: async (id: string): Promise<Blog> => {
    try {
      const response = await axios.get<ApiResponse<BackendBlog>>(`${API_URL}/blogs/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch blog');
      }

      const blog = response.data.data;
      console.log("fullBlog 1", blog);
      return {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        category: blog.categoryName || (typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId.name : '') || '',
        categoryId: typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId._id : blog.categoryId || '',
        status: blog.status,
        featured: blog.featured || false,
        image: blog.image,
        thumbnail: blog.thumbnail,
        slug: blog.slug,
        views: blog.views,
        tags: blog.tags,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        platform: blog.platform || 'gymwear',
        author: {
          _id: blog.author?._id || '',
          name: blog.author?.name || ''
        }
      };
    } catch (error) {
      console.error(`Error fetching blog ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new blog
   * @param formData Blog data with file
   * @returns Promise with created blog
   */
  createBlog: async (formData: FormData): Promise<Blog> => {
    try {
      const response = await axios.post<ApiResponse<BackendBlog>>(
        `${API_URL}/blogs`,
        formData,
        { headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' } }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create blog');
      }

      const blog = response.data.data;
      return {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        category: blog.categoryName || (typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId.name : '') || '',
        categoryId: typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId._id : blog.categoryId || '',
        status: blog.status,
        image: blog.image,
        thumbnail: blog.thumbnail,
        slug: blog.slug,
        views: blog.views,
        tags: blog.tags,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        author: {
          _id: blog.author?._id || '',
          name: blog.author?.name || ''
        }
      };
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  /**
   * Update an existing blog
   * @param id Blog ID
   * @param blogData Updated blog data (can be BlogInput or FormData)
   * @returns Promise with updated blog
   */
  updateBlog: async (id: string, blogData: BlogInput | FormData): Promise<Blog> => {
    try {
      const isFormData = blogData instanceof FormData;
      const headers = isFormData 
        ? { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
        : getAuthHeader();
      
      const response = await axios.put<ApiResponse<BackendBlog>>(`${API_URL}/blogs/${id}`, blogData, {
        headers
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update blog');
      }

      const updatedBlog = response.data.data;
      return {
        id: updatedBlog._id,
        title: updatedBlog.title,
        content: updatedBlog.content,
        category: updatedBlog.categoryName || (typeof updatedBlog.categoryId === 'object' && updatedBlog.categoryId ? updatedBlog.categoryId.name : '') || '',
        categoryId: typeof updatedBlog.categoryId === 'object' && updatedBlog.categoryId ? updatedBlog.categoryId._id : updatedBlog.categoryId || '',
        status: updatedBlog.status,
        image: updatedBlog.image,
        thumbnail: updatedBlog.thumbnail,
        slug: updatedBlog.slug,
        views: updatedBlog.views,
        tags: updatedBlog.tags,
        createdAt: updatedBlog.createdAt,
        updatedAt: updatedBlog.updatedAt,
        author: {
          _id: updatedBlog.author?._id || '',
          name: updatedBlog.author?.name || ''
        }
      };
    } catch (error) {
      console.error(`Error updating blog ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a blog
   * @param id Blog ID
   * @returns Promise with success message
   */
  deleteBlog: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.delete<ApiResponse<null>>(`${API_URL}/blogs/${id}`, {
        headers: getAuthHeader()
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete blog');
      }
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Error deleting blog ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle featured status of a blog
   * @param id Blog ID
   * @param featured New featured status
   * @returns Promise with updated blog
   */
  toggleFeatured: async (id: string, featured: boolean): Promise<Blog> => {
    try {
      const response = await axios.patch<ApiResponse<BackendBlog>>(
        `${API_URL}/blogs/${id}/featured`,
        { featured },
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update blog featured status');
      }

      const blog = response.data.data;
      return {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        category: blog.categoryName || (typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId.name : '') || '',
        categoryId: typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId._id : blog.categoryId || '',
        status: blog.status,
        featured: blog.featured || false,
        image: blog.image,
        thumbnail: blog.thumbnail,
        slug: blog.slug,
        views: blog.views,
        tags: blog.tags,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        author: {
          _id: blog.author?._id || '',
          name: blog.author?.name || ''
        }
      };
    } catch (error) {
      console.error(`Error toggling blog featured status ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle publish/draft status of a blog
   * @param id Blog ID
   * @param status New status ('published' or 'draft')
   * @returns Promise with updated blog
   */
  toggleStatus: async (id: string, status: 'published' | 'draft'): Promise<Blog> => {
    try {
      const response = await axios.patch<ApiResponse<BackendBlog>>(
        `${API_URL}/blogs/${id}/status`,
        { status },
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update blog status');
      }

      const blog = response.data.data;
      return {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        category: blog.categoryName || (typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId.name : '') || '',
        categoryId: typeof blog.categoryId === 'object' && blog.categoryId ? blog.categoryId._id : blog.categoryId || '',
        status: blog.status,
        featured: blog.featured || false,
        image: blog.image,
        thumbnail: blog.thumbnail,
        slug: blog.slug,
        views: blog.views,
        tags: blog.tags,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        author: {
          _id: blog.author?._id || '',
          name: blog.author?.name || ''
        }
      };
    } catch (error) {
      console.error(`Error toggling blog status ${id}:`, error);
      throw error;
    }
  }
};

export default blogService;
