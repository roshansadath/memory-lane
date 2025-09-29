'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MemoryImage } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { processImagesToSupabase } from '@/lib/imageStorage';
import { memo } from 'react';

interface ImageUploadProps {
  onUpload: (images: MemoryImage[]) => void;
  disabled?: boolean;
  maxImages?: number;
  className?: string;
}

export const ImageUpload = memo(function ImageUpload({
  onUpload,
  disabled = false,
  maxImages = 10,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createdUrls] = useState<string[]>([]);

  // Cleanup effect for blob URLs
  useEffect(() => {
    return () => {
      createdUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [createdUrls]);

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      if (disabled || isUploading) return;

      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(file =>
        file.type.startsWith('image/')
      );

      if (imageFiles.length === 0) {
        setError('Please select valid image files');
        return;
      }

      if (imageFiles.length > maxImages) {
        setError(`You can upload a maximum of ${maxImages} images`);
        return;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Convert files to base64 first
        const base64Images: string[] = [];

        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const progress = ((i + 1) / imageFiles.length) * 50; // First 50% for conversion
          setUploadProgress(progress);

          const base64Url = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          base64Images.push(base64Url);
        }

        // Try to upload to Supabase Storage, fallback to base64 if it fails
        setUploadProgress(75);
        let uploadedUrls: string[];

        try {
          uploadedUrls = await processImagesToSupabase(base64Images);
        } catch (error) {
          console.warn(
            'Supabase upload failed, falling back to base64:',
            error
          );
          // Fallback to base64 URLs if Supabase is not configured
          uploadedUrls = base64Images;
        }

        // Create MemoryImage objects with URLs (Supabase or base64)
        const uploadedImages: MemoryImage[] = uploadedUrls.map(
          (url, index) => ({
            id: `img_${Date.now()}_${index}`,
            memoryId: '', // Will be set when memory is created
            url: url,
            alt: imageFiles[index].name.replace(/\.[^/.]+$/, ''),
            sortIndex: index,
          })
        );

        onUpload(uploadedImages);
        setUploadProgress(100);
      } catch (err) {
        setError('Failed to upload images. Please try again.');
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, isUploading, maxImages, onUpload]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isUploading) {
        setIsDragging(true);
      }
    },
    [disabled, isUploading]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files);
      }
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files);
      }
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isUploading]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          disabled && 'opacity-50 cursor-not-allowed',
          isUploading && 'opacity-75 cursor-wait'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='image/*'
          onChange={handleFileInputChange}
          className='hidden'
          disabled={disabled || isUploading}
        />

        <div className='space-y-4'>
          {/* Upload Icon */}
          <div className='mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center'>
            {isUploading ? (
              <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
            ) : (
              <Upload className='w-6 h-6 text-gray-400' />
            )}
          </div>

          {/* Upload Text */}
          <div className='space-y-2'>
            <p className='text-lg font-medium text-gray-900 dark:text-white'>
              {isUploading ? 'Uploading...' : 'Upload Images'}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {isUploading
                ? `Uploading images... ${Math.round(uploadProgress)}%`
                : 'Drag and drop images here, or click to select files'}
            </p>
            <p className='text-xs text-gray-400'>
              Supports JPG, PNG, GIF, WebP (max {maxImages} images)
            </p>
          </div>

          {/* Upload Button */}
          {!isUploading && (
            <Button
              type='button'
              variant='outline'
              className='inline-flex items-center gap-2'
              disabled={disabled}
            >
              <ImageIcon className='w-4 h-4' />
              Choose Images
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700'>
            <div
              className='h-full bg-blue-500 transition-all duration-300'
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <AlertCircle className='w-4 h-4 text-red-500 flex-shrink-0' />
          <p className='text-sm text-red-700 dark:text-red-300'>{error}</p>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setError(null)}
            className='ml-auto text-red-500 hover:text-red-700'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  );
});
