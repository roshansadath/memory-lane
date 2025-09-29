'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { UserMenu } from '@/components/auth/UserMenu';

interface HeaderProps {
  className?: string;
  onSearchClick?: () => void;
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const { openModal } = useAuthModal();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAuthClick = (tab: 'login' | 'register') => {
    openModal(tab);
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
            <Link
              href='/'
              className='flex items-center space-x-3 hover:opacity-80 transition-opacity'
            >
              <div className='relative w-12 h-12'>
                <Image
                  src='/Logo.png'
                  alt='Memory Lane Logo'
                  fill
                  className='object-contain'
                  priority
                />
              </div>
              <span className='text-xl font-bold text-gray-900 dark:text-white'>
                Memory Lane
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href='/'
              className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
            >
              Home
            </Link>
            <Link
              href='/lanes'
              className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
            >
              My Lanes
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center space-x-4'>
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
              <Link
                href='/'
                className='block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href='/lanes'
                className='block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Lanes
              </Link>
              <Link
                href='/explore'
                className='block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
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
    </header>
  );
}
