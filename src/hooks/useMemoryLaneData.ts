import { useMemo } from 'react';
import { Memory } from '@/types';
import {
  useMemoryLane,
  useMemoryLaneMemories,
  useMemoryLaneStats,
} from './useMemoryLane';
import { useMemoryManagement } from './useMemoryManagement';
import { useImageManagement } from './useImageManagement';

interface UseMemoryLaneDataParams {
  laneId: string;
  enabled?: boolean;
}

/**
 * Comprehensive hook for managing memory lane data
 * Combines all memory lane related functionality
 */
export function useMemoryLaneData({
  laneId,
  enabled = true,
}: UseMemoryLaneDataParams) {
  // Core data hooks
  const {
    data: lane,
    isLoading: laneLoading,
    error: laneError,
    refetch: refetchLane,
  } = useMemoryLane({ laneId, enabled });

  const {
    data: memoriesData,
    isLoading: memoriesLoading,
    error: memoriesError,
    refetch: refetchMemories,
  } = useMemoryLaneMemories({ laneId, enabled });

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useMemoryLaneStats(laneId);

  // Memory management
  const memoryManagement = useMemoryManagement();

  // Image management
  const imageManagement = useImageManagement({
    maxImages: 10,
    maxSize: 10,
  });

  // Derived state
  const memories = useMemo(
    () => memoriesData || lane?.memories || [],
    [memoriesData, lane?.memories]
  );
  const hasError = !!laneError || !!memoriesError;

  // Computed values
  const computedStats = useMemo(() => {
    if (stats) return stats;

    // Fallback to computed stats from memories
    const totalMemories = memories.length;
    const totalImages = memories.reduce(
      (sum: number, memory: Memory) => sum + (memory.images?.length || 0),
      0
    );
    const dateRange =
      memories.length > 0
        ? {
            earliest: new Date(
              Math.min(
                ...memories.map((m: Memory) => new Date(m.occurredAt).getTime())
              )
            ),
            latest: new Date(
              Math.max(
                ...memories.map((m: Memory) => new Date(m.occurredAt).getTime())
              )
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
  }, [stats, memories]);

  // Memory organization
  const memoriesByYear = useMemo(() => {
    const grouped = memories.reduce(
      (acc: Record<string, Memory[]>, memory: Memory) => {
        const year = new Date(memory.occurredAt).getFullYear().toString();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(memory);
        return acc;
      },
      {} as Record<string, Memory[]>
    );

    // Sort years in descending order
    return Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map(year => ({
        year,
        memories: grouped[year].sort(
          (a: Memory, b: Memory) =>
            new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
        ),
      }));
  }, [memories]);

  // Recent memories (last 5)
  const recentMemories = useMemo(() => {
    return memories
      .sort(
        (a: Memory, b: Memory) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
      )
      .slice(0, 5);
  }, [memories]);

  // Memory search
  const searchMemories = (query: string) => {
    if (!query.trim()) return memories;

    const lowercaseQuery = query.toLowerCase();
    return memories.filter(
      (memory: Memory) =>
        memory.title.toLowerCase().includes(lowercaseQuery) ||
        memory.description?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Memory filtering
  const filterMemoriesByDate = (startDate: Date, endDate: Date) => {
    return memories.filter((memory: Memory) => {
      const memoryDate = new Date(memory.occurredAt);
      return memoryDate >= startDate && memoryDate <= endDate;
    });
  };

  const filterMemoriesByImages = (hasImages: boolean) => {
    return memories.filter((memory: Memory) =>
      hasImages
        ? (memory.images?.length || 0) > 0
        : (memory.images?.length || 0) === 0
    );
  };

  // Refetch all data
  const refetchAll = () => {
    refetchLane();
    refetchMemories();
  };

  // Error handling
  const getErrorMessage = () => {
    if (laneError)
      return `Failed to load memory lane: ${(laneError as Error).message}`;
    if (memoriesError)
      return `Failed to load memories: ${(memoriesError as Error).message}`;
    return null;
  };

  return {
    // Core data
    lane,
    memories,
    stats: computedStats,

    // Loading states
    laneLoading,
    memoriesLoading,
    statsLoading,

    // Error states
    hasError,
    laneError,
    memoriesError,
    statsError,
    getErrorMessage,

    // Memory organization
    memoriesByYear,
    recentMemories,

    // Search and filter
    searchMemories,
    filterMemoriesByDate,
    filterMemoriesByImages,

    // Memory management
    ...memoryManagement,

    // Image management
    ...imageManagement,

    // Data operations
    refetchLane,
    refetchMemories,
    refetchAll,
  };
}

/**
 * Hook for memory lane analytics and insights
 */
export function useMemoryLaneAnalytics(laneId: string) {
  const { lane, memories, stats } = useMemoryLaneData({ laneId });

  const analytics = useMemo(() => {
    if (!memories.length) return null;

    // Activity over time
    const activityByMonth = memories.reduce(
      (acc: Record<string, number>, memory: Memory) => {
        const month = new Date(memory.occurredAt).toISOString().slice(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Most active month
    const mostActiveMonth = Object.entries(activityByMonth).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0];

    // Memory distribution by year
    const memoriesByYear = memories.reduce(
      (acc: Record<number, number>, memory: Memory) => {
        const year = new Date(memory.occurredAt).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    // Image statistics
    const imagesPerMemory = memories.map((m: Memory) => m.images?.length || 0);
    const avgImagesPerMemory =
      imagesPerMemory.reduce((sum: number, count: number) => sum + count, 0) /
      memories.length;
    const maxImagesInMemory = Math.max(...imagesPerMemory, 0);

    return {
      activityByMonth,
      mostActiveMonth,
      memoriesByYear,
      avgImagesPerMemory,
      maxImagesInMemory,
      totalMemories: memories.length,
      totalImages: stats?.totalImages || 0,
    };
  }, [memories, stats]);

  return {
    analytics,
    isLoading: !lane || !memories,
  };
}
