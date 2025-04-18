import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { login, logout, register } from '@/utils/auth/authentication';
import { getCurrentUser } from '@/utils/auth/profiles';
import { User } from '@/utils/auth/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    // Check if user is logged in when the app loads
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Check if we have a demo user in localStorage
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser) {
          setUser(JSON.parse(demoUser));
          setIsDemoUser(true);
          setIsLoading(false);
          return;
        }

        const user = await getCurrentUser();
        setUser(user);
      } catch (err) {
        console.error('Authentication check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener (only if not demo user)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isDemoUser) return; // Skip for demo user

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Get user data when signed in or token refreshed
          try {
            const user = await getCurrentUser();
            setUser(user);
          } catch (error) {
            console.error('Failed to get user after auth state change:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('demoUser');
          setIsDemoUser(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [isDemoUser]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Special handling for demo account
      if (email === "demo@example.com" && password === "password123") {
        const demoUser = {
          id: "demo-user-id",
          name: "Demo User",
          email: "demo@example.com",
          avatarUrl: undefined,
        };
        setUser(demoUser);
        setIsDemoUser(true);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        toast("Demo Mode", {
          description: "You are now using the demo account"
        });
        setIsLoading(false);
        return;
      }

      const user = await login(email, password);
      setUser(user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await register(email, password, name);
      setUser(user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoUser) {
        // Handle demo user logout
        localStorage.removeItem('demoUser');
        setUser(null);
        setIsDemoUser(false);
      } else {
        await logout();
        setUser(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
