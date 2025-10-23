const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
import { getAuthHeader } from "@/helper/helper";

export interface BlogHeroData {
  id?: string;
  _id?: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class BlogHeroService {
  async getAllBlogHeros(): Promise<BlogHeroData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/blog-hero`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blog heroes: ${response.statusText}`);
      }

      const data = await response.json();
      const heroes = data.data || data;
      // Map _id to id for consistency
      return heroes.map((hero: BlogHeroData) => ({
        ...hero,
        id: hero._id || hero.id
      }));
    } catch (error) {
      console.error('Error fetching blog heroes:', error);
      throw error;
    }
  }

  async getBlogHeroById(id: string): Promise<BlogHeroData> {
    try {
      const response = await fetch(`${API_BASE_URL}/blog-hero/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blog hero: ${response.statusText}`);
      }

      const data = await response.json();
      const hero = data.data || data;
      return {
        ...hero,
        id: hero._id || hero.id
      };
    } catch (error) {
      console.error('Error fetching blog hero:', error);
      throw error;
    }
  }

  async createBlogHero(heroData: Omit<BlogHeroData, 'id' | 'createdAt' | 'updatedAt'>, file?: File): Promise<BlogHeroData> {
    try {
      const formData = new FormData();

      // Append all text fields
      Object.entries(heroData).forEach(([key, value]) => {
        if (key !== 'backgroundImage' || !file) {
          formData.append(key, String(value));
        }
      });

      // Append file if provided
      if (file) {
        formData.append('backgroundImage', file);
      }

      const response = await fetch(`${API_BASE_URL}/blog-hero`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create blog hero: ${response.statusText}`);
      }

      const data = await response.json();
      const hero = data.data || data;
      return {
        ...hero,
        id: hero._id || hero.id
      };
    } catch (error) {
      console.error('Error creating blog hero:', error);
      throw error;
    }
  }

  async updateBlogHero(id: string, heroData: Partial<BlogHeroData>, file?: File): Promise<BlogHeroData> {
    try {
      const formData = new FormData();

      // Append all text fields
      Object.entries(heroData).forEach(([key, value]) => {
        if (key !== 'backgroundImage' || !file) {
          formData.append(key, String(value));
        }
      });

      // Append file if provided
      if (file) {
        formData.append('backgroundImage', file);
      }

      const response = await fetch(`${API_BASE_URL}/blog-hero/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update blog hero: ${response.statusText}`);
      }

      const data = await response.json();
      const hero = data.data || data;
      return {
        ...hero,
        id: hero._id || hero.id
      };
    } catch (error) {
      console.error('Error updating blog hero:', error);
      throw error;
    }
  }

  async deleteBlogHero(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/blog-hero/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete blog hero: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting blog hero:', error);
      throw error;
    }
  }

  async toggleActiveStatus(id: string): Promise<BlogHeroData> {
    try {
      const response = await fetch(`${API_BASE_URL}/blog-hero/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle blog hero status: ${response.statusText}`);
      }

      const data = await response.json();
      const hero = data.data || data;
      return {
        ...hero,
        id: hero._id || hero.id
      };
    } catch (error) {
      console.error('Error toggling blog hero status:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/blog-hero/upload-image`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const blogHeroService = new BlogHeroService();