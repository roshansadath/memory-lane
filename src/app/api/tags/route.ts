import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, withOptionalAuth } from '@/lib/middleware';
import {
  createSuccessResponse,
  handleApiError,
  ConflictError,
} from '@/lib/errors';
import { createTagSchema } from '@/lib/validations';
import { getSearchTerm } from '@/lib/pagination';
import { User } from '@/types';

/**
 * GET /api/tags - Get all tags with optional search (public)
 */
export const GET = withOptionalAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (request: NextRequest, _context: { user: User | null }) => {
    try {
      const { searchParams } = new URL(request.url);
      const search = getSearchTerm(searchParams);

      // Build where clause
      const where: Record<string, unknown> = {};
      if (search) {
        where.name = {
          contains: search,
          mode: 'insensitive',
        };
      }

      // Get tags
      const tags = await prisma.tag.findMany({
        where,
        include: {
          _count: {
            select: {
              lanes: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      // Transform data for response
      const transformedTags = tags.map(
        (tag: { _count: { lanes: number }; [key: string]: unknown }) => ({
          ...tag,
          laneCount: tag._count.lanes,
        })
      );

      return createSuccessResponse(transformedTags);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

/**
 * POST /api/tags - Create a new tag
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createTagSchema.safeParse(body);
    if (!validationResult.success) {
      return handleApiError(validationResult.error);
    }

    const { name, color = '#3B82F6' } = validationResult.data;

    // Check if tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      throw new ConflictError('Tag with this name already exists');
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        name,
        color,
      },
      include: {
        _count: {
          select: {
            lanes: true,
          },
        },
      },
    });

    return createSuccessResponse(
      {
        ...tag,
        laneCount: tag._count.lanes,
      },
      'Tag created successfully',
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
});
