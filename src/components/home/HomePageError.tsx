'use client';

import { cn } from '@/lib/utils';
import { memo } from 'react';

interface HomePageErrorProps {
  error: Error;
  className?: string;
}

export const HomePageError = memo(function HomePageError({
  error,
  className,
}: HomePageErrorProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error Loading Data
          </h2>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>
            {error.message}
          </p>
          <button
            onClick={handleRetry}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
});
