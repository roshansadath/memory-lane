'use client';

import { MemoryLane } from '@/types';
import { LaneCard, LaneCardSkeleton } from './LaneCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface LaneCarouselProps {
  lanes: MemoryLane[];
  title: string;
  onLaneClick?: (lane: MemoryLane) => void;
  className?: string;
  isLoading?: boolean;
  showNavigation?: boolean;
}

export const LaneCarousel = memo(function LaneCarousel({
  lanes,
  title,
  onLaneClick,
  className,
  isLoading = false,
  showNavigation = true,
}: LaneCarouselProps) {
  const handleLaneClick = (lane: MemoryLane) => {
    if (onLaneClick) {
      onLaneClick(lane);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
          {title}
        </h2>
        <Carousel className='w-full'>
          <CarouselContent className='-ml-4 sm:-ml-6 md:-ml-8'>
            {Array.from({ length: 6 }).map((_, index) => (
              <CarouselItem
                key={index}
                className='pl-4 sm:pl-6 md:pl-8 basis-3/4 sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4'
              >
                <LaneCardSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (!lanes || lanes.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
          {title}
        </h2>
        <div className='flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <p className='text-gray-500 dark:text-gray-400'>
            No memory lanes found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <div className='text-center'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            {title}
          </h2>
        </div>
      )}

      <div className='relative'>
        <Carousel
          className='w-full'
          opts={{
            align: 'start',
            loop: false,
            skipSnaps: false,
            dragFree: true,
          }}
        >
          <CarouselContent className='p-4 sm:p-6 md:p-8 -ml-4 sm:-ml-6 md:-ml-8'>
            {lanes.map(lane => (
              <CarouselItem
                key={lane.id}
                className='pl-10 pr-4 sm:pl-6 md:pl-8 basis-[85%] sm:basis-2/3 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/4 '
              >
                <LaneCard
                  lane={lane}
                  onClick={handleLaneClick}
                  className='h-full'
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {showNavigation && lanes.length > 4 && (
            <>
              <CarouselPrevious className='left-4 sm:left-6 md:left-8 bg-white/90 hover:bg-white shadow-lg border-gray-200' />
              <CarouselNext className='right-4 sm:right-6 md:right-8 bg-white/90 hover:bg-white shadow-lg border-gray-200' />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
});
