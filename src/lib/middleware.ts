import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest, verifyToken } from './auth';
import { prisma } from './prisma';
import { User } from '@/types';
import { createErrorResponse } from './errors';

/**
 * Get current user from request
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<User | null> {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    // Convert null to undefined for type compatibility
    return {
      ...user,
      name: user.name || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Higher-order function to protect API routes
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: { user: User; params: Record<string, string> }
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    context: {
      params: Record<string, string> | Promise<Record<string, string>>;
    }
  ) => {
    try {
      const user = await getCurrentUser(request);

      if (!user) {
        return createErrorResponse('Authentication required', 401);
      }

      // Handle both sync and async params
      const resolvedParams = await context.params;
      return handler(request, { ...context, params: resolvedParams, user });
    } catch (error) {
      console.error('Auth middleware error:', error);
      return createErrorResponse('Authentication failed', 401);
    }
  };
}

/**
 * Higher-order function for optional authentication (public endpoints)
 * Provides user if authenticated, null if not
 */
export function withOptionalAuth(
  handler: (
    request: NextRequest,
    context: { user: User | null; params: Record<string, string> }
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    context: {
      params: Record<string, string> | Promise<Record<string, string>>;
    }
  ) => {
    try {
      const user = await getCurrentUser(request);

      // Handle both sync and async params
      const resolvedParams = await context.params;
      return handler(request, { ...context, params: resolvedParams, user });
    } catch (error) {
      console.error('Optional auth middleware error:', error);
      // For public endpoints, continue even if auth fails
      const resolvedParams = await context.params;
      return handler(request, {
        ...context,
        params: resolvedParams,
        user: null,
      });
    }
  };
}

/**
 * Middleware to verify JWT token without requiring user lookup
 */
export function withTokenVerification<T = unknown>(
  handler: (
    request: NextRequest,
    context: { userId: string; params: Record<string, string> }
  ) => Promise<NextResponse<T>>
) {
  return async (
    request: NextRequest,
    context: { params: Record<string, string> }
  ) => {
    try {
      const authHeader = request.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return createErrorResponse('Authorization header required', 401);
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (!decoded) {
        return createErrorResponse('Invalid or expired token', 401);
      }

      return handler(request, { ...context, userId: decoded.userId });
    } catch (error) {
      console.error('Token verification error:', error);
      return createErrorResponse('Token verification failed', 401);
    }
  };
}

/**
 * CORS headers for API routes
 */
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // Allow all origins for development
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Handle CORS preflight requests
 */
export function handleCors(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: getCorsHeaders(),
    });
  }
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse) {
  const headers = getCorsHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
