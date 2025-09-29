'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Plus,
  Calendar,
  Image as ImageIcon,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { memo } from 'react';

interface EmptyMemoryLaneProps {
  isAuthenticated: boolean;
  isOwner: boolean;
  laneId: string;
  onCreateMemory?: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
  showFeatures?: boolean;
  customMessage?: string;
}

export const EmptyMemoryLane = memo(function EmptyMemoryLane({
  isAuthenticated,
  isOwner,
  laneId,
  onCreateMemory,
  className,
  variant = 'default',
  showFeatures = true,
  customMessage,
}: EmptyMemoryLaneProps) {
  const { openModal, setRedirectAfterAuth } = useAuthModal();

  const handleAddMemory = () => {
    if (onCreateMemory) {
      onCreateMemory();
    }
  };

  const handleSignInClick = () => {
    setRedirectAfterAuth(`/lanes/${laneId}`);
    openModal('login');
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('py-8', className)}>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            {isOwner ? 'No memories yet' : 'This lane is empty'}
          </h3>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>
            {customMessage ||
              (isOwner
                ? 'Start adding memories to build your timeline.'
                : 'Check back later for new memories.')}
          </p>
          {isAuthenticated && isOwner && onCreateMemory && (
            <Button onClick={handleAddMemory} size='sm'>
              <Plus className='w-4 h-4 mr-2' />
              Add New Memory
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-16', className)}>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          {/* Animated Background Elements */}
          <div className='relative mb-12'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-32 h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse' />
            </div>

            {/* Main Icon */}
            <div className='relative mx-auto w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-8 shadow-lg'>
              <div className='w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl'>
                <Heart className='w-10 h-10 text-white' />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className='mb-12'>
            <h2 className='text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
              {isOwner ? 'Start Your Journey' : 'No Memories Yet'}
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed'>
              {isOwner
                ? 'This memory lane is waiting for your stories. Capture moments, preserve memories, and create a beautiful timeline of your life.'
                : 'This memory lane doesn&apos;t have any memories yet. Check back later to see what&apos;s been shared.'}
            </p>
          </div>

          {/* Action Buttons */}
          {isAuthenticated && isOwner && (
            <div className='space-y-8'>
              <Button
                onClick={handleAddMemory}
                size='lg'
                className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg'
              >
                <Plus className='w-6 h-6 mr-3' />
                Add Memory
              </Button>

              {/* Features List */}
              {showFeatures && (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto'>
                  <div className='flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
                    <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3'>
                      <ImageIcon className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      Upload Photos
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300 text-center'>
                      Add multiple images to each memory
                    </p>
                  </div>

                  <div className='flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
                    <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3'>
                      <Calendar className='w-6 h-6 text-green-600 dark:text-green-400' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      Organize by Date
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300 text-center'>
                      Chronological timeline of your memories
                    </p>
                  </div>

                  <div className='flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
                    <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3'>
                      <Sparkles className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      Tell Your Story
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300 text-center'>
                      Add descriptions and context to each memory
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className='space-y-8'>
              <div className='bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 max-w-2xl mx-auto border border-indigo-200 dark:border-indigo-800'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Ready to Create?
                </h3>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>
                  Join thousands of users who are preserving their precious
                  memories. Start building your personal memory collection
                  today.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Button
                    onClick={handleSignInClick}
                    size='lg'
                    className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg'
                  >
                    Sign In to Continue
                  </Button>
                  <Button
                    onClick={() => openModal('register')}
                    variant='outline'
                    size='lg'
                    className='border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/20'
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAuthenticated && !isOwner && (
            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 max-w-2xl mx-auto'>
              <div className='flex items-center justify-center mb-4'>
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                  <Heart className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                </div>
              </div>
              <h3 className='text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2'>
                This Lane is Empty
              </h3>
              <p className='text-blue-700 dark:text-blue-200'>
                This memory lane belongs to someone else and doesn&apos;t have
                any memories yet. Check back later to see what&apos;s been
                shared!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// Convenience components for different empty states
export const MinimalEmptyMemoryLane = memo(function MinimalEmptyMemoryLane(
  props: Omit<EmptyMemoryLaneProps, 'variant'>
) {
  return <EmptyMemoryLane {...props} variant='minimal' />;
});

export const DetailedEmptyMemoryLane = memo(function DetailedEmptyMemoryLane(
  props: Omit<EmptyMemoryLaneProps, 'variant'>
) {
  return <EmptyMemoryLane {...props} variant='detailed' showFeatures={true} />;
});
