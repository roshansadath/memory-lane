import { useQuery } from '@tanstack/react-query';
import { DataService } from '@/services/dataService';

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
export function useMemoryLanes() {
  return useQuery({
    queryKey: queryKeys.lists(),
    queryFn: () => DataService.getAllMemoryLanes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMemoryLane(slug: string) {
  return useQuery({
    queryKey: queryKeys.detail(slug),
    queryFn: () => DataService.getMemoryLaneBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMemoryLanesByTag(tagId: string) {
  return useQuery({
    queryKey: queryKeys.list({ tagId }),
    queryFn: () => DataService.getMemoryLanesByTag(tagId),
    enabled: !!tagId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hooks for Tags
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags(),
    queryFn: () => DataService.getAllTags(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useTagsWithLanes() {
  return useQuery({
    queryKey: queryKeys.tagsWithLanes(),
    queryFn: () => DataService.getTagsWithLanes(),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for Home Page data
export function useHomePageData() {
  return useQuery({
    queryKey: queryKeys.homePage(),
    queryFn: () => DataService.getHomePageData(),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for search
export function useSearchMemoryLanes(query: string) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => DataService.searchMemoryLanes(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for lane statistics
export function useLaneStats(laneId: string) {
  return useQuery({
    queryKey: queryKeys.stats(laneId),
    queryFn: () => DataService.getLaneStats(laneId),
    enabled: !!laneId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for memories by lane
export function useMemoriesByLane(laneId: string) {
  return useQuery({
    queryKey: ['memories', 'lane', laneId],
    queryFn: () => DataService.getMemoriesByLaneId(laneId),
    enabled: !!laneId,
    staleTime: 5 * 60 * 1000,
  });
}
