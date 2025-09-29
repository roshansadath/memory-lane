'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className='relative' ref={dropdownRef}>
      <Button
        variant='ghost'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 px-3 py-2'
      >
        <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium'>
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : user.email.charAt(0).toUpperCase()}
        </div>
        <span className='hidden sm:block text-sm font-medium'>
          {user.name || user.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </Button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
          <div className='px-4 py-2 border-b border-gray-100'>
            <p className='text-sm font-medium text-gray-900'>
              {user.name || 'User'}
            </p>
            <p className='text-sm text-gray-500'>{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
