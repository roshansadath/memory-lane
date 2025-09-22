'use client';

import { Header } from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
  onSearchClick?: () => void;
  onLoginClick?: () => void;
}

export function Layout({
  className,
  children,
  onSearchClick,
  onLoginClick,
}: LayoutProps) {
  const handleSearchClick = () => {
    console.log('Search clicked');
    // TODO: Open search modal or navigate to search page
    onSearchClick?.();
  };

  const handleLoginClick = () => {
    console.log('Login clicked');
    // TODO: Open login modal or navigate to login page
    onLoginClick?.();
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <Header
        onSearchClick={handleSearchClick}
        onLoginClick={handleLoginClick}
      />
      <main className='max-w-7xl mx-auto'>{children}</main>
    </div>
  );
}
