'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useMyMemoryLanes } from '@/hooks/useMemoryLanes';
import { useCreateMemoryLane } from '@/hooks/useMemoryLanes';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { LaneCard } from '@/components/home/LaneCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { MemoryLaneFormModal } from '@/components/lanes/MemoryLaneFormModal';
import { useRouter } from 'next/navigation';

export default function MyLanesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openModal } = useAuthModal();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'updatedAt'>(
    'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    data: lanes,
    isLoading: lanesLoading,
    error: lanesError,
  } = useMyMemoryLanes({
    search: searchQuery || undefined,
    sortBy,
    sortOrder,
  });

  const { mutateAsync: createMemoryLane } = useCreateMemoryLane();

  const handleLaneClick = (lane: { id: string }) => {
    router.push(`/lanes/${lane.id}`);
  };

  const handleCreateLane = async (data: {
    title: string;
    description?: string;
    coverImageUrl?: string;
    tagIds: string[];
  }) => {
    try {
      await createMemoryLane(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create lane:', error);
      // Error handling is done in the hook
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Layout>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
          <LoadingSpinner size='lg' />
        </div>
      </Layout>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
          <div className='text-center max-w-md mx-auto px-4'>
            <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Plus className='w-8 h-8 text-blue-600 dark:text-blue-400' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              Create Your Memory Lanes
            </h1>
            <p className='text-gray-600 dark:text-gray-300 mb-8'>
              Sign in to create and manage your personal memory lanes. Organize
              your memories chronologically and share them with others.
            </p>
            <div className='space-y-3'>
              <Button
                onClick={() => openModal('login')}
                className='w-full bg-blue-600 text-white hover:bg-blue-700'
              >
                Sign In
              </Button>
              <Button
                onClick={() => openModal('register')}
                variant='outline'
                className='w-full'
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (lanesError) {
    return (
      <Layout>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              Something went wrong
            </h1>
            <p className='text-gray-600 dark:text-gray-300 mb-8'>
              We couldn&apos;t load your memory lanes. Please try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className='bg-blue-600 text-white hover:bg-blue-700'
            >
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  My Memory Lanes
                </h1>
                <p className='text-gray-600 dark:text-gray-300 mt-2'>
                  Manage and organize your personal memory collections
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className='bg-blue-600 text-white hover:bg-blue-700'
              >
                <Plus className='w-4 h-4 mr-2' />
                Create Lane
              </Button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className='mb-8'>
            <div className='flex flex-col sm:flex-row gap-4'>
              {/* Search */}
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <input
                    type='text'
                    placeholder='Search your memory lanes...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>

              {/* Sort Controls */}
              <div className='flex gap-2'>
                <select
                  value={sortBy}
                  onChange={e =>
                    setSortBy(
                      e.target.value as 'createdAt' | 'title' | 'updatedAt'
                    )
                  }
                  className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='createdAt'>Created Date</option>
                  <option value='updatedAt'>Updated Date</option>
                  <option value='title'>Title</option>
                </select>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }
                  className='px-3 h-full'
                >
                  {sortOrder === 'asc' ? '🔼' : '🔽'}
                </Button>
              </div>
            </div>
          </div>

          {/* Lanes Grid */}
          {lanesLoading ? (
            <div className='flex items-center justify-center py-12'>
              <LoadingSpinner size='lg' />
            </div>
          ) : lanes && lanes.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {lanes.map(lane => (
                <LaneCard key={lane.id} lane={lane} onClick={handleLaneClick} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Plus className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                {searchQuery ? 'No lanes found' : 'No memory lanes yet'}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-8'>
                {searchQuery
                  ? 'Try adjusting your search terms or create a new lane.'
                  : 'Create your first memory lane to start organizing your memories.'}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className='bg-blue-600 text-white hover:bg-blue-700'
              >
                <Plus className='w-4 h-4 mr-2' />
                Create Your First Lane
              </Button>
            </div>
          )}
        </div>

        {/* Create Lane Modal */}
        <MemoryLaneFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLane}
        />
      </div>
    </Layout>
  );
}
