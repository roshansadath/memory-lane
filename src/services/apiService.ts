import {
  ApiResponse,
  PaginatedApiResponse,
  User,
  MemoryLane,
  Tag,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getPublicHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<ApiResponse<{ user: User; token: string }>>(
      response
    );
  }

  async register(credentials: {
    email: string;
    password: string;
    name?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<ApiResponse<{ user: User; token: string }>>(
      response
    );
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<{ user: User }>>(response);
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<null>>(response);
  }

  // Memory Lanes endpoints - Public (for viewing)
  async getMemoryLanes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tagId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/lanes?${searchParams}`, {
      headers: this.getPublicHeaders(),
    });

    return this.handleResponse<PaginatedApiResponse<MemoryLane>>(response);
  }

  async getMemoryLane(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/lanes/${id}`, {
      headers: this.getPublicHeaders(),
    });

    return this.handleResponse<ApiResponse<MemoryLane>>(response);
  }

  // Memory Lanes endpoints - Authenticated (for creating/updating/deleting)
  async createMemoryLane(data: {
    title: string;
    description?: string;
    coverImageUrl?: string;
    tagIds?: string[];
  }) {
    const response = await fetch(`${API_BASE_URL}/api/lanes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ApiResponse<MemoryLane>>(response);
  }

  async updateMemoryLane(
    id: string,
    data: {
      title?: string;
      description?: string;
      coverImageUrl?: string;
      tagIds?: string[];
    }
  ) {
    const response = await fetch(`${API_BASE_URL}/api/lanes/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ApiResponse<MemoryLane>>(response);
  }

  async deleteMemoryLane(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/lanes/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<null>>(response);
  }

  // Tags endpoints - Public (for viewing)
  async getTags(search?: string) {
    const searchParams = new URLSearchParams();
    if (search) {
      searchParams.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/api/tags?${searchParams}`, {
      headers: this.getPublicHeaders(),
    });

    return this.handleResponse<ApiResponse<Tag[]>>(response);
  }

  async createTag(data: { name: string; color?: string }) {
    const response = await fetch(`${API_BASE_URL}/api/tags`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ApiResponse<Tag>>(response);
  }

  async updateTag(id: string, data: { name?: string; color?: string }) {
    const response = await fetch(`${API_BASE_URL}/api/tags/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ApiResponse<Tag>>(response);
  }

  async deleteTag(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/tags/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<null>>(response);
  }

  // Memories endpoints - Public (for viewing)
  async getMemories(
    laneId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/api/lanes/${laneId}/memories?${searchParams}`,
      {
        headers: this.getPublicHeaders(),
      }
    );

    return this.handleResponse<PaginatedApiResponse<MemoryLane>>(response);
  }

  async createMemory(
    laneId: string,
    data: {
      title: string;
      description?: string;
      occurredAt: string;
      images?: string[];
    }
  ) {
    const response = await fetch(
      `${API_BASE_URL}/api/lanes/${laneId}/memories`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    return this.handleResponse<ApiResponse<MemoryLane>>(response);
  }

  async updateMemory(
    id: string,
    data: {
      title?: string;
      description?: string;
      occurredAt?: string;
      images?: string[];
    }
  ) {
    const response = await fetch(`${API_BASE_URL}/api/memories/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ApiResponse<MemoryLane>>(response);
  }

  async deleteMemory(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/memories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ApiResponse<null>>(response);
  }
}

export const apiService = new ApiService();
