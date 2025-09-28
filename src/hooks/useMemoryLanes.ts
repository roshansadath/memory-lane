import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';

// Query keys
export const queryKeys = {
  all: ['memoryLanes'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...queryKeys.lists(), { filters }] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  tags: () => ['tags'] as const,
  tagsWithLanes: () => ['tags', 'withLanes'] as const,
  homePage: () => ['homePage'] as const,
  search: (query: string) => ['search', query] as const,
  stats: (laneId: string) => ['stats', laneId] as const,
};

// Hooks for Memory Lanes
interface UseMemoryLanesParams {
  page?: number;
  limit?: number;
  search?: string;
  tagId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useMemoryLanes(params?: UseMemoryLanesParams) {
  return useQuery({
    queryKey: queryKeys.lists(),
    queryFn: () => apiService.getMemoryLanes(params),
    select: data => data.data?.data || [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMemoryLane(id: string) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => apiService.getMemoryLane(id),
    select: data => data.data,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMemoryLanesByTag(tagId: string) {
  return useQuery({
    queryKey: queryKeys.list({ tagId }),
    queryFn: () => apiService.getMemoryLanes({ tagId }),
    select: data => data.data?.data || [],
    enabled: !!tagId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hooks for Tags
export function useTags(search?: string) {
  return useQuery({
    queryKey: queryKeys.tags(),
    queryFn: () => apiService.getTags(search),
    select: data => data.data || [],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useTagsWithLanes() {
  return useQuery({
    queryKey: queryKeys.tagsWithLanes(),
    queryFn: () => apiService.getTags(),
    select: data => data.data || [],
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for Home Page data
export function useHomePageData() {
  return useQuery({
    queryKey: queryKeys.homePage(),
    queryFn: () => apiService.getMemoryLanes({ limit: 10 }),
    select: data => data.data?.data || [],
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for search
export function useSearchMemoryLanes(query: string) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => apiService.getMemoryLanes({ search: query }),
    select: data => data.data?.data || [],
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for lane statistics
export function useLaneStats(laneId: string) {
  return useQuery({
    queryKey: queryKeys.stats(laneId),
    queryFn: () => apiService.getMemoryLane(laneId),
    select: data => ({
      memoryCount: data.data?.memories?.length || 0,
      tagCount: data.data?.tags?.length || 0,
    }),
    enabled: !!laneId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for memories by lane
export function useMemoriesByLane(
  laneId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
) {
  return useQuery({
    queryKey: ['memories', 'lane', laneId, params],
    queryFn: () => apiService.getMemories(laneId, params),
    select: data => data.data?.data || [],
    enabled: !!laneId,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation hooks
export function useCreateMemoryLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      coverImageUrl?: string;
      tagIds?: string[];
    }) => apiService.createMemoryLane(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.homePage() });
    },
  });
}

export function useUpdateMemoryLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        description?: string;
        coverImageUrl?: string;
        tagIds?: string[];
      };
    }) => apiService.updateMemoryLane(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.homePage() });
    },
  });
}

export function useDeleteMemoryLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteMemoryLane(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.homePage() });
    },
  });
}
