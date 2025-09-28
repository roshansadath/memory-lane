'use client';

import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useForm<T extends z.ZodType>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>
) {
  const form = useReactHookForm({
    // @ts-expect-error - Complex generic type constraints between Zod and React Hook Form
    resolver: zodResolver(schema as z.ZodSchema<Record<string, unknown>>),
    defaultValues: defaultValues as Record<string, unknown>,
  });

  return form;
}

export function useFormWithValidation<T extends z.ZodType>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>
) {
  const form = useForm(schema, defaultValues);

  const handleSubmit = (onSubmit: (data: z.infer<T>) => void) => {
    return form.handleSubmit(
      onSubmit as (data: Record<string, unknown>) => void
    );
  };

  const getFieldError = (fieldName: keyof z.infer<T>) => {
    const errors = form.formState.errors as Partial<
      Record<keyof z.infer<T>, { message?: string }>
    >;
    return errors[fieldName]?.message as string | undefined;
  };

  const isFieldValid = (fieldName: keyof z.infer<T>) => {
    const errors = form.formState.errors as Partial<
      Record<keyof z.infer<T>, unknown>
    >;
    return !errors[fieldName];
  };

  const isFormValid = form.formState.isValid;

  return {
    ...form,
    handleSubmit,
    getFieldError,
    isFieldValid,
    isFormValid,
  };
}

export function createFormSchema<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape);
}

export function validateFormData<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: boolean; data?: z.infer<T>; errors?: z.ZodError } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}
