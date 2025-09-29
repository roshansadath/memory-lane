'use client';

import React, { createContext, useContext, useState } from 'react';

interface AuthModalContextType {
  isOpen: boolean;
  defaultTab: 'login' | 'register';
  openModal: (tab?: 'login' | 'register') => void;
  closeModal: () => void;
  redirectAfterAuth?: string;
  setRedirectAfterAuth: (url: string | undefined) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'register'>('login');
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<
    string | undefined
  >(undefined);

  const openModal = (tab: 'login' | 'register' = 'login') => {
    setDefaultTab(tab);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRedirectAfterAuth(undefined);
  };

  const value = {
    isOpen,
    defaultTab,
    openModal,
    closeModal,
    redirectAfterAuth,
    setRedirectAfterAuth,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
