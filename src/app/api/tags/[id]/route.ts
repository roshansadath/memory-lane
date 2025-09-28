import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import {
  createSuccessResponse,
  handleApiError,
  NotFoundError,
  ConflictError,
} from '@/lib/errors';
import { updateTagSchema } from '@/lib/validations';

/**
 * PUT /api/tags/[id] - Update a tag
 */
export const PUT = withAuth(
  async (
    request: NextRequest,
    { params }: { params: Record<string, string> }
  ) => {
    try {
      const { id } = params;
      const body = await request.json();

      // Validate input
      const validationResult = updateTagSchema.safeParse(body);
      if (!validationResult.success) {
        return handleApiError(validationResult.error);
      }

      const { name, color } = validationResult.data;

      // Check if tag exists
      const existingTag = await prisma.tag.findUnique({
        where: { id },
      });

      if (!existingTag) {
        throw new NotFoundError('Tag not found');
      }

      // Check for name conflict if name is being updated
      if (name && name !== existingTag.name) {
        const nameConflict = await prisma.tag.findUnique({
          where: { name },
        });

        if (nameConflict) {
          throw new ConflictError('Tag with this name already exists');
        }
      }

      // Prepare update data
      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (color !== undefined) updateData.color = color;

      // Update the tag
      const updatedTag = await prisma.tag.update({
        where: { id },
        data: updateData,
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
          ...updatedTag,
          laneCount: updatedTag._count.lanes,
        },
        'Tag updated successfully'
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);

/**
 * DELETE /api/tags/[id] - Delete a tag
 */
export const DELETE = withAuth(
  async (
    request: NextRequest,
    { params }: { params: Record<string, string> }
  ) => {
    try {
      const { id } = params;

      // Check if tag exists
      const tag = await prisma.tag.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              lanes: true,
            },
          },
        },
      });

      if (!tag) {
        throw new NotFoundError('Tag not found');
      }

      // Check if tag is being used by any lanes
      if (tag._count.lanes > 0) {
        throw new ConflictError(
          'Cannot delete tag that is being used by memory lanes'
        );
      }

      // Delete the tag
      await prisma.tag.delete({
        where: { id },
      });

      return createSuccessResponse(null, 'Tag deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  }
);
