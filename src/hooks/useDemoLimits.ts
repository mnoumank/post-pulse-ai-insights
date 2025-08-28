import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface DemoLimits {
  creates_used: number;
  comparisons_used: number;
  can_create: boolean;
  can_compare: boolean;
}

interface UseDemoLimitsReturn {
  limits: DemoLimits | null;
  loading: boolean;
  error: string | null;
  checkLimits: () => Promise<void>;
  incrementCreates: () => Promise<boolean>;
  incrementComparisons: () => Promise<boolean>;
  isAuthenticated: boolean;
}

export const useDemoLimits = (): UseDemoLimitsReturn => {
  const { user } = useAuth();
  const [limits, setLimits] = useState<DemoLimits | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const checkLimits = async () => {
    if (isAuthenticated) {
      // Authenticated users have unlimited access
      setLimits({
        creates_used: 0,
        comparisons_used: 0,
        can_create: true,
        can_compare: true
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://eczmumeybuilbwoghcwd.supabase.co/functions/v1/demo-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'check' }),
      });

      if (!response.ok) {
        throw new Error('Failed to check demo limits');
      }

      const data = await response.json();
      setLimits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check limits');
      console.error('Error checking demo limits:', err);
    } finally {
      setLoading(false);
    }
  };

  const incrementCreates = async (): Promise<boolean> => {
    if (isAuthenticated) return true; // Unlimited for authenticated users

    try {
      const response = await fetch('https://eczmumeybuilbwoghcwd.supabase.co/functions/v1/demo-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'increment_creates' }),
      });

      if (response.status === 403) {
        // Limit reached
        await checkLimits(); // Refresh limits
        return false;
      }

      if (!response.ok) {
        throw new Error('Failed to increment creates');
      }

      await checkLimits(); // Refresh limits
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increment creates');
      return false;
    }
  };

  const incrementComparisons = async (): Promise<boolean> => {
    if (isAuthenticated) return true; // Unlimited for authenticated users

    try {
      const response = await fetch('https://eczmumeybuilbwoghcwd.supabase.co/functions/v1/demo-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'increment_comparisons' }),
      });

      if (response.status === 403) {
        // Limit reached
        await checkLimits(); // Refresh limits
        return false;
      }

      if (!response.ok) {
        throw new Error('Failed to increment comparisons');
      }

      await checkLimits(); // Refresh limits
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increment comparisons');
      return false;
    }
  };

  useEffect(() => {
    checkLimits();
  }, [isAuthenticated]);

  return {
    limits,
    loading,
    error,
    checkLimits,
    incrementCreates,
    incrementComparisons,
    isAuthenticated
  };
};