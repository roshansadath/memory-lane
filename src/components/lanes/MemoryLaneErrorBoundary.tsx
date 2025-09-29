'use client';

import { Component, ReactNode, memo } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface MemoryLaneErrorBoundaryProps {
  children: ReactNode;
  className?: string;
  error?: Error;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showRetry?: boolean;
  showGoHome?: boolean;
  customMessage?: string;
}

interface MemoryLaneErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class MemoryLaneErrorBoundary extends Component<
  MemoryLaneErrorBoundaryProps,
  MemoryLaneErrorBoundaryState
> {
  constructor(props: MemoryLaneErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): MemoryLaneErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MemoryLaneErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError || this.props.error) {
      const error = this.state.error || this.props.error;

      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={cn(
            'min-h-screen bg-gray-50 dark:bg-gray-900',
            this.props.className
          )}
        >
          <ResponsiveContainer className='py-12'>
            <div className='text-center max-w-md mx-auto'>
              {/* Error Icon */}
              <div className='mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6'>
                <AlertTriangle className='w-8 h-8 text-red-600 dark:text-red-400' />
              </div>

              {/* Error Title */}
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Something went wrong
              </h2>

              {/* Error Message */}
              <p className='text-gray-600 dark:text-gray-300 mb-6'>
                {this.props.customMessage ||
                  error?.message ||
                  'An unexpected error occurred while loading the memory lane.'}
              </p>

              {/* Action Buttons */}
              <div className='space-y-3'>
                {this.props.showRetry !== false && (
                  <Button
                    onClick={this.handleRetry}
                    className='flex items-center gap-2'
                  >
                    <RefreshCw className='w-4 h-4' />
                    Try Again
                  </Button>
                )}

                {this.props.showGoHome !== false && (
                  <div>
                    <Button
                      variant='outline'
                      onClick={() => (window.location.href = '/')}
                    >
                      Go Home
                    </Button>
                  </div>
                )}
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className='mt-8 text-left'>
                  <summary className='cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'>
                    Error Details (Development)
                  </summary>
                  <pre className='mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-auto'>
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </ResponsiveContainer>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience components for different error scenarios
export const SimpleErrorBoundary = memo(function SimpleErrorBoundary({
  children,
  className,
}: Pick<MemoryLaneErrorBoundaryProps, 'children' | 'className'>) {
  return (
    <MemoryLaneErrorBoundary
      className={className}
      showRetry={false}
      customMessage='Something went wrong. Please refresh the page.'
    >
      {children}
    </MemoryLaneErrorBoundary>
  );
});

export const NetworkErrorBoundary = memo(function NetworkErrorBoundary({
  children,
  className,
}: Pick<MemoryLaneErrorBoundaryProps, 'children' | 'className'>) {
  return (
    <MemoryLaneErrorBoundary
      className={className}
      customMessage='Network error. Please check your connection and try again.'
    >
      {children}
    </MemoryLaneErrorBoundary>
  );
});
