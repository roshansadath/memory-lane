'use client';

import { useState, useRef, memo } from 'react';
import { useTags } from '@/hooks/useTags';
import { useMemoryLanesByTag } from '@/hooks/useMemoryLanes';
import { LaneCard } from './LaneCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Tag, X } from 'lucide-react';
import { MemoryLane } from '@/types';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  onLaneClick?: (lane: MemoryLane) => void;
  className?: string;
}

export const TagFilter = memo(function TagFilter({
  onLaneClick,
  className,
}: TagFilterProps) {
  const { data: tags = [], isLoading: tagsLoading } = useTags();
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedTagName, setSelectedTagName] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    data: filteredLanes = [],
    isLoading: lanesLoading,
    error: lanesError,
  } = useMemoryLanesByTag(selectedTagId || '', {
    enabled: !!selectedTagId,
  });

  const handleTagClick = (tagId: string, tagName: string) => {
    setSelectedTagId(tagId);
    setSelectedTagName(tagName);

    // Auto-scroll to results after a short delay to allow for data loading
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleClearFilter = () => {
    setSelectedTagId(null);
    setSelectedTagName(null);
  };

  if (tagsLoading || tags.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Tag Filter Section */}
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
          Explore by Category
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          Click on a tag to view memory lanes in that category
        </p>

        {/* Tag Buttons */}
        <div className='flex flex-wrap justify-center gap-3 mb-8'>
          {tags.map(tag => (
            <Button
              key={tag.id}
              onClick={() => handleTagClick(tag.id, tag.name)}
              variant={selectedTagId === tag.id ? 'default' : 'outline'}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200',
                selectedTagId === tag.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700'
              )}
            >
              <Tag className='w-4 h-4' />
              {tag.name}
            </Button>
          ))}
        </div>

        {/* Clear Filter Button */}
        {selectedTagId && (
          <Button
            onClick={handleClearFilter}
            variant='ghost'
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <X className='w-4 h-4 mr-2' />
            Clear Filter
          </Button>
        )}
      </div>

      {/* Filtered Results */}
      {selectedTagId && (
        <div ref={resultsRef} className='space-y-6'>
          <div className='text-center'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
              {selectedTagName} Memory Lanes
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              {lanesLoading
                ? 'Loading...'
                : `${filteredLanes.length} lane${filteredLanes.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Loading State */}
          {lanesLoading && (
            <div className='flex justify-center py-12'>
              <LoadingSpinner size='lg' />
            </div>
          )}

          {/* Error State */}
          {lanesError && (
            <div className='text-center py-12'>
              <p className='text-red-500 dark:text-red-400'>
                Failed to load memory lanes. Please try again.
              </p>
            </div>
          )}

          {/* Results Grid */}
          {!lanesLoading && !lanesError && (
            <>
              {filteredLanes.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredLanes.map(lane => (
                    <LaneCard key={lane.id} lane={lane} onClick={onLaneClick} />
                  ))}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Tag className='w-8 h-8 text-gray-400' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    No lanes found
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    No memory lanes found for the &quot;{selectedTagName}&quot;
                    tag.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});
