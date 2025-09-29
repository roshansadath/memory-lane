'use client';

import { memo } from 'react';

export const EmptyState = memo(function EmptyState() {
  const handleCreateLane = () => {
    // TODO: Implement create lane functionality
    console.log('Create lane clicked');
  };

  return (
    <div className='flex items-center justify-center min-h-[60vh] py-16'>
      <div className='text-center max-w-2xl mx-auto px-4'>
        <div className='relative mb-8'>
          <div className='w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg'>
            <svg
              className='w-16 h-16 text-blue-500 dark:text-blue-400'
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
          {/* Decorative elements */}
          <div className='absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse'></div>
          <div className='absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-1000'></div>
        </div>
        <h3 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
          No Memory Lanes Yet
        </h3>
        <p className='text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed'>
          Start creating your first memory lane to begin collecting and sharing
          your precious moments. Build beautiful, chronological collections that
          tell your story.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={handleCreateLane}
            className='px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105'
          >
            Create Your First Lane
          </button>
          <button className='px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold'>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
});
