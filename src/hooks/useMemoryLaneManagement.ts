import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { MemoryLane } from '@/types';
import { queryKeys } from './useMemoryLanes';
import { useRouter } from 'next/navigation';

interface CreateMemoryLaneData {
  title: string;
  description?: string;
  coverImageUrl?: string;
  tagIds?: string[];
}

interface UpdateMemoryLaneData {
  title?: string;
  description?: string;
  coverImageUrl?: string;
  tagIds?: string[];
}

export function useMemoryLaneManagement() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Create memory lane mutation
  const createMemoryLaneMutation = useMutation({
    mutationFn: async (data: CreateMemoryLaneData) => {
      const response = await apiService.createMemoryLane(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch lanes list
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    },
    onError: error => {
      console.error('Failed to create memory lane:', error);
    },
  });

  // Update memory lane mutation
  const updateMemoryLaneMutation = useMutation({
    mutationFn: async ({
      laneId,
      data,
    }: {
      laneId: string;
      data: UpdateMemoryLaneData;
    }) => {
      const response = await apiService.updateMemoryLane(laneId, data);
      return response.data;
    },
    onSuccess: updatedLane => {
      // Invalidate the specific lane's cache
      if (updatedLane?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.detail(updatedLane.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    },
    onError: error => {
      console.error('Failed to update memory lane:', error);
    },
  });

  // Delete memory lane mutation
  const deleteMemoryLaneMutation = useMutation({
    mutationFn: async (laneId: string) => {
      const response = await apiService.deleteMemoryLane(laneId);
      return { response: response.data, laneId };
    },
    onSuccess: ({ laneId }) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(laneId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });

      // Navigate to home page after successful deletion
      router.push('/');
    },
    onError: error => {
      console.error('Failed to delete memory lane:', error);
    },
  });

  // Helper functions
  const createMemoryLane = async (data: CreateMemoryLaneData) => {
    return createMemoryLaneMutation.mutateAsync(data);
  };

  const updateMemoryLane = async (
    laneId: string,
    data: UpdateMemoryLaneData
  ) => {
    return updateMemoryLaneMutation.mutateAsync({ laneId, data });
  };

  const deleteMemoryLane = async (laneId: string) => {
    return deleteMemoryLaneMutation.mutateAsync(laneId);
  };

  // Optimistic updates
  const updateMemoryLaneOptimistically = (
    laneId: string,
    data: UpdateMemoryLaneData
  ) => {
    // Update cache optimistically
    queryClient.setQueryData(
      queryKeys.detail(laneId),
      (oldData: { data: MemoryLane } | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...data,
            updatedAt: new Date(),
          },
        };
      }
    );

    return updateMemoryLaneMutation.mutateAsync({ laneId, data });
  };

  const deleteMemoryLaneOptimistically = (laneId: string) => {
    // Remove from cache optimistically
    queryClient.removeQueries({ queryKey: queryKeys.detail(laneId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.lists() });

    return deleteMemoryLaneMutation.mutateAsync(laneId);
  };

  return {
    // Mutations
    createMemoryLaneMutation,
    updateMemoryLaneMutation,
    deleteMemoryLaneMutation,

    // Helper functions
    createMemoryLane,
    updateMemoryLane,
    deleteMemoryLane,

    // Optimistic updates
    updateMemoryLaneOptimistically,
    deleteMemoryLaneOptimistically,

    // Loading states
    isCreating: createMemoryLaneMutation.isPending,
    isUpdating: updateMemoryLaneMutation.isPending,
    isDeleting: deleteMemoryLaneMutation.isPending,
    isLoading:
      createMemoryLaneMutation.isPending ||
      updateMemoryLaneMutation.isPending ||
      deleteMemoryLaneMutation.isPending,

    // Error states
    createError: createMemoryLaneMutation.error,
    updateError: updateMemoryLaneMutation.error,
    deleteError: deleteMemoryLaneMutation.error,

    // Mutation states
    isIdle:
      createMemoryLaneMutation.isIdle &&
      updateMemoryLaneMutation.isIdle &&
      deleteMemoryLaneMutation.isIdle,
    isSuccess:
      createMemoryLaneMutation.isSuccess ||
      updateMemoryLaneMutation.isSuccess ||
      deleteMemoryLaneMutation.isSuccess,
    isError:
      createMemoryLaneMutation.isError ||
      updateMemoryLaneMutation.isError ||
      deleteMemoryLaneMutation.isError,
  };
}
