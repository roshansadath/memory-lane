'use client';

import { useState } from 'react';
import { Memory } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import { memo } from 'react';

interface MemoryActionsProps {
  memory: Memory;
  isAuthenticated: boolean;
  isOwner: boolean;
  onEdit: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
  className?: string;
  variant?: 'default' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

export const MemoryActions = memo(function MemoryActions({
  memory,
  isAuthenticated,
  isOwner,
  onEdit,
  onDelete,
  className,
  variant = 'default',
}: MemoryActionsProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(memory);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showConfirmDelete) {
      if (onDelete) {
        onDelete(memory);
      }
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  // Don't show actions if user is not authenticated or not the owner
  if (!isAuthenticated || !isOwner) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleEdit}
          className='h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 pointer-events-auto'
          type='button'
          aria-label='Edit memory'
        >
          <Edit className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleDelete}
          className={cn(
            'h-8 w-8 p-0 transition-colors pointer-events-auto',
            showConfirmDelete
              ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
          )}
          type='button'
          aria-label='Delete memory'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
        {showConfirmDelete && (
          <div className='absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10'>
            <p className='text-xs text-gray-600 dark:text-gray-300 mb-2'>
              Delete this memory?
            </p>
            <div className='flex gap-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDelete}
                className='h-6 px-2 text-xs text-red-600 hover:text-red-700'
              >
                Yes
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCancelDelete}
                className='h-6 px-2 text-xs'
              >
                No
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant='outline'
        size='sm'
        onClick={handleEdit}
        className='flex items-center gap-2 pointer-events-auto'
        type='button'
        aria-label='Edit memory'
      >
        <Edit className='w-4 h-4' />
        Edit
      </Button>

      <Button
        variant='outline'
        size='sm'
        onClick={handleDelete}
        className={cn(
          'flex items-center gap-2 transition-colors pointer-events-auto',
          showConfirmDelete
            ? 'text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'text-red-600 hover:text-red-700 hover:border-red-300'
        )}
        type='button'
        aria-label='Delete memory'
      >
        <Trash2 className='w-4 h-4' />
        {showConfirmDelete ? 'Confirm Delete' : 'Delete'}
      </Button>

      {showConfirmDelete && (
        <Button
          variant='ghost'
          size='sm'
          onClick={handleCancelDelete}
          className='text-gray-500 hover:text-gray-700'
        >
          Cancel
        </Button>
      )}
    </div>
  );
});
