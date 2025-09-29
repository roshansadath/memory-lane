'use client';

import { Header } from './Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
  onSearchClick?: () => void;
}

export function Layout({ className, children, onSearchClick }: LayoutProps) {
  const { isOpen, defaultTab, closeModal, redirectAfterAuth } = useAuthModal();

  const handleSearchClick = () => {
    console.log('Search clicked');
    // TODO: Open search modal or navigate to search page
    onSearchClick?.();
  };

  return (
    <div className={cn('min-h-screen', className)}>
      <Header onSearchClick={handleSearchClick} />
      <main>{children}</main>

      <AuthModal
        isOpen={isOpen}
        onClose={closeModal}
        defaultTab={defaultTab}
        redirectAfterAuth={redirectAfterAuth}
      />
    </div>
  );
}
