'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md',
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2
        className={cn('animate-spin text-blue-600', sizeClasses[size])}
      />
      {text && (
        <span
          className={cn(
            'text-gray-600 dark:text-gray-300',
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          )}
        >
          {text}
        </span>
      )}
    </div>
  );
});

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  className?: string;
}

export const LoadingOverlay = memo(function LoadingOverlay({
  isVisible,
  text = 'Loading...',
  className,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
        'flex items-center justify-center z-50',
        className
      )}
    >
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center gap-3'>
        <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
        <span className='text-gray-700 dark:text-gray-300'>{text}</span>
      </div>
    </div>
  );
});

interface ConnectionStatusProps {
  isOnline: boolean;
  isReconnecting?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const ConnectionStatus = memo(function ConnectionStatus({
  isOnline,
  isReconnecting = false,
  onRetry,
  className,
}: ConnectionStatusProps) {
  if (isOnline) return null;

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
        'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
        'rounded-lg px-4 py-2 shadow-lg',
        className
      )}
    >
      <div className='flex items-center gap-2'>
        {isReconnecting ? (
          <RefreshCw className='w-4 h-4 animate-spin text-red-600' />
        ) : (
          <WifiOff className='w-4 h-4 text-red-600' />
        )}
        <span className='text-sm text-red-700 dark:text-red-300'>
          {isReconnecting ? 'Reconnecting...' : 'No internet connection'}
        </span>
        {onRetry && !isReconnecting && (
          <Button
            size='sm'
            variant='outline'
            onClick={onRetry}
            className='ml-2 h-6 px-2 text-xs'
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  );
});

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const ProgressBar = memo(function ProgressBar({
  progress,
  className,
  showPercentage = false,
  animated = true,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      <div className='flex items-center justify-between mb-1'>
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          Progress
        </span>
        {showPercentage && (
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
        <div
          className={cn(
            'bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out',
            animated && 'animate-pulse'
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
});

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  variant?: 'paragraph' | 'title' | 'caption';
}

export const SkeletonText = memo(function SkeletonText({
  lines = 3,
  className,
  variant = 'paragraph',
}: SkeletonTextProps) {
  const getLineWidth = (index: number) => {
    if (variant === 'title') return 'w-3/4';
    if (variant === 'caption') return 'w-1/2';
    // paragraph
    if (index === lines - 1) return 'w-2/3'; // last line shorter
    return 'w-full';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
            getLineWidth(index)
          )}
        />
      ))}
    </div>
  );
});
