import { getAuthHeader } from '@/helper/helper';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export interface ContactQuery {
  _id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'support' | 'returns' | 'wholesale' | 'technical' | 'feedback';
  source: string;
  ipAddress?: string;
  userAgent?: string;
  assignedTo?: string;
  adminNotes?: AdminNote[];
  responseEmailSent: boolean;
  responseEmailSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNote {
  _id?: string;
  note: string;
  /** Populated by the backend with the admin's name/email; may be a bare id on older records. */
  addedBy: string | { _id?: string; firstName?: string; lastName?: string; email?: string } | null;
  addedAt: string;
}

export interface ContactQueryStats {
  total: number;
  byStatus: { _id: string; count: number }[];
  byCategory: { _id: string; count: number }[];
}

export interface ContactQueryFilters {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class ContactQueriesService {
  private baseUrl = API_BASE_URL ;

  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    };
  }

  async getContactQueries(filters: ContactQueryFilters = {}): Promise<{
    queries: ContactQuery[];
    pagination: {
      current: number;
      total: number;
      pages: number;
      limit: number;
    };
  }> {
    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const response = await fetch(`${this.baseUrl}/api/contact?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact queries');
    }

    const result = await response.json();
    // Backend sends { page, pages, total, limit }; the UI works with `current`.
    const p = result.pagination || {};
    const limit = Number(p.limit) || filters.limit || 20;
    return {
      queries: result.data || [],
      pagination: {
        current: Number(p.current ?? p.page) || filters.page || 1,
        total: Number(p.total) || 0,
        pages: Math.max(1, Number(p.pages) || 0),
        limit,
      }
    };
  }

  async getContactQueryById(id: string): Promise<ContactQuery> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact query');
    }

    const result = await response.json();
    return result.data;
  }

  async updateContactQueryStatus(id: string, status: string): Promise<ContactQuery> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update contact query status');
    }

    const result = await response.json();
    return result.data;
  }

  async updateContactQueryPriority(id: string, priority: string): Promise<ContactQuery> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}/priority`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ priority }),
    });

    if (!response.ok) {
      throw new Error('Failed to update contact query priority');
    }

    const result = await response.json();
    return result.data;
  }

  async assignContactQuery(id: string, assignedTo: string): Promise<ContactQuery> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}/assign`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ assignedTo }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign contact query');
    }

    const result = await response.json();
    return result.data;
  }

  async addAdminNote(id: string, note: string): Promise<ContactQuery> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}/note`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ note }),
    });

    if (!response.ok) {
      throw new Error('Failed to add admin note');
    }

    const result = await response.json();
    return result.data;
  }

  async markResponseSent(id: string): Promise<ContactQuery> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}/response-sent`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to mark response as sent');
    }

    const result = await response.json();
    return result.data;
  }

  async getContactQueryStats(): Promise<ContactQueryStats> {
    const response = await fetch(`${this.baseUrl}/api/contact/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact query stats');
    }

    const result = await response.json();
    return result.data;
  }

  async deleteContactQuery(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete contact query');
    }
  }
}

export const contactQueriesService = new ContactQueriesService();