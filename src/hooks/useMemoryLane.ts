import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { MemoryLane, Memory } from '@/types';
import { queryKeys } from './useMemoryLanes';

interface QueryData {
  data: MemoryLane;
}

interface UseMemoryLaneParams {
  laneId: string;
  enabled?: boolean;
}

interface UseMemoryLaneMemoriesParams {
  laneId: string;
  enabled?: boolean;
}

/**
 * Hook to fetch a single memory lane by ID
 */
export function useMemoryLane({ laneId, enabled = true }: UseMemoryLaneParams) {
  return useQuery({
    queryKey: queryKeys.detail(laneId),
    queryFn: () => apiService.getMemoryLane(laneId),
    select: data => data.data,
    enabled: enabled && !!laneId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404 errors
      if ((error as { status?: number })?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch memories for a specific lane with pagination
 */
export function useMemoryLaneMemories({
  laneId,
  enabled = true,
}: UseMemoryLaneMemoriesParams) {
  return useQuery({
    queryKey: queryKeys.detail(laneId),
    queryFn: () => apiService.getMemoryLane(laneId),
    select: data => data.data?.memories || [],
    enabled: enabled && !!laneId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get lane statistics
 */
export function useMemoryLaneStats(laneId: string) {
  return useQuery({
    queryKey: queryKeys.stats(laneId),
    queryFn: async () => {
      // This would typically be a separate API endpoint
      // For now, we'll derive stats from the lane data
      const lane = await apiService.getMemoryLane(laneId);
      const memories = lane.data?.memories || [];

      // Calculate statistics
      const totalMemories = memories.length;
      const totalImages = memories.reduce(
        (sum, memory) => sum + (memory.images?.length || 0),
        0
      );
      const dateRange =
        memories.length > 0
          ? {
              earliest: new Date(
                Math.min(...memories.map(m => new Date(m.occurredAt).getTime()))
              ),
              latest: new Date(
                Math.max(...memories.map(m => new Date(m.occurredAt).getTime()))
              ),
            }
          : null;

      return {
        totalMemories,
        totalImages,
        dateRange,
        averageImagesPerMemory:
          totalMemories > 0 ? totalImages / totalMemories : 0,
      };
    },
    enabled: !!laneId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to prefetch memory lane data
 */
export function usePrefetchMemoryLane() {
  const queryClient = useQueryClient();

  const prefetchLane = (laneId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.detail(laneId),
      queryFn: () => apiService.getMemoryLane(laneId),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchMemories = (laneId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.detail(laneId),
      queryFn: () => apiService.getMemoryLane(laneId),
      staleTime: 2 * 60 * 1000,
    });
  };

  return { prefetchLane, prefetchMemories };
}

/**
 * Hook to invalidate memory lane cache
 */
export function useInvalidateMemoryLane() {
  const queryClient = useQueryClient();

  const invalidateLane = (laneId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.detail(laneId) });
  };

  const invalidateMemories = (laneId: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.detail(laneId),
    });
  };

  const invalidateStats = (laneId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.stats(laneId) });
  };

  const invalidateAll = (laneId: string) => {
    invalidateLane(laneId);
    invalidateMemories(laneId);
    invalidateStats(laneId);
  };

  return { invalidateLane, invalidateMemories, invalidateStats, invalidateAll };
}

/**
 * Hook to get memory lane with optimistic updates
 */
export function useMemoryLaneWithOptimisticUpdates(laneId: string) {
  const queryClient = useQueryClient();

  const { data: lane, ...queryResult } = useMemoryLane({ laneId });

  const updateLaneOptimistically = (updates: Partial<MemoryLane>) => {
    queryClient.setQueryData(
      queryKeys.detail(laneId),
      (oldData: QueryData | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...updates,
          },
        };
      }
    );
  };

  const addMemoryOptimistically = (memory: Memory) => {
    queryClient.setQueryData(
      queryKeys.detail(laneId),
      (oldData: QueryData | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            memories: [memory, ...oldData.data.memories],
          },
        };
      }
    );
  };

  const updateMemoryOptimistically = (
    memoryId: string,
    updates: Partial<Memory>
  ) => {
    queryClient.setQueryData(
      queryKeys.detail(laneId),
      (oldData: QueryData | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            memories: oldData.data.memories.map((mem: Memory) =>
              mem.id === memoryId ? { ...mem, ...updates } : mem
            ),
          },
        };
      }
    );
  };

  const removeMemoryOptimistically = (memoryId: string) => {
    queryClient.setQueryData(
      queryKeys.detail(laneId),
      (oldData: QueryData | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            memories: oldData.data.memories.filter(
              (mem: Memory) => mem.id !== memoryId
            ),
          },
        };
      }
    );
  };

  return {
    ...queryResult,
    lane,
    updateLaneOptimistically,
    addMemoryOptimistically,
    updateMemoryOptimistically,
    removeMemoryOptimistically,
  };
}
