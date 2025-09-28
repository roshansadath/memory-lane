'use client';

import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useForm<T extends z.ZodType>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>
) {
  const form = useReactHookForm({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
  });

  return form;
}

export function useFormWithValidation<T extends z.ZodType>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>
) {
  const form = useForm(schema, defaultValues);

  const handleSubmit = (onSubmit: (data: z.infer<T>) => void) => {
    return form.handleSubmit(onSubmit as any);
  };

  const getFieldError = (fieldName: keyof z.infer<T>) => {
    return (form.formState.errors as any)[fieldName]?.message as
      | string
      | undefined;
  };

  const isFieldValid = (fieldName: keyof z.infer<T>) => {
    return !(form.formState.errors as any)[fieldName];
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
