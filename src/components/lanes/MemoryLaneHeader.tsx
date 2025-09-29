'use client';

import { MemoryLane } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Tag,
  Heart,
  Share2,
  Check,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { PermissionGuard, OwnerOnly } from './PermissionGuard';
import { useToast } from '@/components/ui/Toast';
import { memo, useState } from 'react';

interface MemoryLaneHeaderProps {
  lane: MemoryLane;
  isOwner: boolean;
  className?: string;
  onEditLane?: () => void;
  onDeleteLane?: () => void;
}

export const MemoryLaneHeader = memo(function MemoryLaneHeader({
  lane,
  isOwner,
  className,
  onEditLane,
  onDeleteLane,
}: MemoryLaneHeaderProps) {
  const { openModal, setRedirectAfterAuth } = useAuthModal();
  const [isCopied, setIsCopied] = useState(false);
  const { addToast } = useToast();

  const memoryCount = lane.memories?.length || 0;
  const totalImages =
    lane.memories?.reduce(
      (sum, memory) => sum + (memory.images?.length || 0),
      0
    ) || 0;
  const tagNames = lane.tags?.map(tag => tag.name) || [];

  const handleDelete = () => {
    onDeleteLane?.();
  };

  const handleSignInClick = () => {
    setRedirectAfterAuth(`/lanes/${lane.id}`);
    openModal('login');
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/lanes/${lane.id}`;
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      addToast({
        type: 'success',
        title: 'Link Copied!',
        message: 'Memory lane link has been copied to your clipboard.',
        duration: 3000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = `${window.location.origin}/lanes/${lane.id}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        addToast({
          type: 'success',
          title: 'Link Copied!',
          message: 'Memory lane link has been copied to your clipboard.',
          duration: 3000,
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
        addToast({
          type: 'error',
          title: 'Copy Failed',
          message: 'Unable to copy link automatically. Please copy manually.',
          duration: 5000,
        });
        // Show a prompt with the URL as a last resort
        const userInput = prompt(
          'Copy this link manually:',
          `${window.location.origin}/lanes/${lane.id}`
        );
        if (userInput) {
          addToast({
            type: 'info',
            title: 'Link Ready',
            message: 'You can now paste the link wherever you need it.',
            duration: 3000,
          });
        }
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Hero Background with Gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' />

      {/* Cover Image Overlay */}
      {lane.coverImageUrl && (
        <div className='absolute inset-0'>
          <Image
            src={lane.coverImageUrl}
            alt={lane.title}
            fill
            className='object-cover opacity-30 dark:opacity-20'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
        </div>
      )}

      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      {/* Content */}
      <div className='relative z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-16 lg:py-24'>
            {/* Back Button */}
            <div className='mb-8'>
              <Link
                href='/'
                className='inline-flex items-center px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Home
              </Link>
            </div>

            {/* Main Content */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-end'>
              {/* Lane Info */}
              <div className='lg:col-span-2 text-white'>
                {/* Title and Description */}
                <div className='mb-8'>
                  <h1 className='text-4xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent'>
                    {lane.title}
                  </h1>
                  {lane.description && (
                    <p className='text-xl lg:text-2xl text-white/90 leading-relaxed max-w-4xl'>
                      {lane.description}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {tagNames.length > 0 && (
                  <div className='flex flex-wrap gap-3 mb-8'>
                    {tagNames.map((tagName, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-200'
                      >
                        <Tag className='w-3 h-3 mr-2' />
                        {tagName}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
                  <div className='flex items-center gap-3 text-white/90'>
                    <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
                      <Heart className='w-5 h-5' />
                    </div>
                    <div>
                      <div className='text-2xl font-bold'>{memoryCount}</div>
                      <div className='text-sm text-white/70'>Memories</div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 text-white/90'>
                    <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
                      <ImageIcon className='w-5 h-5' />
                    </div>
                    <div>
                      <div className='text-2xl font-bold'>{totalImages}</div>
                      <div className='text-sm text-white/70'>Photos</div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 text-white/90'>
                    <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
                      <Calendar className='w-5 h-5' />
                    </div>
                    <div>
                      <div className='text-2xl font-bold'>
                        {formatDate(lane.createdAt).split(' ')[2]}
                      </div>
                      <div className='text-sm text-white/70'>Created</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='lg:col-span-1'>
                {/* Share Button - Available to all users */}
                <div className='mb-4'>
                  <Button
                    onClick={handleShare}
                    variant='outline'
                    size='lg'
                    className='w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 hover:border-white/50 transition-all duration-200 shadow-lg'
                  >
                    {isCopied ? (
                      <>
                        <Check className='w-5 h-5 mr-2' />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className='w-5 h-5 mr-2' />
                        Share Lane
                      </>
                    )}
                  </Button>
                </div>

                <OwnerOnly
                  isOwner={isOwner}
                  redirectAfterAuth={`/lanes/${lane.id}`}
                >
                  <div className='space-y-4'>
                    <Button
                      onClick={() => onEditLane?.()}
                      variant='outline'
                      size='lg'
                      className='w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 hover:border-white/50 transition-all duration-200 shadow-lg'
                    >
                      <Edit className='w-5 h-5 mr-2' />
                      Edit Lane
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant='outline'
                      size='lg'
                      className='w-full bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white border-red-400/50 hover:border-red-400 transition-all duration-200 shadow-lg'
                    >
                      <Trash2 className='w-5 h-5 mr-2' />
                      Delete Lane
                    </Button>
                  </div>
                </OwnerOnly>

                <PermissionGuard
                  requireAuth={false}
                  fallback={
                    <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6'>
                      <div className='text-center'>
                        <Heart className='w-12 h-12 text-white/60 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-white mb-2'>
                          Create Your Own
                        </h3>
                        <p className='text-white/80 text-sm mb-4'>
                          Start building your memory collection
                        </p>
                        <Button
                          onClick={handleSignInClick}
                          className='w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-200'
                        >
                          Sign in to get started
                        </Button>
                      </div>
                    </div>
                  }
                >
                  {!isOwner && (
                    <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6'>
                      <div className='text-center'>
                        <Heart className='w-12 h-12 text-white/60 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-white mb-2'>
                          View Only
                        </h3>
                        <p className='text-white/80 text-sm mb-4'>
                          This memory lane belongs to someone else
                        </p>
                      </div>
                    </div>
                  )}
                </PermissionGuard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className='absolute bottom-0 left-0 right-0'>
        <svg
          className='w-full h-12 text-white dark:text-gray-900'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
        >
          <path
            d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
            opacity='.25'
            fill='currentColor'
          />
          <path
            d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z'
            opacity='.5'
            fill='currentColor'
          />
          <path
            d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z'
            fill='currentColor'
          />
        </svg>
      </div>
    </div>
  );
});
