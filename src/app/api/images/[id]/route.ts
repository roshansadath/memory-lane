import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import {
  createSuccessResponse,
  handleApiError,
  NotFoundError,
} from '@/lib/errors';
import { deleteImage } from '@/lib/images';
import { User } from '@/types';

/**
 * DELETE /api/images/[id] - Delete a memory image
 */
export const DELETE = withAuth(
  async (
    request: NextRequest,
    { user, params }: { user: User; params: Record<string, string> }
  ) => {
    try {
      const { id: imageId } = params;

      // Check if image exists and user owns it
      const image = await prisma.memoryImage.findFirst({
        where: {
          id: imageId,
          memory: {
            lane: {
              userId: user.id, // Ensure user owns the lane
            } as Record<string, unknown>,
          },
        },
      });

      if (!image) {
        throw new NotFoundError('Image not found');
      }

      // Delete image file (placeholder implementation)
      await deleteImage(imageId);

      // Delete image record
      await prisma.memoryImage.delete({
        where: { id: imageId },
      });

      return createSuccessResponse(null, 'Image deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  }
);
