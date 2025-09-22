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
  const tagNames = lane.tags?.map(lt => lt.tag.name).join(', ') || '';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300 ease-out',
        'hover:scale-105 hover:shadow-xl hover:shadow-black/20',
        'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
        'bg-white dark:bg-gray-800',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='button'
      aria-label={`View memory lane: ${lane.title}`}
    >
      {/* Cover Image */}
      <div className='relative aspect-video overflow-hidden'>
        {lane.coverImageUrl ? (
          <Image
            src={lane.coverImageUrl}
            alt={lane.title}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-110'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            priority={false}
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center'>
            <ImageIcon className='w-12 h-12 text-gray-400 dark:text-gray-500' />
          </div>
        )}

        {/* Overlay gradient for better text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        {/* Memory count badge */}
        <div className='absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm'>
          {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'}
        </div>
      </div>

      {/* Content */}
      <CardContent className='p-4 space-y-3'>
        {/* Title */}
        <h3 className='font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'>
          {lane.title}
        </h3>

        {/* Description */}
        {lane.description && (
          <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-2'>
            {lane.description}
          </p>
        )}

        {/* Metadata */}
        <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
          <div className='flex items-center space-x-1'>
            <Calendar className='w-3 h-3' />
            <span>
              {new Date(lane.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {tagNames && (
            <div className='flex items-center space-x-1 max-w-[50%]'>
              <Tag className='w-3 h-3 flex-shrink-0' />
              <span className='truncate' title={tagNames}>
                {tagNames}
              </span>
            </div>
          )}
        </div>

        {/* Hover indicator */}
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left' />
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
    <Card className={cn('overflow-hidden', className)}>
      <div className='aspect-video'>
        <Skeleton className='w-full h-full' />
      </div>
      <CardContent className='p-4 space-y-3'>
        <Skeleton className='h-6 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
        <div className='flex items-center justify-between'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-20' />
        </div>
      </CardContent>
    </Card>
  );
});
