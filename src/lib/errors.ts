import { NextResponse } from 'next/server';

/**
 * Custom error classes for better error handling
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string,
    public statusCode: number = 404
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(
    message: string,
    public statusCode: number = 409
  ) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 400,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status: statusCode }
  );
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode }
  );
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof AuthError) {
    return createErrorResponse(error.message, error.statusCode);
  }

  if (error instanceof ValidationError) {
    return createErrorResponse(error.message, error.statusCode);
  }

  if (error instanceof NotFoundError) {
    return createErrorResponse(error.message, error.statusCode);
  }

  if (error instanceof ConflictError) {
    return createErrorResponse(error.message, error.statusCode);
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as {
      issues: Array<{ message: string; path: string[] }>;
    };
    const messages = zodError.issues.map(
      issue => `${issue.path.join('.')}: ${issue.message}`
    );
    return createErrorResponse('Validation failed', 400, { errors: messages });
  }

  // Generic error
  return createErrorResponse('An unexpected error occurred', 500);
}
