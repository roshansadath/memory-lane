'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MemoryLaneHeader } from '@/components/lanes/MemoryLaneHeader';
import { MemoryTimeline } from '@/components/lanes/MemoryTimeline';
import { MemoryLaneSkeleton } from '@/components/lanes/MemoryLaneSkeleton';
import { MemoryLaneErrorBoundary } from '@/components/lanes/MemoryLaneErrorBoundary';
import { DeleteLaneDialog } from '@/components/lanes/DeleteLaneDialog';
import { useMemoryLane } from '@/hooks/useMemoryLane';
import { useMemoryLaneManagement } from '@/hooks/useMemoryLaneManagement';
import { useAuth } from '@/contexts/AuthContext';
import { MemoryLaneFormModal } from '@/components/lanes/MemoryLaneFormModal';
import Link from 'next/link';

export default function MemoryLanePage() {
  const params = useParams();
  const laneId = params.id as string;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: lane,
    isLoading: laneLoading,
    error: laneError,
  } = useMemoryLane({ laneId });

  const { deleteMemoryLane, updateMemoryLane, isDeleting } =
    useMemoryLaneManagement();

  // Check if the current user owns this lane
  const isOwner = Boolean(
    isAuthenticated && user && lane && user.id === lane.userId
  );

  // Handle delete lane
  const handleDeleteLane = async () => {
    try {
      await deleteMemoryLane(laneId);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete lane:', error);
      // Error handling is done in the hook
    }
  };

  // Handle edit lane
  const handleEditLane = () => {
    setShowEditModal(true);
  };

  // Handle edit form submit
  const handleEditSubmit = async (data: {
    title: string;
    description?: string;
    coverImageUrl?: string;
    tagIds: string[];
  }) => {
    try {
      await updateMemoryLane(laneId, data);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update lane:', error);
      // Error handling is done in the hook
    }
  };

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
    const error =
      laneError instanceof Error
        ? laneError
        : new Error('Failed to load memory lane');
    return (
      <Layout>
        <MemoryLaneErrorBoundary error={error}>
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
            onEditLane={handleEditLane}
            onDeleteLane={() => setShowDeleteDialog(true)}
          />

          {/* Memory Timeline */}
          <MemoryTimeline
            laneId={lane.id}
            isAuthenticated={isAuthenticated}
            isOwner={isOwner}
          />

          {/* Delete Confirmation Dialog */}
          <DeleteLaneDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDeleteLane}
            laneTitle={lane.title}
            isDeleting={isDeleting}
          />

          {/* Edit Lane Modal */}
          <MemoryLaneFormModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEditSubmit}
            lane={lane}
          />
        </div>
      </MemoryLaneErrorBoundary>
    </Layout>
  );
}
