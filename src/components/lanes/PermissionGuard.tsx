'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lock, LogIn, User } from 'lucide-react';
import { memo } from 'react';

interface PermissionGuardProps {
  children: ReactNode;
  isOwner?: boolean;
  requireAuth?: boolean;
  requireOwnership?: boolean;
  fallback?: ReactNode;
  className?: string;
  redirectAfterAuth?: string;
}

interface LoginPromptProps {
  redirectAfterAuth?: string;
  className?: string;
}

const LoginPrompt = memo(function LoginPrompt({
  redirectAfterAuth,
  className,
}: LoginPromptProps) {
  const { openModal, setRedirectAfterAuth } = useAuthModal();

  const handleSignInClick = () => {
    if (redirectAfterAuth) {
      setRedirectAfterAuth(redirectAfterAuth);
    }
    openModal('login');
  };

  const handleSignUpClick = () => {
    if (redirectAfterAuth) {
      setRedirectAfterAuth(redirectAfterAuth);
    }
    openModal('register');
  };

  return (
    <Card
      className={cn(
        'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
        className
      )}
    >
      <CardContent className='p-6 text-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center'>
            <Lock className='w-6 h-6 text-amber-600 dark:text-amber-400' />
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-amber-900 dark:text-amber-100'>
              Authentication Required
            </h3>
            <p className='text-sm text-amber-700 dark:text-amber-200'>
              Please sign in to access this feature
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <Button
              onClick={handleSignInClick}
              className='bg-amber-600 hover:bg-amber-700 text-white'
            >
              <LogIn className='w-4 h-4 mr-2' />
              Sign In
            </Button>
            <Button
              onClick={handleSignUpClick}
              variant='outline'
              className='border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/20'
            >
              <User className='w-4 h-4 mr-2' />
              Create Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

const OwnershipPrompt = memo(function OwnershipPrompt({
  redirectAfterAuth,
  className,
}: LoginPromptProps) {
  const { openModal, setRedirectAfterAuth } = useAuthModal();

  const handleSignInClick = () => {
    if (redirectAfterAuth) {
      setRedirectAfterAuth(redirectAfterAuth);
    }
    openModal('login');
  };

  return (
    <Card
      className={cn(
        'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
        className
      )}
    >
      <CardContent className='p-6 text-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center'>
            <Lock className='w-6 h-6 text-red-600 dark:text-red-400' />
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-red-900 dark:text-red-100'>
              Access Denied
            </h3>
            <p className='text-sm text-red-700 dark:text-red-200'>
              You don&apos;t have permission to perform this action. This memory
              lane belongs to someone else.
            </p>
          </div>

          <Button
            onClick={handleSignInClick}
            variant='outline'
            className='border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20'
          >
            <LogIn className='w-4 h-4 mr-2' />
            Sign In with Different Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export const PermissionGuard = memo(function PermissionGuard({
  children,
  isOwner = false,
  requireAuth = false,
  requireOwnership = false,
  fallback,
  className,
  redirectAfterAuth,
}: PermissionGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className='h-20 bg-gray-200 dark:bg-gray-700 rounded-lg'></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      fallback || (
        <LoginPrompt
          redirectAfterAuth={redirectAfterAuth}
          className={className}
        />
      )
    );
  }

  // If ownership is required but user is not the owner
  if (requireOwnership && isAuthenticated && !isOwner) {
    return (
      fallback || (
        <OwnershipPrompt
          redirectAfterAuth={redirectAfterAuth}
          className={className}
        />
      )
    );
  }

  // If all conditions are met, render children
  return <div className={className}>{children}</div>;
});

// Convenience components for common use cases
export const AuthRequired = memo(function AuthRequired({
  children,
  fallback,
  className,
  redirectAfterAuth,
}: Omit<PermissionGuardProps, 'requireAuth' | 'requireOwnership' | 'isOwner'>) {
  return (
    <PermissionGuard
      requireAuth
      fallback={fallback}
      className={className}
      redirectAfterAuth={redirectAfterAuth}
    >
      {children}
    </PermissionGuard>
  );
});

export const OwnerOnly = memo(function OwnerOnly({
  children,
  isOwner,
  fallback,
  className,
  redirectAfterAuth,
}: Omit<PermissionGuardProps, 'requireAuth' | 'requireOwnership'>) {
  return (
    <PermissionGuard
      requireAuth
      requireOwnership
      isOwner={isOwner}
      fallback={fallback}
      className={className}
      redirectAfterAuth={redirectAfterAuth}
    >
      {children}
    </PermissionGuard>
  );
});

// Hook for checking permissions
export function usePermissions() {
  const { isAuthenticated, isLoading } = useAuth();

  // This would typically fetch lane data to check ownership
  // For now, we'll return a basic structure
  const isOwner = false; // This would be determined by comparing user.id with lane.userId

  return {
    isAuthenticated,
    isOwner,
    isLoading,
    canEdit: isAuthenticated && isOwner,
    canDelete: isAuthenticated && isOwner,
    canAdd: isAuthenticated && isOwner,
  };
}
