'use client';

import { MemoryLane } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Calendar, Image as ImageIcon, Tag } from 'lucide-react';
import { memo } from 'react';

interface LaneCardProps {
  lane: MemoryLane;
  onClick?: (lane: MemoryLane) => void;
  className?: string;
  isLoading?: boolean;
}

export const LaneCard = memo(function LaneCard({
  lane,
  onClick,
  className,
  isLoading = false,
}: LaneCardProps) {
  const handleClick = () => {
    if (onClick && !isLoading) {
      onClick(lane);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  if (isLoading) {
    return <LaneCardSkeleton className={className} />;
  }

  const memoryCount = lane.memories?.length || 0;
  const tagNames = lane.tags?.map(tag => tag.name).join(', ') || '';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300 ease-out',
        'hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20',
        'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
        'bg-white dark:bg-gray-800 min-w-[280px] w-full border border-gray-200 dark:border-gray-700 shadow-lg',
        'rounded-2xl backdrop-blur-sm',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='button'
      aria-label={`View memory lane: ${lane.title}`}
    >
      {/* Cover Image */}
      <div className='relative aspect-video overflow-hidden rounded-t-2xl'>
        {lane.coverImageUrl ? (
          <Image
            src={lane.coverImageUrl}
            alt={lane.title}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-110'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            priority={false}
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center'>
            <div className='text-center'>
              <ImageIcon className='w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2' />
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                No cover image
              </p>
            </div>
          </div>
        )}

        {/* Overlay gradient for better text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        {/* Memory count badge */}
        <div className='absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg'>
          {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'}
        </div>

        {/* Hover overlay with action hint */}
        <div className='absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
          <div className='bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-semibold text-sm shadow-lg'>
            View Lane →
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className='p-6 space-y-4'>
        {/* Title */}
        <h3 className='font-bold text-xl leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'>
          {lane.title}
        </h3>

        {/* Description */}
        {lane.description && (
          <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed'>
            {lane.description}
          </p>
        )}

        {/* Metadata */}
        <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex items-center space-x-2'>
            <Calendar className='w-4 h-4 text-blue-500' />
            <span className='font-medium'>
              {new Date(lane.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {tagNames && (
            <div className='flex items-center space-x-2 max-w-[60%]'>
              <Tag className='w-4 h-4 flex-shrink-0 text-purple-500' />
              <span className='truncate font-medium' title={tagNames}>
                {tagNames}
              </span>
            </div>
          )}
        </div>

        {/* Hover indicator */}
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full' />
      </CardContent>
    </Card>
  );
});

// Skeleton component for loading states
export const LaneCardSkeleton = memo(function LaneCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden min-w-[280px] w-full', className)}>
      <div className='aspect-video'>
        <Skeleton className='w-full h-full' />
      </div>
      <CardContent className='p-5 space-y-4'>
        <Skeleton className='h-7 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-20' />
        </div>
      </CardContent>
    </Card>
  );
});
