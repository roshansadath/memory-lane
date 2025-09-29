'use client';

import { useState } from 'react';
import { MemoryCard } from '@/components/lanes/MemoryCard';
import { EmptyMemoryLane } from '@/components/lanes/EmptyMemoryLane';
import { MemoryLaneSkeleton } from '@/components/lanes/MemoryLaneSkeleton';
import { MemoryFormModal } from '@/components/lanes/MemoryFormModal';
import { OwnerOnly } from './PermissionGuard';
import { LoadingOverlay } from './LoadingStates';
import { FadeIn, StaggeredFadeIn } from './Transitions';
import { useMemoryLane } from '@/hooks/useMemoryLane';
import { useMemoryManagement } from '@/hooks/useMemoryManagement';
import { cn } from '@/lib/utils';
import { Memory, CreateMemoryData } from '@/types';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Sparkles } from 'lucide-react';

interface MemoryTimelineProps {
  laneId: string;
  isAuthenticated: boolean;
  isOwner: boolean;
  className?: string;
}

export const MemoryTimeline = memo(function MemoryTimeline({
  laneId,
  isAuthenticated,
  isOwner,
  className,
}: MemoryTimelineProps) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  const { data: lane, isLoading, error } = useMemoryLane({ laneId });

  const { createMemory, updateMemory, deleteMemory, isCreating, isUpdating } =
    useMemoryManagement();

  const handleCreateMemory = () => {
    setEditingMemory(null);
    setIsFormOpen(true);
  };

  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setIsFormOpen(true);
  };

  const handleDeleteMemory = async (memory: Memory) => {
    if (
      confirm(
        'Are you sure you want to delete this memory? This action cannot be undone.'
      )
    ) {
      try {
        await deleteMemory(memory.id, laneId);
      } catch (error) {
        console.error('Failed to delete memory:', error);
      }
    }
  };

  const handleFormSubmit = async (data: CreateMemoryData) => {
    try {
      if (editingMemory) {
        await updateMemory(editingMemory.id, data);
      } else {
        await createMemory(laneId, data);
      }
      setIsFormOpen(false);
      setEditingMemory(null);
    } catch (error) {
      console.error('Failed to save memory:', error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMemory(null);
  };

  if (isLoading) {
    return (
      <div className={cn('py-12', className)}>
        <FadeIn>
          <MemoryLaneSkeleton />
        </FadeIn>
      </div>
    );
  }

  if (error || !lane) {
    return (
      <div className={cn('py-12', className)}>
        <FadeIn>
          <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center py-16'>
              <div className='w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Sparkles className='w-8 h-8 text-red-600 dark:text-red-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Failed to load memories
              </h3>
              <p className='text-gray-600 dark:text-gray-300 max-w-md mx-auto'>
                There was an error loading the memories for this lane. Please
                try refreshing the page.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  const memories = lane.memories || [];

  if (memories.length === 0) {
    return (
      <div className={cn('py-12', className)}>
        <EmptyMemoryLane
          isAuthenticated={isAuthenticated}
          isOwner={isOwner}
          laneId={laneId}
          onCreateMemory={handleCreateMemory}
        />

        {/* Memory Form Modal for empty state */}
        <MemoryFormModal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          memory={editingMemory}
        />
      </div>
    );
  }

  // Group memories by year
  const memoriesByYear = memories.reduce(
    (acc, memory) => {
      const year = new Date(memory.occurredAt).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(memory);
      return acc;
    },
    {} as Record<string, typeof memories>
  );

  // Sort years in descending order (newest first)
  const sortedYears = Object.keys(memoriesByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  return (
    <div
      className={cn('py-12 bg-gray-50 dark:bg-gray-900 relative', className)}
    >
      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isCreating || isUpdating}
        text={isCreating ? 'Creating memory...' : 'Updating memory...'}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Timeline Header */}
        <FadeIn delay={100}>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 mb-6'>
              <Sparkles className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Memory Timeline
              </span>
            </div>

            <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              {memories.length}{' '}
              {memories.length === 1 ? 'precious memory' : 'precious memories'}{' '}
              captured across {sortedYears.length}{' '}
              {sortedYears.length === 1 ? 'year' : 'years'} of your life
            </p>
          </div>
        </FadeIn>

        {/* Year Filter */}
        {sortedYears.length > 1 && (
          <div className='flex flex-wrap justify-center gap-3 mb-5'>
            <button
              onClick={() => setSelectedYear(null)}
              className={cn(
                'px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2',
                selectedYear === null
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md'
              )}
            >
              <Calendar className='w-4 h-4' />
              All Years
            </button>
            {sortedYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  'px-6 py-3 rounded-full text-sm font-medium transition-all duration-200',
                  selectedYear === year
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md'
                )}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Add Memory Button */}
        <OwnerOnly
          isOwner={isOwner}
          redirectAfterAuth={`/lanes/${laneId}`}
          className='flex justify-center mb-12'
        >
          <Button
            onClick={handleCreateMemory}
            size='lg'
            className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
          >
            <Plus className='w-5 h-5 mr-2' />
            Add New Memory
          </Button>
        </OwnerOnly>

        {/* Timeline */}
        <div className='space-y-10'>
          {(selectedYear ? [selectedYear] : sortedYears).map(year => (
            <div key={year} className='relative'>
              {/* Year Header */}
              <div className='flex items-center mb-8'>
                <div className='flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent'></div>
                <div className='px-8'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-30'></div>
                    <div className='relative bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700'>
                      <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {year}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent'></div>
              </div>

              {/* Memories for this year */}
              <StaggeredFadeIn
                staggerDelay={150}
                className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'
              >
                {memoriesByYear[year]
                  .sort(
                    (a, b) =>
                      new Date(b.occurredAt).getTime() -
                      new Date(a.occurredAt).getTime()
                  )
                  .map(memory => (
                    <div
                      key={memory.id}
                      className='transform transition-all duration-300 hover:scale-105'
                    >
                      <MemoryCard
                        memory={memory}
                        isAuthenticated={isAuthenticated}
                        isOwner={isOwner}
                        onEdit={handleEditMemory}
                        onDelete={handleDeleteMemory}
                        className='h-full'
                      />
                    </div>
                  ))}
              </StaggeredFadeIn>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Form Modal */}
      <MemoryFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        memory={editingMemory}
      />
    </div>
  );
});
