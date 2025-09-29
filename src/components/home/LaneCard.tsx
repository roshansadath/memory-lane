'use client';

import { MemoryLane } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Calendar, Image as ImageIcon, Tag, Share2, Check } from 'lucide-react';
import { memo, useState } from 'react';
import { useToast } from '@/components/ui/Toast';

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
  const [isCopied, setIsCopied] = useState(false);
  const { addToast } = useToast();

  const handleClick = () => {
    if (onClick && !isLoading) {
      onClick(lane);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    console.log('Share button clicked for lane:', lane.id);

    try {
      const url = `${window.location.origin}/lanes/${lane.id}`;
      console.log('Attempting to copy URL:', url);

      await navigator.clipboard.writeText(url);
      console.log('Successfully copied to clipboard');
      setIsCopied(true);
      addToast({
        type: 'success',
        title: 'Link Copied!',
        message: 'Memory lane link has been copied to your clipboard.',
        duration: 3000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = `${window.location.origin}/lanes/${lane.id}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Successfully copied using fallback method');
        setIsCopied(true);
        addToast({
          type: 'success',
          title: 'Link Copied!',
          message: 'Memory lane link has been copied to your clipboard.',
          duration: 3000,
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
        addToast({
          type: 'error',
          title: 'Copy Failed',
          message: 'Unable to copy link automatically. Please copy manually.',
          duration: 5000,
        });
        // Show a prompt with the URL as a last resort
        const userInput = prompt(
          'Copy this link manually:',
          `${window.location.origin}/lanes/${lane.id}`
        );
        if (userInput) {
          addToast({
            type: 'info',
            title: 'Link Ready',
            message: 'You can now paste the link wherever you need it.',
            duration: 3000,
          });
        }
      }
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

        {/* Share button */}
        <button
          onClick={handleShare}
          className='absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white p-2 rounded-full backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 z-10'
          title={isCopied ? 'Link copied!' : 'Share lane'}
        >
          {isCopied ? (
            <Check className='w-4 h-4 text-green-600' />
          ) : (
            <Share2 className='w-4 h-4' />
          )}
        </button>

        {/* Hover overlay with action hint */}
        <div className='absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none'>
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
