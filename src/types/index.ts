// TypeScript interfaces based on Prisma schema from README.md

export interface MemoryLane {
  id: string;
  slug: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  memories: Memory[];
  tags: Tag[]; // Changed from LaneTag[] to Tag[] to match API response
}

export interface Memory {
  id: string;
  laneId: string;
  title: string;
  description?: string;
  occurredAt: Date;
  sortIndex: number;
  createdAt: Date;
  updatedAt: Date;
  lane?: MemoryLane; // Made optional to avoid circular references in mock data
  images: MemoryImage[];
}

export interface MemoryImage {
  id: string;
  memoryId: string;
  url: string;
  alt?: string;
  sortIndex: number;
  memory?: Memory; // Made optional to avoid circular references in mock data
}

export interface Tag {
  id: string;
  name: string;
  lanes: LaneTag[];
}

export interface LaneTag {
  laneId: string;
  tagId: string;
  lane?: MemoryLane; // Made optional to avoid circular references in mock data
  tag: Tag;
}

// Additional types for UI components
export interface LaneCardProps {
  lane: MemoryLane;
  onClick?: (lane: MemoryLane) => void;
}

export interface LaneCarouselProps {
  lanes: MemoryLane[];
  title: string;
  onLaneClick?: (lane: MemoryLane) => void;
}

export interface TagSectionProps {
  tag: Tag;
  lanes: MemoryLane[];
  onLaneClick?: (lane: MemoryLane) => void;
}

// Type for tags with their associated lanes
export type TagWithLanes = Omit<Tag, 'lanes'> & { lanes: MemoryLane[] };

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface CreateMemoryLaneForm {
  title: string;
  description?: string;
  coverImageUrl?: string;
  tagIds: string[];
}

export interface CreateMemoryForm {
  laneId: string;
  title: string;
  description?: string;
  occurredAt: Date;
  images: File[];
}

export interface CreateTagForm {
  name: string;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}
