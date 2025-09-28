import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, withOptionalAuth } from '@/lib/middleware';
import { createSuccessResponse, handleApiError } from '@/lib/errors';
import { createMemoryLaneSchema } from '@/lib/validations';
import { generateUniqueSlug } from '@/lib/slug';
import {
  parsePaginationParams,
  calculatePaginationMeta,
  getSearchTerm,
  getTagFilter,
  getSortParams,
} from '@/lib/pagination';
import { User } from '@/types';

/**
 * GET /api/lanes - Get all memory lanes with pagination and filtering (public)
 */
export const GET = withOptionalAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (request: NextRequest, _context: { user: User | null }) => {
    try {
      const { searchParams } = new URL(request.url);
      const { page, limit, offset } = parsePaginationParams(searchParams);
      const search = getSearchTerm(searchParams);
      const tagId = getTagFilter(searchParams);
      const { sortBy, sortOrder } = getSortParams(searchParams);

      // Build where clause - no user filtering for public access
      const where: Record<string, unknown> = {};

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

/**
 * POST /api/lanes - Create a new memory lane
 */
export const POST = withAuth(
  async (request: NextRequest, { user }: { user: User }) => {
    try {
      const body = await request.json();

      // Validate input
      const validationResult = createMemoryLaneSchema.safeParse(body);
      if (!validationResult.success) {
        return handleApiError(validationResult.error);
      }

      const {
        title,
        description,
        coverImageUrl,
        tagIds = [],
      } = validationResult.data;

      // Generate unique slug
      const slug = await generateUniqueSlug(title, user.id);

      // Create memory lane
      const lane = await prisma.memoryLane.create({
        data: {
          userId: user.id,
          title,
          slug,
          description,
          coverImageUrl,
        } as {
          userId: string;
          title: string;
          slug: string;
          description?: string;
          coverImageUrl?: string;
        },
        include: {
          memories: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      // Link tags if provided
      if (tagIds.length > 0) {
        await prisma.laneTag.createMany({
          data: tagIds.map(tagId => ({
            laneId: lane.id,
            tagId,
          })),
          skipDuplicates: true,
        });

        // Fetch updated lane with tags
        const updatedLane = await prisma.memoryLane.findUnique({
          where: { id: lane.id },
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
            ...updatedLane,
            tags:
              updatedLane?.tags.map(
                (lt: { tag: { id: string; name: string } }) => lt.tag
              ) || [],
          },
          'Memory lane created successfully',
          201
        );
      }

      return createSuccessResponse(
        {
          ...lane,
          tags:
            (lane as { tags?: Array<{ tag: unknown }> }).tags?.map(
              (lt: { tag: unknown }) => lt.tag
            ) || [],
        },
        'Memory lane created successfully',
        201
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
