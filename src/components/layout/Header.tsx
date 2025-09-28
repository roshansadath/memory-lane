'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserMenu } from '@/components/auth/UserMenu';

interface HeaderProps {
  className?: string;
  onSearchClick?: () => void;
}

export function Header({ className, onSearchClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>(
    'login'
  );
  const { isAuthenticated, isLoading } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAuthClick = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <header
      className={cn(
        'bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50',
        className
      )}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>M</span>
              </div>
              <span className='text-xl font-bold text-gray-900 dark:text-white'>
                Memory Lane
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <a
              href='#'
              className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
            >
              Home
            </a>
            <a
              href='#'
              className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
            >
              My Lanes
            </a>
            <a
              href='#'
              className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
            >
              Explore
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={onSearchClick}
              className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            >
              <Search className='w-5 h-5' />
              <span className='sr-only'>Search</span>
            </Button>

            {isLoading ? (
              <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse' />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button
                  variant='ghost'
                  onClick={() => handleAuthClick('login')}
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => handleAuthClick('register')}
                  className='bg-blue-600 text-white hover:bg-blue-700'
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleMobileMenu}
              className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            >
              {isMobileMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t border-gray-200 dark:border-gray-700'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              <a
                href='#'
                className='block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href='#'
                className='block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Lanes
              </a>
              <a
                href='#'
                className='block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </a>
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                {isAuthenticated ? (
                  <div className='px-3 py-2'>
                    <UserMenu />
                  </div>
                ) : (
                  <>
                    <Button
                      variant='ghost'
                      onClick={() => {
                        handleAuthClick('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className='w-full justify-center'
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        handleAuthClick('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className='w-full justify-center mt-2 bg-blue-600 text-white hover:bg-blue-700'
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        defaultTab={authModalTab}
      />
    </header>
  );
}
