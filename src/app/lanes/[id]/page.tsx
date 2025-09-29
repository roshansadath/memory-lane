'use client';

import { useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { MemoryLaneHeader } from '@/components/lanes/MemoryLaneHeader';
import { MemoryTimeline } from '@/components/lanes/MemoryTimeline';
import { MemoryLaneSkeleton } from '@/components/lanes/MemoryLaneSkeleton';
import { MemoryLaneErrorBoundary } from '@/components/lanes/MemoryLaneErrorBoundary';
import { useMemoryLane } from '@/hooks/useMemoryLanes';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function MemoryLanePage() {
  const params = useParams();
  const laneId = params.id as string;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    data: lane,
    isLoading: laneLoading,
    error: laneError,
  } = useMemoryLane(laneId);

  // Check if the current user owns this lane
  const isOwner = Boolean(
    isAuthenticated && user && lane && user.id === lane.userId
  );

  // Debug logging for ownership check
  console.log('Ownership Debug:', {
    isAuthenticated,
    user: user ? { id: user.id, email: user.email } : null,
    lane: lane ? { id: lane.id, userId: lane.userId, title: lane.title } : null,
    isOwner,
    userIdMatch: user && lane ? user.id === lane.userId : false,
  });

  // Debug logging
  console.log('Memory Lane Page Debug:', {
    isAuthenticated,
    user: user ? { id: user.id, email: user.email } : null,
    lane: lane ? { id: lane.id, userId: lane.userId, title: lane.title } : null,
    isOwner,
  });

  // Show loading state while checking authentication or loading lane
  if (authLoading || laneLoading) {
    return (
      <Layout>
        <MemoryLaneSkeleton />
      </Layout>
    );
  }

  // Show error state if lane failed to load
  if (laneError) {
    return (
      <Layout>
        <MemoryLaneErrorBoundary error={laneError}>
          <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
            <div className='text-center'>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Memory Lane Not Found
              </h1>
              <p className='text-gray-600 dark:text-gray-300 mb-8'>
                The memory lane you&apos;re looking for doesn&apos;t exist or
                has been removed.
              </p>
              <Link
                href='/'
                className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Go Home
              </Link>
            </div>
          </div>
        </MemoryLaneErrorBoundary>
      </Layout>
    );
  }

  // Show not found if lane doesn't exist
  if (!lane) {
    return (
      <Layout>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              Memory Lane Not Found
            </h1>
            <p className='text-gray-600 dark:text-gray-300 mb-8'>
              The memory lane you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
            <Link
              href='/'
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Go Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MemoryLaneErrorBoundary>
        <div className='min-h-screen'>
          {/* Memory Lane Header */}
          <MemoryLaneHeader
            lane={lane}
            isOwner={isOwner}
            onEditLane={() => console.log('Edit lane:', lane.id)}
            onDeleteLane={() => console.log('Delete lane:', lane.id)}
          />

          {/* Memory Timeline */}
          <MemoryTimeline
            laneId={lane.id}
            isAuthenticated={isAuthenticated}
            isOwner={isOwner}
          />
        </div>
      </MemoryLaneErrorBoundary>
    </Layout>
  );
}
