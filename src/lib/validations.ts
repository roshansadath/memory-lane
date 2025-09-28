import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .optional();

/**
 * User registration validation schema
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    name: nameSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Memory lane creation validation schema
 */
export const createMemoryLaneSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  coverImageUrl: z.string().url('Please enter a valid URL').optional(),
  tagIds: z.array(z.string()).optional().default([]),
});

/**
 * Memory creation validation schema
 */
export const createMemorySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  occurredAt: z.string().datetime('Please enter a valid date').or(z.date()),
  images: z.array(z.string()).optional().default([]),
});

/**
 * Tag creation validation schema
 */
export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be less than 50 characters'),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color')
    .optional()
    .default('#3B82F6'),
});

/**
 * Memory lane update validation schema
 */
export const updateMemoryLaneSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  coverImageUrl: z.string().url('Please enter a valid URL').optional(),
  tagIds: z.array(z.string()).optional(),
});

/**
 * Memory update validation schema
 */
export const updateMemorySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  occurredAt: z
    .string()
    .datetime('Please enter a valid date')
    .or(z.date())
    .optional(),
  images: z.array(z.string()).optional(),
});

/**
 * Tag update validation schema
 */
export const updateTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be less than 50 characters')
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color')
    .optional(),
});

/**
 * Pagination query validation schema
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .refine(n => n > 0, 'Page must be positive')
    .optional()
    .default(1),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine(n => n > 0 && n <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default(10),
  search: z.string().optional(),
  tagId: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Type exports for use in API routes
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateMemoryLaneInput = z.infer<typeof createMemoryLaneSchema>;
export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateMemoryLaneInput = z.infer<typeof updateMemoryLaneSchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
