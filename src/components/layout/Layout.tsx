'use client';

import { Header } from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
  onSearchClick?: () => void;
}

export function Layout({ className, children, onSearchClick }: LayoutProps) {
  const handleSearchClick = () => {
    console.log('Search clicked');
    // TODO: Open search modal or navigate to search page
    onSearchClick?.();
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <Header onSearchClick={handleSearchClick} />
      <main className='max-w-7xl mx-auto'>{children}</main>
    </div>
  );
}
