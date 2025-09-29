import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { Memory, MemoryImage, MemoryLane } from '@/types';
import { queryKeys } from './useMemoryLanes';
import { useInvalidateMemoryLane } from './useMemoryLane';

interface QueryData {
  data: MemoryLane;
}

interface CreateMemoryData {
  title: string;
  description?: string;
  occurredAt: string;
  images: MemoryImage[];
}

interface UpdateMemoryData {
  title?: string;
  description?: string;
  occurredAt?: string;
  images?: MemoryImage[];
}

export function useMemoryManagement() {
  const queryClient = useQueryClient();
  const { invalidateAll } = useInvalidateMemoryLane();

  // Create memory mutation
  const createMemoryMutation = useMutation({
    mutationFn: async ({
      laneId,
      data,
    }: {
      laneId: string;
      data: CreateMemoryData;
    }) => {
      const response = await apiService.createMemory(laneId, {
        title: data.title,
        description: data.description,
        occurredAt: new Date(data.occurredAt).toISOString(),
        images: data.images?.map(img => img.url) || [],
      });
      return response.data;
    },
    onSuccess: (newMemory, { laneId }) => {
      // Invalidate and refetch lane data
      invalidateAll(laneId);
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    },
    onError: error => {
      console.error('Failed to create memory:', error);
      // You could add toast notifications here
    },
  });

  // Update memory mutation
  const updateMemoryMutation = useMutation({
    mutationFn: async ({
      memoryId,
      data,
    }: {
      memoryId: string;
      data: UpdateMemoryData;
    }) => {
      const response = await apiService.updateMemory(memoryId, {
        title: data.title,
        description: data.description,
        occurredAt: data.occurredAt
          ? new Date(data.occurredAt).toISOString()
          : undefined,
        images: data.images?.map(img => img.url) || undefined,
      });
      return response.data;
    },
    onSuccess: updatedMemory => {
      // Find the lane ID from the updated memory
      const laneId = (updatedMemory as { laneId?: string }).laneId;
      if (laneId) {
        invalidateAll(laneId);
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      }
    },
    onError: error => {
      console.error('Failed to update memory:', error);
      // You could add toast notifications here
    },
  });

  // Delete memory mutation
  const deleteMemoryMutation = useMutation({
    mutationFn: async ({
      memoryId,
      laneId,
    }: {
      memoryId: string;
      laneId: string;
    }) => {
      const response = await apiService.deleteMemory(memoryId);
      return { response: response.data, laneId };
    },
    onSuccess: ({ laneId }) => {
      // Invalidate the specific lane's cache
      invalidateAll(laneId);
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    },
    onError: error => {
      console.error('Failed to delete memory:', error);
      // You could add toast notifications here
    },
  });

  // Helper functions
  const createMemory = async (laneId: string, data: CreateMemoryData) => {
    return createMemoryMutation.mutateAsync({ laneId, data });
  };

  const updateMemory = async (memoryId: string, data: UpdateMemoryData) => {
    return updateMemoryMutation.mutateAsync({ memoryId, data });
  };

  const deleteMemory = async (memoryId: string, laneId: string) => {
    return deleteMemoryMutation.mutateAsync({ memoryId, laneId });
  };

  // Batch operations
  const batchCreateMemories = async (
    laneId: string,
    memoriesData: CreateMemoryData[]
  ) => {
    const results = [];
    for (const data of memoriesData) {
      try {
        const result = await createMemory(laneId, data);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error });
      }
    }
    return results;
  };

  const batchDeleteMemories = async (memoryIds: string[], laneId: string) => {
    const results = [];
    for (const memoryId of memoryIds) {
      try {
        const result = await deleteMemory(memoryId, laneId);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error });
      }
    }
    return results;
  };

  // Optimistic updates
  const createMemoryOptimistically = (
    laneId: string,
    data: CreateMemoryData
  ) => {
    const tempMemory: Memory = {
      id: `temp-${Date.now()}`,
      laneId,
      title: data.title,
      description: data.description,
      occurredAt: new Date(data.occurredAt),
      sortIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: data.images || [],
    };

    // Update cache optimistically
    queryClient.setQueryData(
      queryKeys.detail(laneId),
      (oldData: QueryData | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            memories: [tempMemory, ...oldData.data.memories],
          },
        };
      }
    );

    return createMemoryMutation.mutateAsync({ laneId, data });
  };

  const updateMemoryOptimistically = (
    memoryId: string,
    data: UpdateMemoryData
  ) => {
    // Find the lane ID from the current memory
    const laneId = (
      queryClient.getQueryData(queryKeys.detail(memoryId)) as QueryData
    )?.data?.id;
    if (!laneId) return updateMemory(memoryId, data);

    // Update cache optimistically
    queryClient.setQueryData(
      queryKeys.detail(laneId),
      (oldData: QueryData | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            memories: oldData.data.memories.map((mem: Memory) =>
              mem.id === memoryId ? { ...mem, ...data } : mem
            ),
          },
        };
      }
    );

    return updateMemoryMutation.mutateAsync({ memoryId, data });
  };

  const deleteMemoryOptimistically = (memoryId: string, laneId: string) => {
    // Update cache optimistically
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

    return deleteMemoryMutation.mutateAsync({ memoryId, laneId });
  };

  return {
    // Mutations
    createMemoryMutation,
    updateMemoryMutation,
    deleteMemoryMutation,

    // Helper functions
    createMemory,
    updateMemory,
    deleteMemory,

    // Batch operations
    batchCreateMemories,
    batchDeleteMemories,

    // Optimistic updates
    createMemoryOptimistically,
    updateMemoryOptimistically,
    deleteMemoryOptimistically,

    // Loading states
    isCreating: createMemoryMutation.isPending,
    isUpdating: updateMemoryMutation.isPending,
    isDeleting: deleteMemoryMutation.isPending,
    isLoading:
      createMemoryMutation.isPending ||
      updateMemoryMutation.isPending ||
      deleteMemoryMutation.isPending,

    // Error states
    createError: createMemoryMutation.error,
    updateError: updateMemoryMutation.error,
    deleteError: deleteMemoryMutation.error,

    // Mutation states
    isIdle:
      createMemoryMutation.isIdle &&
      updateMemoryMutation.isIdle &&
      deleteMemoryMutation.isIdle,
    isSuccess:
      createMemoryMutation.isSuccess ||
      updateMemoryMutation.isSuccess ||
      deleteMemoryMutation.isSuccess,
    isError:
      createMemoryMutation.isError ||
      updateMemoryMutation.isError ||
      deleteMemoryMutation.isError,
  };
}
