import { useMemoryLanes } from './useMemoryLanes';

export function useHomePage() {
  const {
    data: lanes,
    isLoading: lanesLoading,
    error: lanesError,
  } = useMemoryLanes({ limit: 10 });

  // Featured lanes are the most recent ones (always show if available)
  const featuredLanes = Array.isArray(lanes) ? lanes.slice(0, 6) : [];

  return {
    featuredLanes,
    isLoading: lanesLoading,
    error: lanesError,
  };
}
