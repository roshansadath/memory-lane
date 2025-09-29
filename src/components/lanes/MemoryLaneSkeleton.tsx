'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { Loader2 } from 'lucide-react';

interface MemoryLaneSkeletonProps {
  className?: string;
  showHeader?: boolean;
  showTimeline?: boolean;
  memoryCount?: number;
  variant?: 'full' | 'header-only' | 'timeline-only';
}

export const MemoryLaneSkeleton = memo(function MemoryLaneSkeleton({
  className,
  showHeader = true,
  showTimeline = true,
  memoryCount = 3,
  variant = 'full',
}: MemoryLaneSkeletonProps) {
  const shouldShowHeader =
    variant === 'full' || variant === 'header-only' || showHeader;
  const shouldShowTimeline =
    variant === 'full' || variant === 'timeline-only' || showTimeline;

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* Loading Indicator */}
      <div className='fixed top-4 right-4 z-50'>
        <div className='flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
          <Loader2 className='w-4 h-4 animate-spin text-blue-600' />
          <span className='text-sm text-gray-600 dark:text-gray-300'>
            Loading...
          </span>
        </div>
      </div>

      {/* Header Skeleton */}
      {shouldShowHeader && (
        <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
          <ResponsiveContainer className='py-8'>
            {/* Back Navigation Skeleton */}
            <div className='mb-6'>
              <Skeleton className='h-4 w-24' />
            </div>

            {/* Lane Content Skeleton */}
            <div className='flex flex-col lg:flex-row gap-8'>
              {/* Cover Image Skeleton */}
              <div className='flex-shrink-0'>
                <Skeleton className='w-full lg:w-80 h-48 lg:h-64 rounded-lg' />
              </div>

              {/* Lane Info Skeleton */}
              <div className='flex-1 min-w-0 space-y-4'>
                {/* Title Skeleton */}
                <Skeleton className='h-8 w-3/4' />
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-2/3' />

                {/* Description Skeleton */}
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-1/2' />
                </div>

                {/* Stats Skeleton */}
                <div className='flex gap-6'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-32' />
                </div>

                {/* Tags Skeleton */}
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-16' />
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-6 w-14' />
                </div>

                {/* Action Buttons Skeleton */}
                <div className='flex gap-3 pt-4'>
                  <Skeleton className='h-8 w-24' />
                  <Skeleton className='h-8 w-28' />
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
      )}

      {/* Timeline Skeleton */}
      {shouldShowTimeline && (
        <div className='py-8'>
          <ResponsiveContainer>
            <div className='space-y-8'>
              {/* Timeline Header Skeleton */}
              <div className='text-center space-y-2'>
                <Skeleton className='h-6 w-48 mx-auto' />
                <Skeleton className='h-4 w-32 mx-auto' />
              </div>

              {/* Year Filter Skeleton */}
              <div className='flex justify-center gap-2'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-16' />
                <Skeleton className='h-8 w-16' />
              </div>

              {/* Timeline Skeleton */}
              <div className='space-y-12'>
                {Array.from({ length: 3 }).map((_, yearIndex) => (
                  <div key={yearIndex} className='space-y-6'>
                    {/* Year Header Skeleton */}
                    <div className='flex items-center'>
                      <div className='flex-1 h-px bg-gray-200 dark:bg-gray-700'></div>
                      <div className='px-4'>
                        <Skeleton className='h-6 w-16' />
                      </div>
                      <div className='flex-1 h-px bg-gray-200 dark:bg-gray-700'></div>
                    </div>

                    {/* Memories Skeleton */}
                    <div className='space-y-6'>
                      {Array.from({ length: Math.ceil(memoryCount / 2) }).map(
                        (_, memoryIndex) => (
                          <div
                            key={memoryIndex}
                            className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'
                          >
                            <div className='flex flex-col lg:flex-row gap-6'>
                              {/* Memory Image Skeleton */}
                              <div className='flex-shrink-0'>
                                <Skeleton className='w-full lg:w-64 h-48 lg:h-40 rounded-lg' />
                              </div>

                              {/* Memory Content Skeleton */}
                              <div className='flex-1 min-w-0 space-y-3'>
                                {/* Title Skeleton */}
                                <Skeleton className='h-6 w-3/4' />

                                {/* Description Skeleton */}
                                <div className='space-y-2'>
                                  <Skeleton className='h-4 w-full' />
                                  <Skeleton className='h-4 w-2/3' />
                                </div>

                                {/* Date Skeleton */}
                                <Skeleton className='h-4 w-32' />

                                {/* Action Buttons Skeleton */}
                                <div className='flex gap-3 pt-2'>
                                  <Skeleton className='h-8 w-16' />
                                  <Skeleton className='h-8 w-20' />
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});

// Convenience components for specific skeleton types
export const MemoryLaneHeaderSkeleton = memo(function MemoryLaneHeaderSkeleton({
  className,
}: Pick<MemoryLaneSkeletonProps, 'className'>) {
  return <MemoryLaneSkeleton variant='header-only' className={className} />;
});

export const MemoryLaneTimelineSkeleton = memo(
  function MemoryLaneTimelineSkeleton({
    className,
    memoryCount = 3,
  }: Pick<MemoryLaneSkeletonProps, 'className' | 'memoryCount'>) {
    return (
      <MemoryLaneSkeleton
        variant='timeline-only'
        memoryCount={memoryCount}
        className={className}
      />
    );
  }
);
