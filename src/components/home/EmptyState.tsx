'use client';

import { memo } from 'react';

export const EmptyState = memo(function EmptyState() {
  const handleCreateLane = () => {
    // TODO: Implement create lane functionality
    console.log('Create lane clicked');
  };

  return (
    <div className='flex items-center justify-center min-h-96'>
      <div className='text-center max-w-md mx-auto px-4'>
        <div className='w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center'>
          <svg
            className='w-12 h-12 text-gray-400 dark:text-gray-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
          No Memory Lanes Yet
        </h3>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          Start creating your first memory lane to begin collecting and sharing
          your precious moments.
        </p>
        <button
          onClick={handleCreateLane}
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
        >
          Create Your First Lane
        </button>
      </div>
    </div>
  );
});
