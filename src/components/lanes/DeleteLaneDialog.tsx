'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteLaneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  laneTitle: string;
  isDeleting?: boolean;
  className?: string;
}

export function DeleteLaneDialog({
  isOpen,
  onClose,
  onConfirm,
  laneTitle,
  isDeleting = false,
  className,
}: DeleteLaneDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4',
          'border border-gray-200 dark:border-gray-700',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-100 dark:bg-red-900/20 rounded-lg'>
              <AlertTriangle className='w-5 h-5 text-red-600 dark:text-red-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Delete Memory Lane
            </h3>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClose}
            disabled={isDeleting}
            className='h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>

        {/* Content */}
        <div className='p-6'>
          <div className='mb-6'>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>
              Are you sure you want to delete this memory lane? This action
              cannot be undone.
            </p>

            <div className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600'>
              <p className='text-sm text-gray-700 dark:text-gray-300'>
                <strong>&ldquo;{laneTitle}&rdquo;</strong> and all its memories
                will be permanently deleted.
              </p>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className='mb-6'>
            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={isConfirmed}
                onChange={e => setIsConfirmed(e.target.checked)}
                disabled={isDeleting}
                className='mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                I understand this action is permanent and cannot be undone
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className='flex gap-3 justify-end'>
            <Button
              variant='outline'
              onClick={handleClose}
              disabled={isDeleting}
              className='px-6'
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isConfirmed || isDeleting}
              className='px-6 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isDeleting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete Lane
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
