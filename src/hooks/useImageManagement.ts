import { useState, useCallback, useRef } from 'react';
import { MemoryImage } from '@/types';

interface ImageUploadOptions {
  maxSize?: number; // in MB
  maxImages?: number;
  allowedTypes?: string[];
}

interface ImageUploadResult {
  success: boolean;
  images?: MemoryImage[];
  error?: string;
}

export function useImageManagement(options: ImageUploadOptions = {}) {
  const {
    maxSize = 10, // 10MB default
    maxImages = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<MemoryImage[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return `File type ${file.type} is not supported. Please use: ${allowedTypes.join(', ')}`;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        return `File size ${fileSizeMB.toFixed(1)}MB exceeds maximum size of ${maxSize}MB`;
      }

      return null;
    },
    [allowedTypes, maxSize]
  );

  const processFile = useCallback((file: File): Promise<MemoryImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const image: MemoryImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            memoryId: '', // Will be set when memory is created
            url: result,
            alt: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
            sortIndex: 0, // Will be updated when added to memory
          };
          resolve(image);
        } else {
          reject(new Error('Failed to read file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const uploadImages = useCallback(
    async (files: FileList): Promise<ImageUploadResult> => {
      if (files.length === 0) {
        return { success: false, error: 'No files selected' };
      }

      if (files.length > maxImages) {
        return {
          success: false,
          error: `Too many files. Maximum ${maxImages} images allowed.`,
        };
      }

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        const images: MemoryImage[] = [];
        const errors: string[] = [];

        // Validate all files first
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const validationError = validateFile(file);
          if (validationError) {
            errors.push(`${file.name}: ${validationError}`);
          }
        }

        if (errors.length > 0) {
          setError(errors.join('; '));
          return { success: false, error: errors.join('; ') };
        }

        // Process files with progress tracking
        for (let i = 0; i < files.length; i++) {
          // Check if upload was cancelled
          if (abortControllerRef.current?.signal.aborted) {
            throw new Error('Upload cancelled');
          }

          const file = files[i];
          const progress = ((i + 1) / files.length) * 100;
          setUploadProgress(progress);

          try {
            const image = await processFile(file);
            image.sortIndex = i;
            images.push(image);
          } catch {
            errors.push(`${file.name}: Failed to process file`);
          }
        }

        if (errors.length > 0) {
          setError(errors.join('; '));
          return { success: false, error: errors.join('; ') };
        }

        setUploadProgress(100);
        setUploadedImages(prev => [...prev, ...images]);
        return { success: true, images };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsUploading(false);
        // Reset progress after a short delay
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [maxImages, validateFile, processFile]
  );

  // Upload to Supabase Storage (placeholder implementation)
  const uploadToSupabase = useCallback(async (file: File): Promise<string> => {
    // This would integrate with Supabase Storage
    // For now, we'll return a mock URL
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  }, []);

  // Batch upload to Supabase
  const batchUploadToSupabase = useCallback(
    async (
      files: File[]
    ): Promise<{ success: boolean; urls: string[]; errors: string[] }> => {
      const urls: string[] = [];
      const errors: string[] = [];

      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i];
          const url = await uploadToSupabase(file);
          urls.push(url);
        } catch (error) {
          errors.push(`Failed to upload ${files[i].name}: ${error}`);
        }
      }

      return {
        success: errors.length === 0,
        urls,
        errors,
      };
    },
    [uploadToSupabase]
  );

  // Cancel upload
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  // Clear uploaded images
  const clearUploadedImages = useCallback(() => {
    setUploadedImages([]);
  }, []);

  const deleteImage = useCallback(
    (imageId: string, images: MemoryImage[]): MemoryImage[] => {
      return images.filter(img => img.id !== imageId);
    },
    []
  );

  const reorderImages = useCallback(
    (
      images: MemoryImage[],
      fromIndex: number,
      toIndex: number
    ): MemoryImage[] => {
      const newImages = [...images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);

      // Update sortIndex for all images
      return newImages.map((img, index) => ({
        ...img,
        sortIndex: index,
      }));
    },
    []
  );

  const updateImageAlt = useCallback(
    (images: MemoryImage[], imageId: string, alt: string): MemoryImage[] => {
      return images.map(img => (img.id === imageId ? { ...img, alt } : img));
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isUploading,
    uploadProgress,
    error,
    uploadedImages,

    // Actions
    uploadImages,
    deleteImage,
    reorderImages,
    updateImageAlt,
    clearError,

    // Supabase integration
    uploadToSupabase,
    batchUploadToSupabase,

    // Upload control
    cancelUpload,
    clearUploadedImages,

    // Validation
    validateFile,

    // Utility functions
    processFile,
  };
}
