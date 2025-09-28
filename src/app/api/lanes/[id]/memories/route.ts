import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, withOptionalAuth } from '@/lib/middleware';
import {
  createSuccessResponse,
  handleApiError,
  NotFoundError,
} from '@/lib/errors';
import { createMemorySchema } from '@/lib/validations';
import {
  parsePaginationParams,
  calculatePaginationMeta,
  getSortParams,
} from '@/lib/pagination';
import { User } from '@/types';

/**
 * GET /api/lanes/[id]/memories - Get memories for a specific lane (public)
 */
export const GET = withOptionalAuth(
  async (
    request: NextRequest,
    context: { user: User | null; params: Record<string, string> }
  ) => {
    try {
      const { id: laneId } = await context.params;
      const { searchParams } = new URL(request.url);
      const { page, limit, offset } = parsePaginationParams(searchParams);
      const { sortBy, sortOrder } = getSortParams(searchParams);

      // Verify lane exists (no user ownership check for public access)
      const lane = await prisma.memoryLane.findUnique({
        where: {
          id: laneId,
        },
      });

      if (!lane) {
        throw new NotFoundError('Memory lane not found');
      }

      // Get total count for pagination
      const total = await prisma.memory.count({
        where: { laneId },
      });

      // Get memories with pagination
      const memories = await prisma.memory.findMany({
        where: { laneId },
        include: {
          images: {
            orderBy: { sortIndex: 'asc' },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      });

      const pagination = calculatePaginationMeta(page, limit, total);

      return createSuccessResponse({
        data: memories,
        pagination,
      });
    } catch (error) {
      return handleApiError(error);
    }
  }
);

/**
 * POST /api/lanes/[id]/memories - Create a new memory in a lane
 */
export const POST = withAuth(
  async (
    request: NextRequest,
    { user, params }: { user: User; params: Record<string, string> }
  ) => {
    try {
      const { id: laneId } = await params;
      const body = await request.json();

      // Validate input
      const validationResult = createMemorySchema.safeParse(body);
      if (!validationResult.success) {
        return handleApiError(validationResult.error);
      }

      const {
        title,
        description,
        occurredAt,
        images = [],
      } = validationResult.data;

      // Verify lane exists and user owns it
      const lane = await prisma.memoryLane.findFirst({
        where: {
          id: laneId,
          userId: user.id,
        },
      });

      if (!lane) {
        throw new NotFoundError('Memory lane not found');
      }

      // Get the next sort index
      const lastMemory = await prisma.memory.findFirst({
        where: { laneId },
        orderBy: { sortIndex: 'desc' },
      });

      const sortIndex = lastMemory ? lastMemory.sortIndex + 1 : 0;

      // Create memory
      const memory = await prisma.memory.create({
        data: {
          laneId,
          title,
          description,
          occurredAt: new Date(occurredAt),
          sortIndex,
        },
        include: {
          images: {
            orderBy: { sortIndex: 'asc' },
          },
        },
      });

      // Create memory images if provided
      if (images.length > 0) {
        await prisma.memoryImage.createMany({
          data: images.map((url, index) => ({
            memoryId: memory.id,
            url,
            sortIndex: index,
          })),
        });

        // Fetch updated memory with images
        const updatedMemory = await prisma.memory.findUnique({
          where: { id: memory.id },
          include: {
            images: {
              orderBy: { sortIndex: 'asc' },
            },
          },
        });

        return createSuccessResponse(
          updatedMemory,
          'Memory created successfully',
          201
        );
      }

      return createSuccessResponse(memory, 'Memory created successfully', 201);
    } catch (error) {
      return handleApiError(error);
    }
  }
);
