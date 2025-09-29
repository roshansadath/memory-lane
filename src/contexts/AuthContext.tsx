'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User, LoginCredentials, RegisterCredentials } from '@/types';
import { queryKeys } from '@/hooks/useMemoryLanes';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isAuthenticated = !!user;

  // Helper function to clear user-specific data
  const clearUserData = useCallback(() => {
    // Clear user-specific queries
    queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    queryClient.invalidateQueries({ queryKey: queryKeys.homePage() });
    queryClient.invalidateQueries({ queryKey: queryKeys.tagsWithLanes() });
    // Clear all "My Lanes" queries (regardless of user ID)
    queryClient.removeQueries({ queryKey: [...queryKeys.lists(), 'my'] });
    // Clear all memory lane details
    queryClient.removeQueries({ queryKey: queryKeys.details() });
    // Clear any user-specific search results
    queryClient.removeQueries({ queryKey: ['memoryLanes', 'search'] });
  }, [queryClient]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        // Clear user-specific data when new user logs in
        clearUserData();
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        // Clear user-specific data when new user registers
        clearUserData();
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Clear user-specific data when user logs out
    clearUserData();
  };

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data.user);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        setUser(null);
        // Clear user-specific data when user is cleared due to invalid token
        clearUserData();
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      localStorage.removeItem('token');
      setUser(null);
      // Clear user-specific data when user is cleared due to error
      clearUserData();
    } finally {
      setIsLoading(false);
    }
  }, [clearUserData]);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
