import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/middleware';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
} from '@/lib/errors';
import { handleCors, addCorsHeaders } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // Handle CORS
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    // Get current user
    const user = await getCurrentUser(request);

    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }

    const response = createSuccessResponse(
      { user },
      'User data retrieved successfully'
    );

    return addCorsHeaders(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request);
}
