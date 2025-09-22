'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface HomePageSkeletonProps {
  className?: string;
}

export const HomePageSkeleton = memo(function HomePageSkeleton({
  className,
}: HomePageSkeletonProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <div className='space-y-8 py-8'>
        {/* Featured section skeleton */}
        <section className='space-y-4'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <Skeleton className='h-8 w-64 mb-2' />
            <Skeleton className='h-4 w-96' />
          </div>
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className='flex space-x-4 overflow-hidden'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-48 w-64 flex-shrink-0' />
              ))}
            </div>
          </div>
        </section>

        {/* Tag sections skeleton */}
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <section key={sectionIndex} className='space-y-4'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <Skeleton className='h-6 w-32 mb-2' />
            </div>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='flex space-x-4 overflow-hidden'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className='h-48 w-64 flex-shrink-0' />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
});
