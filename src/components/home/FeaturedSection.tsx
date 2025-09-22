'use client';

import { LaneCarousel } from './LaneCarousel';
import { MemoryLane } from '@/types';
import { memo } from 'react';

interface FeaturedSectionProps {
  lanes: MemoryLane[];
  onLaneClick?: (lane: MemoryLane) => void;
}

export const FeaturedSection = memo(function FeaturedSection({
  lanes,
  onLaneClick,
}: FeaturedSectionProps) {
  if (lanes.length === 0) {
    return null;
  }

  return (
    <section className='space-y-4'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Featured Memory Lanes
        </h2>
        <p className='text-gray-600 dark:text-gray-300'>
          Discover our most popular memory collections
        </p>
      </div>
      <LaneCarousel
        lanes={lanes}
        title=''
        onLaneClick={onLaneClick}
        showNavigation={lanes.length > 4}
      />
    </section>
  );
});
