'use client';

import React from 'react';
import { loginSchema, LoginInput } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';
import { useApiError } from '@/hooks/useApiError';
import { useFormWithValidation } from '@/hooks/useFormValidation';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { FormField, Input } from '@/components/forms/FormField';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const { handleError, handleSuccess } = useApiError();
  const form = useFormWithValidation(loginSchema);

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
      handleSuccess('Welcome back!');
      onSuccess?.();
    } catch (err) {
      handleError(err, 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField label='Email' error={form.getFieldError('email')} required>
            <Input
              {...form.register('email')}
              type='email'
              placeholder='Enter your email'
              error={!!form.getFieldError('email')}
            />
          </FormField>

          <FormField
            label='Password'
            error={form.getFieldError('password')}
            required
          >
            <Input
              {...form.register('password')}
              type='password'
              placeholder='Enter your password'
              error={!!form.getFieldError('password')}
            />
          </FormField>

          <AccessibleButton
            type='submit'
            loading={form.formState.isSubmitting}
            loadingText='Signing in...'
            className='w-full'
          >
            Sign In
          </AccessibleButton>

          {onSwitchToRegister && (
            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Don&apos;t have an account?{' '}
                <button
                  type='button'
                  onClick={onSwitchToRegister}
                  className='text-blue-600 hover:text-blue-500 font-medium'
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
