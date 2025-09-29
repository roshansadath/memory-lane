import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { queryKeys } from './useMemoryLanes';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface CreateMemoryLaneData {
  title: string;
  description?: string;
  coverImageUrl?: string;
  tagIds: string[];
}

export function useCreateMemoryLane() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateMemoryLaneData) => {
      const response = await apiService.createMemoryLane(data);
      return response.data;
    },
    onSuccess: async newLane => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.homePage() });
      queryClient.invalidateQueries({ queryKey: queryKeys.tagsWithLanes() });

      // Refresh user data to ensure ownership is properly calculated
      await refreshUser();

      // Navigate to the new memory lane
      if (newLane?.id) {
        router.push(`/lanes/${newLane.id}`);
      }
    },
    onError: error => {
      console.error('Failed to create memory lane:', error);
      // You could add toast notifications here
    },
  });
}
