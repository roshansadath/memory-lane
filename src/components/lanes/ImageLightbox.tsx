'use client';

import { useState, useEffect, useCallback } from 'react';
import { MemoryImage } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';

interface ImageLightboxProps {
  images: MemoryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (index: number) => void;
  className?: string;
}

export const ImageLightbox = memo(function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  className,
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex];

  const goToPrevious = useCallback(() => {
    if (onNavigate) {
      const newIndex =
        currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      onNavigate(newIndex);
    }
  }, [onNavigate, currentIndex, images.length]);

  const goToNext = useCallback(() => {
    if (onNavigate) {
      const newIndex =
        currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      onNavigate(newIndex);
    }
  }, [onNavigate, currentIndex, images.length]);

  // Reset zoom and rotation when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          event.preventDefault();
          setZoom(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          event.preventDefault();
          setZoom(prev => Math.max(prev - 0.25, 0.5));
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          setRotation(prev => (prev + 90) % 360);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, goToNext, goToPrevious, onClose]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center',
        className
      )}
      onClick={onClose}
    >
      {/* Close Button */}
      <Button
        variant='ghost'
        size='sm'
        className='absolute top-4 right-4 z-10 text-white hover:bg-white/20'
        onClick={onClose}
      >
        <X className='w-5 h-5' />
      </Button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant='ghost'
            size='sm'
            className='absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20'
            onClick={goToPrevious}
          >
            <ChevronLeft className='w-5 h-5' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20'
            onClick={goToNext}
          >
            <ChevronRight className='w-5 h-5' />
          </Button>
        </>
      )}

      {/* Image Container */}
      <div
        className='relative max-w-[90vw] max-h-[90vh] overflow-hidden'
        onClick={e => e.stopPropagation()}
      >
        <div
          className='relative cursor-move'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt || 'Memory image'}
            width={800}
            height={600}
            className='max-w-full max-h-full object-contain'
            priority
          />
        </div>
      </div>

      {/* Controls */}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2'>
        <Button
          variant='ghost'
          size='sm'
          className='text-white hover:bg-white/20'
          onClick={handleZoomOut}
        >
          <ZoomOut className='w-4 h-4' />
        </Button>
        <span className='text-white text-sm px-2'>
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant='ghost'
          size='sm'
          className='text-white hover:bg-white/20'
          onClick={handleZoomIn}
        >
          <ZoomIn className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='text-white hover:bg-white/20'
          onClick={handleRotate}
        >
          <RotateCw className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='text-white hover:bg-white/20'
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full'>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
});
