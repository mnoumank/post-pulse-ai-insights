
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { login, logout, register } from '@/utils/auth/authentication';
import { getCurrentUser } from '@/utils/auth/profiles';
import { User } from '@/utils/auth/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        
        // Only synchronous state updates here to prevent deadlocks
        setSession(session);
        setUser(session?.user ? { 
          id: session.user.id, 
          email: session.user.email || '', 
          name: session.user.user_metadata?.full_name || '',
          avatarUrl: session.user.user_metadata?.avatar_url || undefined 
        } : null);
        
        // Defer any Supabase calls with setTimeout to prevent auth deadlocks
        if (session?.user) {
          setTimeout(() => {
            getCurrentUser().then((user) => {
              if (user) setUser(user);
            }).catch((error) => {
              console.error('Failed to get user profile:', error);
            });
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(() => {
          getCurrentUser().then((user) => {
            if (user) setUser(user);
            setIsLoading(false);
          }).catch((error) => {
            console.error('Failed to get user profile:', error);
            setIsLoading(false);
          });
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
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
      toast.success("Account created successfully! Please check your email to verify your account.");
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
      await logout();
      setUser(null);
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
        session,
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
