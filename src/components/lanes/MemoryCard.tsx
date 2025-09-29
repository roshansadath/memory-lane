'use client';

import { useState } from 'react';
import { Memory } from '@/types';
import { MemoryImageGallery } from './MemoryImageGallery';
import { ImageLightbox } from './ImageLightbox';
import { MemoryActions } from './MemoryActions';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { memo } from 'react';

interface MemoryCardProps {
  memory: Memory;
  isAuthenticated: boolean;
  isOwner: boolean;
  onEdit?: (memory: Memory) => void;
  onDelete?: (memory: Memory) => void;
  className?: string;
}

export const MemoryCard = memo(function MemoryCard({
  memory,
  isAuthenticated,
  isOwner,
  onEdit,
  onDelete,
  className,
}: MemoryCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (
    image: { url: string; alt?: string },
    index: number
  ) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setIsLightboxOpen(false);
  };

  const handleLightboxNavigate = (index: number) => {
    setLightboxIndex(index);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const memoryDate = new Date(date);
    const diffInDays = Math.floor(
      (now.getTime() - memoryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const imageCount = memory.images?.length || 0;

  return (
    <>
      <div
        className={cn(
          'group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700',
          className
        )}
      >
        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />

        {/* Memory Image Gallery */}
        <div className='relative h-64 overflow-hidden'>
          {imageCount > 0 ? (
            <MemoryImageGallery
              images={memory.images || []}
              alt={memory.title}
              onImageClick={handleImageClick}
              showThumbnails={false}
              className='h-full'
            />
          ) : (
            <div className='h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center'>
              <div className='text-center'>
                <ImageIcon className='w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2' />
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  No images
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Memory Content */}
        <div className='p-6'>
          {/* Title */}
          <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200'>
            {memory.title}
          </h3>

          {/* Description */}
          {memory.description && (
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3'>
              {memory.description}
            </p>
          )}

          {/* Date and Time Info */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                <Calendar className='w-4 h-4' />
                <span className='font-medium'>
                  {formatDate(memory.occurredAt)}
                </span>
              </div>
              <div className='text-xs text-gray-400 dark:text-gray-500'>
                {getRelativeTime(memory.occurredAt)}
              </div>
            </div>

            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
              <Clock className='w-4 h-4' />
              <span>{formatTime(memory.occurredAt)}</span>
            </div>
          </div>

          {/* Bottom Actions */}
          {isOwner && (
            <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
              <MemoryActions
                memory={memory}
                isAuthenticated={isAuthenticated}
                isOwner={isOwner}
                onEdit={() => onEdit?.(memory)}
                onDelete={() => onDelete?.(memory)}
                variant='default'
                size='sm'
              />
            </div>
          )}
        </div>

        {/* Hover Effect Border */}
        <div className='absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors duration-300 pointer-events-none' />
      </div>

      {/* Image Lightbox */}
      {memory.images && memory.images.length > 0 && (
        <ImageLightbox
          images={memory.images}
          currentIndex={lightboxIndex}
          isOpen={isLightboxOpen}
          onClose={handleLightboxClose}
          onNavigate={handleLightboxNavigate}
        />
      )}
    </>
  );
});
