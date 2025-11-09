import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface BlogCategory {
  _id: string;
  name: string;
}

export interface FeaturedBlog {
  _id: string;
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  image?: string;
  thumbnail?: string;
  status: 'published' | 'draft';
  categoryId?: BlogCategory;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  success: boolean;
  message: string;
  data: FeaturedBlog[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const blogsService = {
  /**
   * Get all blogs with pagination
   */
  async getAllBlogs(page: number = 1, limit: number = 10): Promise<{ blogs: FeaturedBlog[]; pagination: any }> {
    try {
      const response = await axios.get<BlogsResponse>(`${API_BASE_URL}/blogs?page=${page}&limit=${limit}&status=published`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch blogs');
      }

      // Transform the data to ensure consistent format
      const blogs = response.data.data.map(blog => ({
        _id: blog._id,
        title: blog.title,
        slug: blog.slug || `blog-${blog._id}`,
        content: blog.content,
        excerpt: blog.excerpt,
        status: blog.status,
        categoryId: blog.categoryId,
        category: blog.categoryId?.name || blog.category || '',
        image: this.getAbsoluteImageUrl(blog.image),
        thumbnail: this.getAbsoluteImageUrl(blog.thumbnail),
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
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
   * Get latest blogs with limit
   */
  async getLatestBlogs(limit: number = 4): Promise<FeaturedBlog[]> {
    try {
      const response = await axios.get<BlogsResponse>(`${API_BASE_URL}/blogs?limit=${limit}&status=published&sort=-createdAt`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch latest blogs');
      }

      // Transform the data to ensure consistent format
      return response.data.data.map(blog => ({
        _id: blog._id,
        title: blog.title,
        slug: blog.slug || `blog-${blog._id}`,
        content: blog.content,
        excerpt: blog.excerpt,
        status: blog.status,
        categoryId: blog.categoryId,
        category: blog.categoryId?.name || blog.category || '',
        image: this.getAbsoluteImageUrl(blog.image),
        thumbnail: this.getAbsoluteImageUrl(blog.thumbnail),
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
      throw error;
    }
  },

  /**
   * Get featured blogs (latest 3 published blogs) for BlogsSection
   */
  async getFeaturedBlogs(): Promise<FeaturedBlog[]> {
    try {
      const response = await axios.get<BlogsResponse>(`${API_BASE_URL}/blogs/featured?limit=3`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch featured blogs');
      }

      // Transform the data to ensure consistent format
      return response.data.data.map(blog => ({
        _id: blog._id,
        title: blog.title,
        slug: blog.slug || `blog-${blog._id}`,
        content: blog.content,
        excerpt: blog.excerpt,
        status: blog.status,
        categoryId: blog.categoryId,
        category: blog.categoryId?.name || blog.category || '',
        image: this.getAbsoluteImageUrl(blog.image),
        thumbnail: this.getAbsoluteImageUrl(blog.thumbnail),
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
      throw error;
    }
  },

  /**
   * Get blog by slug
   */
  async getBlogBySlug(slug: string): Promise<FeaturedBlog> {
    try {
      const response = await axios.get<BlogsResponse>(`${API_BASE_URL}/blogs/slug/${slug}`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch blog');
      }

      const blog = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;

      // Transform the data to ensure consistent format
      return {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug || `blog-${blog._id}`,
        content: blog.content,
        excerpt: blog.excerpt,
        status: blog.status,
        categoryId: blog.categoryId,
        category: blog.categoryId?.name || blog.category || '',
        image: this.getAbsoluteImageUrl(blog.image),
        thumbnail: this.getAbsoluteImageUrl(blog.thumbnail),
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      };
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  },

  /**
   * Helper function to convert relative URLs to absolute URLs
   */
  getAbsoluteImageUrl(imagePath?: string): string | undefined {
    if (!imagePath) return undefined;

    // If already absolute URL, return as is
    if (imagePath.startsWith('http')) return imagePath;

    // Convert relative to absolute
    return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  }
};

export default blogsService;