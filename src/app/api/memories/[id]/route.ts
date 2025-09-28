import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import {
  createSuccessResponse,
  handleApiError,
  NotFoundError,
} from '@/lib/errors';
import { updateMemorySchema } from '@/lib/validations';

/**
 * PUT /api/memories/[id] - Update a memory
 */
export const PUT = withAuth(async (request: NextRequest, { user, params }) => {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate input
    const validationResult = updateMemorySchema.safeParse(body);
    if (!validationResult.success) {
      return handleApiError(validationResult.error);
    }

    const { title, description, occurredAt, images } = validationResult.data;

    // Check if memory exists and user owns it
    const existingMemory = await prisma.memory.findFirst({
      where: {
        id,
        lane: {
          userId: user.id, // Ensure user owns the lane
        } as Record<string, unknown>,
      },
    });

    if (!existingMemory) {
      throw new NotFoundError('Memory not found');
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (occurredAt !== undefined) updateData.occurredAt = new Date(occurredAt);

    // Update the memory
    const updatedMemory = await prisma.memory.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          orderBy: { sortIndex: 'asc' },
        },
      },
    });

    // Update images if provided
    if (images !== undefined) {
      // Remove existing images
      await prisma.memoryImage.deleteMany({
        where: { memoryId: id },
      });

      // Add new images
      if (images.length > 0) {
        await prisma.memoryImage.createMany({
          data: images.map((url, index) => ({
            memoryId: id,
            url,
            sortIndex: index,
          })),
        });
      }

      // Fetch updated memory with images
      const finalMemory = await prisma.memory.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: { sortIndex: 'asc' },
          },
        },
      });

      return createSuccessResponse(finalMemory, 'Memory updated successfully');
    }

    return createSuccessResponse(updatedMemory, 'Memory updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
});

/**
 * DELETE /api/memories/[id] - Delete a memory
 */
export const DELETE = withAuth(
  async (request: NextRequest, { user, params }) => {
    try {
      const { id } = params;

      // Check if memory exists and user owns it
      const memory = await prisma.memory.findFirst({
        where: {
          id,
          lane: {
            userId: user.id, // Ensure user owns the lane
          } as Record<string, unknown>,
        },
      });

      if (!memory) {
        throw new NotFoundError('Memory not found');
      }

      // Delete the memory (cascade will handle images)
      await prisma.memory.delete({
        where: { id },
      });

      return createSuccessResponse(null, 'Memory deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  }
);
