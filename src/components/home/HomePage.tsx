'use client';

import { useHomePage } from '@/hooks/useHomePage';
import { TagSection } from './TagSection';
import { HomePageError } from './HomePageError';
import { HomePageSkeleton } from './HomePageSkeleton';
import { EmptyState } from './EmptyState';
import { FeaturedSection } from './FeaturedSection';
import { MemoryLane } from '@/types';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface HomePageProps {
  className?: string;
  onLaneClick?: (lane: MemoryLane) => void;
}

export const HomePage = memo(function HomePage({
  className,
  onLaneClick,
}: HomePageProps) {
  const { tagsWithLanes, featuredLanes, isLoading, error } = useHomePage();

  if (error) {
    return <HomePageError error={error} className={className} />;
  }

  if (isLoading) {
    return <HomePageSkeleton className={className} />;
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <div className='space-y-8 py-8'>
        <FeaturedSection lanes={featuredLanes} onLaneClick={onLaneClick} />

        {tagsWithLanes.length > 0 ? (
          <TagSectionsList
            tagsWithLanes={tagsWithLanes}
            onLaneClick={onLaneClick}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
});

// Helper component for tag sections list
function TagSectionsList({
  tagsWithLanes,
  onLaneClick,
}: {
  tagsWithLanes: Array<{ id: string; name: string; lanes: MemoryLane[] }>;
  onLaneClick?: (lane: MemoryLane) => void;
}) {
  return (
    <div className='space-y-8'>
      {tagsWithLanes.map(tagData => (
        <TagSection
          key={tagData.id}
          tag={tagData}
          lanes={tagData.lanes}
          onLaneClick={onLaneClick}
          showNavigation={tagData.lanes.length > 4}
        />
      ))}
    </div>
  );
}
