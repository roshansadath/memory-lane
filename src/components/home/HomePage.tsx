'use client';

import { useHomePage } from '@/hooks/useHomePage';
import { useAuth } from '@/contexts/AuthContext';
import { TagSection } from './TagSection';
import { HomePageError } from './HomePageError';
import { HomePageSkeleton } from './HomePageSkeleton';
import { EmptyState } from './EmptyState';
import { FeaturedSection } from './FeaturedSection';
import { MemoryLane } from '@/types';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { tagsWithLanes, featuredLanes, isLoading, error } = useHomePage();

  // Show loading state while checking authentication
  if (authLoading) {
    return <HomePageSkeleton className={className} />;
  }

  if (error) {
    return <HomePageError error={error} className={className} />;
  }

  if (isLoading) {
    return <HomePageSkeleton className={className} />;
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <ResponsiveContainer className='space-y-8 py-8'>
        {/* Show welcome message for non-authenticated users */}
        {!isAuthenticated && (
          <div className='text-center py-8'>
            <ResponsiveContainer maxWidth='md'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Welcome to Memory Lane
              </h2>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                Explore beautiful memory lanes created by our community.
                {isAuthenticated
                  ? ' Create and organize your own memories.'
                  : ' Sign in to create your own memory lanes.'}
              </p>
            </ResponsiveContainer>
          </div>
        )}

        {/* Show featured lanes for all users */}
        {featuredLanes.length > 0 && (
          <FeaturedSection lanes={featuredLanes} onLaneClick={onLaneClick} />
        )}

        {/* Show tag sections for all users */}
        {tagsWithLanes.length > 0 ? (
          <TagSectionsList
            tagsWithLanes={tagsWithLanes}
            onLaneClick={onLaneClick}
          />
        ) : featuredLanes.length === 0 ? (
          <EmptyState />
        ) : null}
      </ResponsiveContainer>
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
