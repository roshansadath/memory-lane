'use client';

import { cn } from '@/lib/utils';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import { memo } from 'react';

interface ImagePlaceholderProps {
  type: 'loading' | 'error' | 'empty';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const ImagePlaceholder = memo(function ImagePlaceholder({
  type,
  className,
  size = 'md',
  message,
}: ImagePlaceholderProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const getContent = () => {
    switch (type) {
      case 'loading':
        return (
          <div className='flex flex-col items-center justify-center space-y-2'>
            <div className='animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-6 h-6' />
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {message || 'Loading...'}
            </p>
          </div>
        );

      case 'error':
        return (
          <div className='flex flex-col items-center justify-center space-y-2'>
            <AlertCircle className={cn('text-red-400', iconSizes[size])} />
            <p className='text-xs text-red-500 dark:text-red-400 text-center'>
              {message || 'Failed to load'}
            </p>
          </div>
        );

      case 'empty':
        return (
          <div className='flex flex-col items-center justify-center space-y-2'>
            <ImageIcon className={cn('text-gray-400', iconSizes[size])} />
            <p className='text-xs text-gray-500 dark:text-gray-400 text-center'>
              {message || 'No image'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg',
        sizeClasses[size],
        className
      )}
    >
      {getContent()}
    </div>
  );
});

// Skeleton component for loading states
interface ImageSkeletonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ImageSkeleton = memo(function ImageSkeleton({
  className,
  size = 'md',
}: ImageSkeletonProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg',
        sizeClasses[size],
        className
      )}
    />
  );
});
