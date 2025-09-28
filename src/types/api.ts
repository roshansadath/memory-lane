import { User } from './index';

// Re-export types for convenience
export type { User, MemoryLane, Tag } from './index';

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: unknown;
}

/**
 * Authentication-specific API response
 */
export interface AuthApiResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> {
  success: boolean;
  data: {
    data: T[];
    pagination: PaginationMeta;
  };
}

/**
 * API route handler type
 */
export type ApiHandler = (
  request: Request,
  context?: { params: Record<string, string> }
) => Promise<Response>;

/**
 * Protected API route handler type
 */
export type ProtectedApiHandler = (
  request: Request,
  context: {
    params: Record<string, string>;
    user: User;
  }
) => Promise<Response>;
