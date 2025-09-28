import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import {
  createSuccessResponse,
  handleApiError,
  NotFoundError,
} from '@/lib/errors';
import { uploadImages, validateImageFile } from '@/lib/images';
import { User } from '@/types';

/**
 * POST /api/memories/[id]/images - Upload images for a memory
 */
export const POST = withAuth(
  async (
    request: NextRequest,
    { user, params }: { user: User; params: Record<string, string> }
  ) => {
    try {
      const { id: memoryId } = await params;

      // Check if memory exists and user owns it
      const memory = await prisma.memory.findFirst({
        where: {
          id: memoryId,
          lane: {
            userId: user.id, // Ensure user owns the lane
          } as Record<string, unknown>,
        },
      });

      if (!memory) {
        throw new NotFoundError('Memory not found');
      }

      // Parse form data
      const formData = await request.formData();
      const files = formData.getAll('images') as File[];

      if (files.length === 0) {
        return handleApiError(new Error('No images provided'));
      }

      // Validate all files
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          return handleApiError(new Error(validation.error));
        }
      }

      // Upload images
      const uploadResults = await uploadImages(files);

      // Get current max sort index
      const lastImage = await prisma.memoryImage.findFirst({
        where: { memoryId },
        orderBy: { sortIndex: 'desc' },
      });

      const startSortIndex = lastImage ? lastImage.sortIndex + 1 : 0;

      // Create image records
      await prisma.memoryImage.createMany({
        data: uploadResults.map((result, index) => ({
          memoryId,
          url: result.url,
          sortIndex: startSortIndex + index,
        })),
      });

      // Fetch created images
      const createdImages = await prisma.memoryImage.findMany({
        where: { memoryId },
        orderBy: { sortIndex: 'asc' },
      });

      return createSuccessResponse(
        createdImages,
        'Images uploaded successfully',
        201
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
