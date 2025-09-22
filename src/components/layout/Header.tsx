'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, Search, User } from 'lucide-react';

interface HeaderProps {
  className?: string;
  onSearchClick?: () => void;
  onLoginClick?: () => void;
}

export function Header({
  className,
  onSearchClick,
  onLoginClick,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

            <Button
              variant='outline'
              onClick={onLoginClick}
              className='flex items-center space-x-2'
            >
              <User className='w-4 h-4' />
              <span>Login</span>
            </Button>
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
                <Button
                  variant='outline'
                  onClick={() => {
                    onLoginClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className='w-full justify-center space-x-2'
                >
                  <User className='w-4 h-4' />
                  <span>Login</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
