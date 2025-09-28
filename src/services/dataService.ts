import { MemoryLane, Memory, Tag, TagWithLanes, ApiResponse } from '@/types';
import {
  mockMemoryLanes,
  mockTags,
  mockMemories,
  getLanesByTag,
  getTagsWithLanes,
  getLaneBySlug,
} from '@/data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class DataService {
  // Memory Lanes
  static async getAllMemoryLanes(): Promise<ApiResponse<MemoryLane[]>> {
    await delay(300); // Simulate API call
    return {
      data: mockMemoryLanes,
      success: true,
    };
  }

  static async getMemoryLaneBySlug(
    slug: string
  ): Promise<ApiResponse<MemoryLane | null>> {
    await delay(200);
    const lane = getLaneBySlug(slug);
    return {
      data: lane || null,
      success: !!lane,
      message: lane ? undefined : 'Memory lane not found',
    };
  }

  static async getMemoryLanesByTag(
    tagId: string
  ): Promise<ApiResponse<MemoryLane[]>> {
    await delay(250);
    const lanes = getLanesByTag(tagId);
    return {
      data: lanes,
      success: true,
    };
  }

  // Tags
  static async getAllTags(): Promise<ApiResponse<Tag[]>> {
    await delay(200);
    return {
      data: mockTags,
      success: true,
    };
  }

  static async getTagsWithLanes(): Promise<ApiResponse<TagWithLanes[]>> {
    await delay(300);
    const tagsWithLanes = getTagsWithLanes();
    return {
      data: tagsWithLanes,
      success: true,
    };
  }

  // Memories
  static async getMemoriesByLaneId(
    laneId: string
  ): Promise<ApiResponse<Memory[]>> {
    await delay(200);
    const memories = mockMemories.filter(mem => mem.laneId === laneId);
    return {
      data: memories,
      success: true,
    };
  }

  // Home page specific data
  static async getHomePageData(): Promise<
    ApiResponse<{
      tagsWithLanes: TagWithLanes[];
      featuredLanes: MemoryLane[];
    }>
  > {
    await delay(400);

    const tagsWithLanes = getTagsWithLanes();
    const featuredLanes = mockMemoryLanes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6); // Top 6 most recently updated lanes

    return {
      data: {
        tagsWithLanes,
        featuredLanes,
      },
      success: true,
    };
  }

  // Search functionality
  static async searchMemoryLanes(
    query: string
  ): Promise<ApiResponse<MemoryLane[]>> {
    await delay(300);
    const searchTerm = query.toLowerCase();
    const results = mockMemoryLanes.filter(
      lane =>
        lane.title.toLowerCase().includes(searchTerm) ||
        lane.description?.toLowerCase().includes(searchTerm) ||
        lane.tags.some(tag => tag.name.toLowerCase().includes(searchTerm))
    );

    return {
      data: results,
      success: true,
    };
  }

  // Statistics
  static async getLaneStats(laneId: string): Promise<
    ApiResponse<{
      memoryCount: number;
      totalImages: number;
      dateRange: { start: Date; end: Date } | null;
    }>
  > {
    await delay(150);

    const memories = mockMemories.filter(mem => mem.laneId === laneId);
    const memoryCount = memories.length;
    const totalImages = memories.reduce(
      (sum, mem) => sum + mem.images.length,
      0
    );

    let dateRange = null;
    if (memories.length > 0) {
      const dates = memories.map(mem => mem.occurredAt);
      dateRange = {
        start: new Date(Math.min(...dates.map(d => d.getTime()))),
        end: new Date(Math.max(...dates.map(d => d.getTime()))),
      };
    }

    return {
      data: {
        memoryCount,
        totalImages,
        dateRange,
      },
      success: true,
    };
  }
}
