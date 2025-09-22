import { useHomePageData } from './useMemoryLanes';
import { useMemo } from 'react';

export function useHomePage() {
  const { data: homeData, isLoading, error } = useHomePageData();

  const processedData = useMemo(() => {
    if (!homeData?.data) {
      return {
        tagsWithLanes: [],
        featuredLanes: [],
      };
    }

    return {
      tagsWithLanes: homeData.data.tagsWithLanes,
      featuredLanes: homeData.data.featuredLanes,
    };
  }, [homeData]);

  return {
    ...processedData,
    isLoading,
    error,
  };
}
