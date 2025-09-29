'use client';

import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/components/home/HomePage';
import { MemoryLane } from '@/types';

export default function Home() {
  const router = useRouter();

  const handleLaneClick = (lane: MemoryLane) => {
    router.push(`/lanes/${lane.id}`);
  };

  return (
    <Layout>
      <HomePage onLaneClick={handleLaneClick} />
    </Layout>
  );
}
