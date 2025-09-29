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
    <section className='space-y-6'>
      <div className='text-center'>
        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          Featured Memory Lanes
        </h2>
        <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
          Discover our most popular memory collections curated by our community
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
