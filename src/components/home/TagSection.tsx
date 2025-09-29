'use client';

import { MemoryLane, TagWithLanes } from '@/types';
import { LaneCarousel } from './LaneCarousel';
import { cn } from '@/lib/utils';

interface TagSectionProps {
  tag: TagWithLanes;
  lanes: MemoryLane[];
  onLaneClick?: (lane: MemoryLane) => void;
  className?: string;
  isLoading?: boolean;
  showNavigation?: boolean;
}

export function TagSection({
  tag,
  lanes,
  onLaneClick,
  className,
  isLoading = false,
  showNavigation = true,
}: TagSectionProps) {
  if (isLoading) {
    return (
      <LaneCarousel
        lanes={[]}
        title={tag.name}
        onLaneClick={onLaneClick}
        className={className}
        isLoading={true}
        showNavigation={showNavigation}
      />
    );
  }

  if (lanes.length === 0) {
    return null; // Don't render empty sections
  }

  return (
    <div className={cn('relative', className)}>
      <LaneCarousel
        lanes={lanes}
        title={tag.name}
        onLaneClick={onLaneClick}
        isLoading={false}
        showNavigation={showNavigation}
      />
    </div>
  );
}
