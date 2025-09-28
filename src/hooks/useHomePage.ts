import { useMemoryLanes, useTagsWithLanes } from './useMemoryLanes';
import { useMemo } from 'react';

export function useHomePage() {
  const {
    data: lanes,
    isLoading: lanesLoading,
    error: lanesError,
  } = useMemoryLanes({ limit: 10 });
  const {
    data: tags,
    isLoading: tagsLoading,
    error: tagsError,
  } = useTagsWithLanes();

  const isLoading = lanesLoading || tagsLoading;
  const error = lanesError || tagsError;

  const processedData = useMemo(() => {
    // Ensure lanes and tags are arrays
    const lanesArray = Array.isArray(lanes) ? lanes : [];
    const tagsArray = Array.isArray(tags) ? tags : [];

    // Featured lanes are the most recent ones (always show if available)
    const featuredLanes = lanesArray.slice(0, 6);

    // If no lanes, return empty
    if (lanesArray.length === 0) {
      return {
        tagsWithLanes: [],
        featuredLanes: [],
      };
    }

    // If no tags, still show featured lanes but no tag sections
    if (tagsArray.length === 0) {
      return {
        tagsWithLanes: [],
        featuredLanes,
      };
    }

    // Group lanes by tags
    const tagsWithLanes = tagsArray
      .map(tag => ({
        id: tag.id,
        name: tag.name,
        color: (tag as { color?: string }).color || '#3B82F6',
        lanes: lanesArray.filter((lane: any) =>
          lane.tags?.some((tagItem: any) => tagItem.id === tag.id)
        ),
      }))
      .filter(tagData => tagData.lanes.length > 0);

    return {
      tagsWithLanes,
      featuredLanes,
    };
  }, [lanes, tags]);

  return {
    ...processedData,
    isLoading,
    error,
  };
}
