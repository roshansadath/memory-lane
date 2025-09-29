'use client';

import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/components/home/HomePage';
import { MemoryLane } from '@/types';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
  const router = useRouter();

  const handleLaneClick = (lane: MemoryLane) => {
    router.push(`/lanes/${lane.id}`);
  };

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Explore Memory Lanes
            </h1>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              Discover memory lanes shared by the community
            </p>
          </div>

          <HomePage onLaneClick={handleLaneClick} />
        </div>
      </div>
    </Layout>
  );
}
