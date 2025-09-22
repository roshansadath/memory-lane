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
          <CarouselContent className='-ml-2 md:-ml-4'>
            {Array.from({ length: 6 }).map((_, index) => (
              <CarouselItem
                key={index}
                className='pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
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
    <div className={cn('space-y-4', className)}>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
        {title}
      </h2>

      <Carousel
        className='w-full'
        opts={{
          align: 'start',
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {lanes.map(lane => (
            <CarouselItem
              key={lane.id}
              className='pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
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
            <CarouselPrevious className='left-2 md:left-4' />
            <CarouselNext className='right-2 md:right-4' />
          </>
        )}
      </Carousel>
    </div>
  );
});
