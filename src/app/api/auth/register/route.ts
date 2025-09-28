import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  ConflictError,
} from '@/lib/errors';
import { handleCors, addCorsHeaders } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    // Handle CORS
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        validationResult.error.issues
      );
    }

    const { email, password, name } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    const response = createSuccessResponse(
      { user, token },
      'User registered successfully',
      201
    );

    return addCorsHeaders(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request);
}
