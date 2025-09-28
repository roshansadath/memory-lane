import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, withOptionalAuth } from '@/lib/middleware';
import {
  createSuccessResponse,
  handleApiError,
  NotFoundError,
} from '@/lib/errors';
import { updateMemoryLaneSchema } from '@/lib/validations';
import { generateUniqueSlug } from '@/lib/slug';
import { User } from '@/types';

/**
 * GET /api/lanes/[id] - Get a specific memory lane (public)
 */
export const GET = withOptionalAuth(
  async (
    request: NextRequest,
    context: { user: User | null; params: Record<string, string> }
  ) => {
    try {
      const { id } = await context.params;

      const lane = await prisma.memoryLane.findUnique({
        where: {
          id,
        },
        include: {
          memories: {
            include: {
              images: {
                orderBy: { sortIndex: 'asc' },
              },
            },
            orderBy: { occurredAt: 'desc' },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              memories: true,
            },
          },
        },
      });

      if (!lane) {
        throw new NotFoundError('Memory lane not found');
      }

      return createSuccessResponse({
        ...lane,
        memoryCount: lane._count.memories,
        tags: lane.tags.map(
          (lt: { tag: { id: string; name: string } }) => lt.tag
        ),
      });
    } catch (error) {
      return handleApiError(error);
    }
  }
);

/**
 * PUT /api/lanes/[id] - Update a memory lane
 */
export const PUT = withAuth(
  async (
    request: NextRequest,
    { user, params }: { user: User; params: Record<string, string> }
  ) => {
    try {
      const { id } = await params;
      const body = await request.json();

      // Validate input
      const validationResult = updateMemoryLaneSchema.safeParse(body);
      if (!validationResult.success) {
        return handleApiError(validationResult.error);
      }

      const { title, description, coverImageUrl, tagIds } =
        validationResult.data;

      // Check if lane exists and user owns it
      const existingLane = await prisma.memoryLane.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!existingLane) {
        throw new NotFoundError('Memory lane not found');
      }

      // Prepare update data
      const updateData: Record<string, unknown> = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;

      // Generate new slug if title changed
      if (title && title !== existingLane.title) {
        updateData.slug = await generateUniqueSlug(title, user.id, id);
      }

      // Update the lane
      const updatedLane = await prisma.memoryLane.update({
        where: { id },
        data: updateData,
        include: {
          memories: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      // Update tags if provided
      if (tagIds !== undefined) {
        // Remove existing tags
        await prisma.laneTag.deleteMany({
          where: { laneId: id },
        });

        // Add new tags
        if (tagIds.length > 0) {
          await prisma.laneTag.createMany({
            data: tagIds.map(tagId => ({
              laneId: id,
              tagId,
            })),
            skipDuplicates: true,
          });
        }

        // Fetch updated lane with tags
        const finalLane = await prisma.memoryLane.findUnique({
          where: { id },
          include: {
            memories: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        });

        return createSuccessResponse(
          {
            ...finalLane,
            tags:
              finalLane?.tags.map(
                (lt: { tag: { id: string; name: string } }) => lt.tag
              ) || [],
          },
          'Memory lane updated successfully'
        );
      }

      return createSuccessResponse(
        {
          ...updatedLane,
          tags: updatedLane.tags.map(
            (lt: { tag: { id: string; name: string } }) => lt.tag
          ),
        },
        'Memory lane updated successfully'
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);

/**
 * DELETE /api/lanes/[id] - Delete a memory lane
 */
export const DELETE = withAuth(
  async (
    request: NextRequest,
    { user, params }: { user: User; params: Record<string, string> }
  ) => {
    try {
      const { id } = await params;

      // Check if lane exists and user owns it
      const lane = await prisma.memoryLane.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!lane) {
        throw new NotFoundError('Memory lane not found');
      }

      // Delete the lane (cascade will handle memories and images)
      await prisma.memoryLane.delete({
        where: { id },
      });

      return createSuccessResponse(null, 'Memory lane deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  }
);
