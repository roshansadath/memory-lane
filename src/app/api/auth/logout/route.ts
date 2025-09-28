import { NextRequest } from 'next/server';
import { createSuccessResponse, handleApiError } from '@/lib/errors';
import { handleCors, addCorsHeaders } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    // Handle CORS
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    // For MVP, we don't need to blacklist tokens
    // The client should simply remove the token from storage
    // In a production app, you might want to maintain a token blacklist

    const response = createSuccessResponse(null, 'Logged out successfully');

    return addCorsHeaders(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request);
}
