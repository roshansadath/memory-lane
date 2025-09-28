import { URLSearchParams } from 'url';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(
  searchParams: URLSearchParams
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '10', 10))
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Get search term from query params
 */
export function getSearchTerm(
  searchParams: URLSearchParams
): string | undefined {
  const search = searchParams.get('search');
  return search ? search.trim() : undefined;
}

/**
 * Get tag filter from query params
 */
export function getTagFilter(
  searchParams: URLSearchParams
): string | undefined {
  const tagId = searchParams.get('tagId');
  return tagId ? tagId.trim() : undefined;
}

/**
 * Get sort parameters from query params
 */
export function getSortParams(searchParams: URLSearchParams): {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
} {
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  return {
    sortBy,
    sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
  };
}
