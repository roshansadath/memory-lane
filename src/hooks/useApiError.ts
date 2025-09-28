'use client';

import { useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

export function useApiError() {
  const { addToast } = useToast();

  const handleError = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      let message = fallbackMessage || 'An unexpected error occurred';
      let type: 'error' | 'warning' = 'error';

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = String(error.message);
      }

      // Handle specific error types
      if (message.includes('401') || message.includes('unauthorized')) {
        message = 'Please sign in to continue';
        type = 'warning';
      } else if (message.includes('403') || message.includes('forbidden')) {
        message = 'You do not have permission to perform this action';
      } else if (message.includes('404') || message.includes('not found')) {
        message = 'The requested resource was not found';
      } else if (message.includes('409') || message.includes('conflict')) {
        message = 'This action conflicts with existing data';
      } else if (message.includes('422') || message.includes('validation')) {
        message = 'Please check your input and try again';
      } else if (message.includes('500') || message.includes('server error')) {
        message = 'Server error. Please try again later';
      }

      addToast({
        type,
        title: 'Error',
        message,
        duration: 5000,
      });

      console.error('API Error:', error);
    },
    [addToast]
  );

  const handleSuccess = useCallback(
    (message: string, title: string = 'Success') => {
      addToast({
        type: 'success',
        title,
        message,
        duration: 3000,
      });
    },
    [addToast]
  );

  return {
    handleError,
    handleSuccess,
  };
}
