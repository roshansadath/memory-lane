'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tag } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/FormField';
import { ImageUpload } from './ImageUpload';
import { cn } from '@/lib/utils';
import {
  X,
  Plus,
  Tag as TagIcon,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { uploadImageToSupabase } from '@/lib/imageStorage';
import { memo } from 'react';

// Validation schema
const memoryLaneFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  coverImageUrl: z.string().optional(),
});

type MemoryLaneFormData = z.infer<typeof memoryLaneFormSchema>;

interface MemoryLaneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MemoryLaneFormData & { tagIds: string[] }) => Promise<void>;
  className?: string;
}

export const MemoryLaneFormModal = memo(function MemoryLaneFormModal({
  isOpen,
  onClose,
  onSubmit,
  className,
}: MemoryLaneFormModalProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<MemoryLaneFormData>({
    resolver: zodResolver(memoryLaneFormSchema),
    defaultValues: {
      title: '',
      description: '',
      coverImageUrl: '',
    },
  });

  // Load available tags when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        description: '',
        coverImageUrl: '',
      });
      setCoverImage(null);
      setSelectedTags([]);
      setNewTagName('');
    }
  }, [isOpen, reset]);

  const loadTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      if (data.success) {
        setAvailableTags(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleCoverImageUpload = async (
    images: { id: string; url: string; alt?: string }[]
  ) => {
    if (images.length > 0) {
      const image = images[0];

      // Check if it's a base64 image (needs upload) or already a Supabase URL
      if (image.url.startsWith('data:')) {
        try {
          // Upload to Supabase Storage
          const result = await uploadImageToSupabase(
            image.url,
            'memory-images',
            'covers'
          );
          setCoverImage(result.publicUrl);
          setValue('coverImageUrl', result.publicUrl);
        } catch (error) {
          console.warn('Supabase upload failed, using base64:', error);
          // Fallback to base64 URL if upload fails
          setCoverImage(image.url);
          setValue('coverImageUrl', image.url);
        }
      } else {
        // Already a Supabase URL
        setCoverImage(image.url);
        setValue('coverImageUrl', image.url);
      }
    }
  };

  const handleCoverImageRemove = () => {
    setCoverImage(null);
    setValue('coverImageUrl', '');
  };

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(t => t.id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        alert('Please sign in to create tags');
        return;
      }

      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      const data = await response.json();
      console.log('Create tag response:', data);

      if (data.success && data.data) {
        const newTag = data.data;
        setAvailableTags(prev => [...prev, newTag]);
        setSelectedTags(prev => [...prev, newTag]);
        setNewTagName('');
      } else {
        console.error('Failed to create tag:', data.error);
        alert('Failed to create tag: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert('Failed to create tag. Please try again.');
    }
  };

  const handleFormSubmit = async (data: MemoryLaneFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        tagIds: selectedTags.map(tag => tag.id),
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit memory lane:', error);
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
            Create Memory Lane
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
                placeholder='Enter memory lane title'
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white'
                disabled={isSubmitting}
              />
            </FormField>

            {/* Description Field */}
            <FormField label='Description' error={errors.description?.message}>
              <textarea
                {...register('description')}
                placeholder='Describe this memory lane...'
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none'
                disabled={isSubmitting}
              />
            </FormField>

            {/* Cover Image Section */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Cover Image
                </label>
                <span className='text-xs text-gray-500'>Optional</span>
              </div>

              {coverImage ? (
                <div className='relative group aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700'>
                  <Image
                    src={coverImage}
                    alt='Cover image'
                    fill
                    className='object-cover'
                    onError={e => {
                      console.error('Failed to load cover image:', coverImage);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='text-white hover:bg-white/20'
                      onClick={handleCoverImageRemove}
                      disabled={isSubmitting}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              ) : (
                <ImageUpload
                  onUpload={handleCoverImageUpload}
                  disabled={isSubmitting}
                  maxImages={1}
                />
              )}
            </div>

            {/* Tags Section */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Tags
                </label>
                <span className='text-xs text-gray-500'>
                  {selectedTags.length} selected
                </span>
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {selectedTags.map(tag => (
                    <div
                      key={tag.id}
                      className='flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm'
                    >
                      <TagIcon className='w-3 h-3' />
                      {tag.name}
                      <button
                        type='button'
                        onClick={() => handleTagRemove(tag.id)}
                        disabled={isSubmitting}
                        className='ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Tags */}
              {availableTags.length > 0 && (
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                    Available Tags
                  </label>
                  <div className='flex flex-wrap gap-2 max-h-32 overflow-y-auto'>
                    {availableTags
                      .filter(tag => !selectedTags.find(t => t.id === tag.id))
                      .map(tag => (
                        <button
                          key={tag.id}
                          type='button'
                          onClick={() => handleTagSelect(tag)}
                          disabled={isSubmitting}
                          className='flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                        >
                          <TagIcon className='w-3 h-3' />
                          {tag.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Create New Tag */}
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                  placeholder='Create new tag...'
                  className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm'
                  disabled={isSubmitting}
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isSubmitting}
                  className='flex items-center gap-1'
                >
                  <Plus className='w-4 h-4' />
                  Add
                </Button>
              </div>
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
                disabled={isSubmitting || !isDirty}
                className='flex items-center gap-2'
              >
                {isSubmitting ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Creating...
                  </>
                ) : (
                  <>
                    <ImageIcon className='w-4 h-4' />
                    Create Memory Lane
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
