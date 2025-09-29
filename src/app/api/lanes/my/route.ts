import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import { createSuccessResponse, handleApiError } from '@/lib/errors';
import {
  parsePaginationParams,
  calculatePaginationMeta,
  getSearchTerm,
  getTagFilter,
  getSortParams,
} from '@/lib/pagination';
import { User } from '@/types';

/**
 * GET /api/lanes/my - Get current user's memory lanes with pagination and filtering
 */
export const GET = withAuth(
  async (request: NextRequest, { user }: { user: User }) => {
    try {
      const { searchParams } = new URL(request.url);
      const { page, limit, offset } = parsePaginationParams(searchParams);
      const search = getSearchTerm(searchParams);
      const tagId = getTagFilter(searchParams);
      const { sortBy, sortOrder } = getSortParams(searchParams);

      // Build where clause - filter by current user's ID
      const where: Record<string, unknown> = {
        userId: user.id,
      };

      // Add search filter
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Add tag filter
      if (tagId) {
        where.tags = {
          some: {
            tagId: tagId,
          },
        };
      }

      // Get total count for pagination
      const total = await prisma.memoryLane.count({ where });

      // Get lanes with pagination
      const lanes = await prisma.memoryLane.findMany({
        where,
        include: {
          memories: {
            select: {
              id: true,
              title: true,
              occurredAt: true,
            },
            orderBy: { occurredAt: 'desc' },
            take: 3, // Show only first 3 memories
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
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      });

      // Transform data for response
      const transformedLanes = lanes.map(
        (lane: {
          _count: { memories: number };
          tags: Array<{ tag: { id: string; name: string } }>;
          [key: string]: unknown;
        }) => ({
          ...lane,
          memoryCount: lane._count.memories,
          tags: lane.tags.map(
            (lt: { tag: { id: string; name: string } }) => lt.tag
          ),
        })
      );

      const pagination = calculatePaginationMeta(page, limit, total);

      return createSuccessResponse({
        data: transformedLanes,
        pagination,
      });
    } catch (error) {
      return handleApiError(error);
    }
  }
);
