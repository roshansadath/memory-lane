'use client';

import { useState } from 'react';
import { MemoryImage } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';

interface MemoryImageGalleryProps {
  images: MemoryImage[];
  alt?: string;
  className?: string;
  onImageClick?: (image: MemoryImage, index: number) => void;
  showThumbnails?: boolean;
}

export const MemoryImageGallery = memo(function MemoryImageGallery({
  images,
  alt,
  className,
  onImageClick,
  showThumbnails = true,
}: MemoryImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          'relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center',
          className
        )}
      >
        <div className='text-center'>
          <ImageIcon className='w-12 h-12 text-gray-400 mx-auto mb-2' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>No images</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentImage, currentIndex);
    }
  };

  return (
    <div className={cn('relative group', className)}>
      {/* Main Image Display */}
      <div className='relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden'>
        <Image
          src={currentImage.url}
          alt={currentImage.alt || alt || 'Memory image'}
          fill
          className='object-cover cursor-pointer transition-transform duration-200 hover:scale-105'
          onClick={handleImageClick}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          loading='lazy'
          placeholder='blur'
          blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className='absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10'>
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant='ghost'
              size='sm'
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-100 transition-opacity pointer-events-auto z-10'
              onClick={goToPrevious}
              type='button'
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-100 transition-opacity pointer-events-auto z-10'
              onClick={goToNext}
              type='button'
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </>
        )}

        {/* Click to Expand Indicator */}
        {onImageClick && (
          <div className='absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none'>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer'>
              <ImageIcon className='w-8 h-8 text-white drop-shadow-lg' />
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className='flex gap-2 mt-3 overflow-x-auto pb-2'>
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={cn(
                'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                index === currentIndex
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `Thumbnail ${index + 1}`}
                fill
                className='object-cover'
                sizes='64px'
                loading='lazy'
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator */}
      {!showThumbnails && images.length > 1 && (
        <div className='flex justify-center gap-1 mt-3'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});
