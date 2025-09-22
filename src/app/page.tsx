'use client';

import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/components/home/HomePage';
import { MemoryLane } from '@/types';

export default function Home() {
  const handleLaneClick = (lane: MemoryLane) => {
    console.log('Clicked lane:', lane.title);
    // TODO: Navigate to lane detail page
    // router.push(`/lane/${lane.slug}`);
  };

  return (
    <Layout>
      <HomePage onLaneClick={handleLaneClick} />
    </Layout>
  );
}
