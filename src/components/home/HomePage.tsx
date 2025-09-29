'use client';

import { useState } from 'react';
import { useHomePage } from '@/hooks/useHomePage';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useCreateMemoryLane } from '@/hooks/useCreateMemoryLane';
import { TagSection } from './TagSection';
import { HomePageError } from './HomePageError';
import { HomePageSkeleton } from './HomePageSkeleton';
import { EmptyState } from './EmptyState';
import { FeaturedSection } from './FeaturedSection';
import { MemoryLaneFormModal } from '@/components/lanes/MemoryLaneFormModal';
import { MemoryLane } from '@/types';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomePageProps {
  className?: string;
  onLaneClick?: (lane: MemoryLane) => void;
}

export const HomePage = memo(function HomePage({
  className,
  onLaneClick,
}: HomePageProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openModal } = useAuthModal();
  const { tagsWithLanes, featuredLanes, isLoading, error } = useHomePage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createMemoryLaneMutation = useCreateMemoryLane();

  const handleCreateMemoryLane = () => {
    if (!isAuthenticated) {
      openModal('register');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (data: {
    title: string;
    description?: string;
    coverImageUrl?: string;
    tagIds: string[];
  }) => {
    try {
      await createMemoryLaneMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to create memory lane:', error);
      throw error;
    }
  };

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
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
        className
      )}
    >
      {/* Hero Section for non-authenticated users */}
      {!isAuthenticated && (
        <div className='relative overflow-hidden'>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
            <div className='text-center'>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6'>
                Welcome to{' '}
                <span className='bg-gradient-to-r from-blue-300 to-blue-700 bg-clip-text text-transparent'>
                  Memory Lane
                </span>
              </h1>
              <p className='text-xl sm:text-2xl text-black-100 mb-8 max-w-3xl mx-auto leading-relaxed'>
                Create, organize, and share your most precious memories in
                beautiful, chronological collections that tell your story.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={handleCreateMemoryLane}
                  className='bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg'
                >
                  Get Started
                </button>
                <button className='border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-blue hover:text-blue-600 transition-colors duration-200'>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Memory Lane Button for authenticated users */}
      {isAuthenticated && (
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Your Memory Lanes
                </h2>
                <p className='text-gray-600 dark:text-gray-400 mt-1'>
                  Create and manage your personal memory collections
                </p>
              </div>
              <Button
                onClick={handleCreateMemoryLane}
                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg'
                disabled={createMemoryLaneMutation.isPending}
              >
                {createMemoryLaneMutation.isPending ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className='w-5 h-5' />
                    Create Memory Lane
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12'>
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
      </div>

      {/* Create Memory Lane Modal */}
      <MemoryLaneFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
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
    <div className='space-y-16'>
      {tagsWithLanes.map((tagData, index) => (
        <div key={tagData.id} className='relative'>
          {/* Section divider for visual separation */}
          {index > 0 && (
            <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent'></div>
          )}
          <TagSection
            tag={tagData}
            lanes={tagData.lanes}
            onLaneClick={onLaneClick}
            showNavigation={tagData.lanes.length > 4}
          />
        </div>
      ))}
    </div>
  );
}
