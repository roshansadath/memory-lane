'use client';

import { memo, ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export const FadeIn = memo(function FadeIn({
  children,
  delay = 0,
  duration = 500,
  className,
  direction = 'fade',
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: 'translate-x-4',
    right: '-translate-x-4',
    fade: '',
  };

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
});

interface StaggeredFadeInProps {
  children: ReactNode[];
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredFadeIn = memo(function StaggeredFadeIn({
  children,
  delay = 0,
  staggerDelay = 100,
  className,
}: StaggeredFadeInProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={delay + index * staggerDelay} direction='up'>
          {child}
        </FadeIn>
      ))}
    </div>
  );
});

interface SlideInProps {
  children: ReactNode;
  from: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideIn = memo(function SlideIn({
  children,
  from,
  delay = 0,
  duration = 300,
  className,
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const fromClasses = {
    left: '-translate-x-full',
    right: 'translate-x-full',
    top: '-translate-y-full',
    bottom: 'translate-y-full',
  };

  return (
    <div
      className={cn(
        'transition-transform ease-out',
        isVisible ? 'translate-x-0 translate-y-0' : fromClasses[from],
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
});

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  scale?: number;
}

export const ScaleIn = memo(function ScaleIn({
  children,
  delay = 0,
  duration = 300,
  className,
  scale = 0.95,
}: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible
          ? 'opacity-100 scale-100'
          : `opacity-0 scale-${Math.round(scale * 100)}`,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
});

interface RevealOnScrollProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export const RevealOnScroll = memo(function RevealOnScroll({
  children,
  threshold = 0.1,
  rootMargin = '0px',
  className,
  direction = 'up',
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    fade: '',
  };

  return (
    <div
      ref={setRef}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
    >
      {children}
    </div>
  );
});

interface PulseProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export const Pulse = memo(function Pulse({
  children,
  className,
  duration = 1000,
}: PulseProps) {
  return (
    <div
      className={cn('animate-pulse', className)}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
});

interface BounceProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const Bounce = memo(function Bounce({
  children,
  className,
  delay = 0,
}: BounceProps) {
  return (
    <div
      className={cn('animate-bounce', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
});
