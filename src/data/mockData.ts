import { MemoryLane, Memory, MemoryImage, Tag, LaneTag } from '@/types';

// Mock Tags
export const mockTags: Tag[] = [
  { id: '1', name: 'Travel', lanes: [] },
  { id: '2', name: 'Family', lanes: [] },
  { id: '3', name: 'Work', lanes: [] },
  { id: '4', name: 'Adventures', lanes: [] },
  { id: '5', name: 'Memories', lanes: [] },
  { id: '6', name: 'Holidays', lanes: [] },
];

// Mock Memory Images
export const mockMemoryImages: MemoryImage[] = [
  {
    id: 'img1',
    memoryId: 'mem1',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Mountain landscape',
    sortIndex: 0,
  },
  {
    id: 'img2',
    memoryId: 'mem1',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    alt: 'Forest path',
    sortIndex: 1,
  },
  {
    id: 'img3',
    memoryId: 'mem2',
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    alt: 'Beach sunset',
    sortIndex: 0,
  },
  {
    id: 'img4',
    memoryId: 'mem3',
    url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
    alt: 'City skyline',
    sortIndex: 0,
  },
  {
    id: 'img5',
    memoryId: 'mem4',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    alt: 'Forest lake',
    sortIndex: 0,
  },
  {
    id: 'img6',
    memoryId: 'mem5',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Mountain peak',
    sortIndex: 0,
  },
];

// Mock Memories
export const mockMemories: Memory[] = [
  {
    id: 'mem1',
    laneId: 'lane1',
    title: 'Hiking Adventure',
    description: 'An amazing day hiking through the mountains with friends',
    occurredAt: new Date('2024-01-15'),
    sortIndex: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    images: mockMemoryImages.filter(img => img.memoryId === 'mem1'),
  },
  {
    id: 'mem2',
    laneId: 'lane1',
    title: 'Beach Sunset',
    description: 'Beautiful sunset at the beach with family',
    occurredAt: new Date('2024-02-20'),
    sortIndex: 1,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    images: mockMemoryImages.filter(img => img.memoryId === 'mem2'),
  },
  {
    id: 'mem3',
    laneId: 'lane2',
    title: 'City Exploration',
    description: 'Exploring the downtown area and trying new restaurants',
    occurredAt: new Date('2024-03-10'),
    sortIndex: 0,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    images: mockMemoryImages.filter(img => img.memoryId === 'mem3'),
  },
  {
    id: 'mem4',
    laneId: 'lane2',
    title: 'Nature Walk',
    description: 'Peaceful walk through the forest preserve',
    occurredAt: new Date('2024-03-25'),
    sortIndex: 1,
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-25'),
    images: mockMemoryImages.filter(img => img.memoryId === 'mem4'),
  },
  {
    id: 'mem5',
    laneId: 'lane3',
    title: 'Mountain Climbing',
    description: 'Challenging but rewarding climb to the summit',
    occurredAt: new Date('2024-04-05'),
    sortIndex: 0,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
    images: mockMemoryImages.filter(img => img.memoryId === 'mem5'),
  },
];

// Mock Lane Tags (relationships)
export const mockLaneTags: LaneTag[] = [
  { laneId: 'lane1', tagId: '1', tag: mockTags[0] }, // Travel
  { laneId: 'lane1', tagId: '4', tag: mockTags[3] }, // Adventures
  { laneId: 'lane2', tagId: '2', tag: mockTags[1] }, // Family
  { laneId: 'lane2', tagId: '5', tag: mockTags[4] }, // Memories
  { laneId: 'lane3', tagId: '1', tag: mockTags[0] }, // Travel
  { laneId: 'lane3', tagId: '4', tag: mockTags[3] }, // Adventures
  { laneId: 'lane4', tagId: '3', tag: mockTags[2] }, // Work
  { laneId: 'lane4', tagId: '5', tag: mockTags[4] }, // Memories
  { laneId: 'lane5', tagId: '6', tag: mockTags[5] }, // Holidays
  { laneId: 'lane5', tagId: '2', tag: mockTags[1] }, // Family
];

// Mock Memory Lanes
export const mockMemoryLanes: MemoryLane[] = [
  {
    id: 'lane1',
    userId: 'user1',
    slug: 'summer-adventures-2024',
    title: 'Summer Adventures 2024',
    description: 'All the amazing outdoor adventures from summer 2024',
    coverImageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-01'),
    memories: mockMemories.filter(mem => mem.laneId === 'lane1'),
    tags: mockLaneTags.filter(lt => lt.laneId === 'lane1').map(lt => lt.tag),
  },
  {
    id: 'lane2',
    userId: 'user1',
    slug: 'family-moments',
    title: 'Family Moments',
    description: 'Precious memories with family and loved ones',
    coverImageUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-30'),
    memories: mockMemories.filter(mem => mem.laneId === 'lane2'),
    tags: mockLaneTags.filter(lt => lt.laneId === 'lane2').map(lt => lt.tag),
  },
  {
    id: 'lane3',
    userId: 'user2',
    slug: 'mountain-expeditions',
    title: 'Mountain Expeditions',
    description: 'Challenging climbs and breathtaking mountain views',
    coverImageUrl:
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-04-10'),
    memories: mockMemories.filter(mem => mem.laneId === 'lane3'),
    tags: mockLaneTags.filter(lt => lt.laneId === 'lane3').map(lt => lt.tag),
  },
  {
    id: 'lane4',
    userId: 'user1',
    slug: 'work-milestones',
    title: 'Work Milestones',
    description: 'Important achievements and career highlights',
    coverImageUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-15'),
    memories: [],
    tags: mockLaneTags.filter(lt => lt.laneId === 'lane4').map(lt => lt.tag),
  },
  {
    id: 'lane5',
    userId: 'user2',
    slug: 'holiday-celebrations',
    title: 'Holiday Celebrations',
    description: 'Special moments from holidays and celebrations',
    coverImageUrl:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-28'),
    memories: [],
    tags: mockLaneTags.filter(lt => lt.laneId === 'lane5').map(lt => lt.tag),
  },
];

// Helper function to get lanes by tag
export function getLanesByTag(tagId: string): MemoryLane[] {
  return mockMemoryLanes.filter(lane =>
    lane.tags.some(tag => tag.id === tagId)
  );
}

// Helper function to get all tags with their lanes
export function getTagsWithLanes(): Array<
  Omit<Tag, 'lanes'> & { lanes: MemoryLane[] }
> {
  return mockTags.map(tag => ({
    id: tag.id,
    name: tag.name,
    lanes: getLanesByTag(tag.id),
  }));
}

// Helper function to get lane by slug
export function getLaneBySlug(slug: string): MemoryLane | undefined {
  return mockMemoryLanes.find(lane => lane.slug === slug);
}

// Helper function to get memory count for a lane
export function getMemoryCount(laneId: string): number {
  return mockMemories.filter(mem => mem.laneId === laneId).length;
}
