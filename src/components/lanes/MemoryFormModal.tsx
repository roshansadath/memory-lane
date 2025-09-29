'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Memory, MemoryImage } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/FormField';
import { ImageUpload } from './ImageUpload';
import { cn } from '@/lib/utils';
import { X, Calendar, Image as ImageIcon, Trash2 } from 'lucide-react';
import { memo } from 'react';

// Validation schema
const memoryFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  occurredAt: z.string().min(1, 'Date is required'),
});

type MemoryFormData = z.infer<typeof memoryFormSchema>;

interface MemoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MemoryFormData & { images: MemoryImage[] }) => Promise<void>;
  memory?: Memory | null;
  className?: string;
}

export const MemoryFormModal = memo(function MemoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  memory,
  className,
}: MemoryFormModalProps) {
  const [images, setImages] = useState<MemoryImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<MemoryFormData>({
    resolver: zodResolver(memoryFormSchema),
    defaultValues: {
      title: '',
      description: '',
      occurredAt: new Date().toISOString().split('T')[0],
    },
  });

  const isEditMode = !!memory;

  // Reset form when modal opens/closes or memory changes
  useEffect(() => {
    if (isOpen) {
      if (memory) {
        // Edit mode - populate form with existing data
        setValue('title', memory.title);
        setValue('description', memory.description || '');
        setValue(
          'occurredAt',
          new Date(memory.occurredAt).toISOString().split('T')[0]
        );
        setImages(memory.images || []);
      } else {
        // Create mode - reset to defaults
        reset({
          title: '',
          description: '',
          occurredAt: new Date().toISOString().split('T')[0],
        });
        setImages([]);
      }
    }
  }, [isOpen, memory, setValue, reset]);

  const handleImageUpload = (newImages: MemoryImage[]) => {
    setImages(prev => [...prev, ...newImages]);
  };

  const handleImageRemove = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleFormSubmit = async (data: MemoryFormData) => {
    if (images.length === 0) {
      // You might want to show an error here or make images optional
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        images,
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <Card
        className={cn(
          'w-full max-w-2xl max-h-[90vh] overflow-hidden',
          className
        )}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle className='text-xl font-semibold'>
            {isEditMode ? 'Edit Memory' : 'Add New Memory'}
          </CardTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X className='w-4 h-4' />
          </Button>
        </CardHeader>

        <CardContent className='space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]'>
          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            {/* Title Field */}
            <FormField label='Title' error={errors.title?.message} required>
              <input
                {...register('title')}
                type='text'
                placeholder='Enter memory title'
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white'
                disabled={isSubmitting}
              />
            </FormField>

            {/* Description Field */}
            <FormField label='Description' error={errors.description?.message}>
              <textarea
                {...register('description')}
                placeholder='Describe this memory...'
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none'
                disabled={isSubmitting}
              />
            </FormField>

            {/* Date Field */}
            <FormField label='Date' error={errors.occurredAt?.message} required>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  {...register('occurredAt')}
                  type='date'
                  className='w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white'
                  disabled={isSubmitting}
                />
              </div>
            </FormField>

            {/* Image Upload Section */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Images
                </label>
                <span className='text-xs text-gray-500'>
                  {images.length} image{images.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                onUpload={handleImageUpload}
                disabled={isSubmitting}
              />

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className='space-y-3'>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className='relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700'
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || `Memory image ${index + 1}`}
                          fill
                          className='object-cover'
                          onError={e => {
                            console.error('Failed to load image:', image.url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />

                        {/* Image Controls */}
                        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2'>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='text-white hover:bg-white/20'
                            onClick={() => handleImageRemove(image.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>

                        {/* Image Number */}
                        <div className='absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reorder Instructions */}
                  {images.length > 1 && (
                    <p className='text-xs text-gray-500 text-center'>
                      Drag images to reorder them
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting || !isDirty || images.length === 0}
                className='flex items-center gap-2'
              >
                {isSubmitting ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <ImageIcon className='w-4 h-4' />
                    {isEditMode ? 'Update Memory' : 'Create Memory'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});
