import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  AuthError,
} from '@/lib/errors';
import { handleCors, addCorsHeaders } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    // Handle CORS
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    const body = await request.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        validationResult.error.issues
      );
    }

    const { email, password } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new AuthError('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = createSuccessResponse(
      { user: userData, token },
      'Login successful'
    );

    return addCorsHeaders(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request);
}
