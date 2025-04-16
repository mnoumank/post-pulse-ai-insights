
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  analyzePost, 
  generateTimeSeries, 
  generateSuggestions, 
  comparePostsPerformance,
  PostMetrics,
  TimeSeriesData,
  PostSuggestion,
  AdvancedAnalysisParams
} from '@/utils/postAnalyzer';
import { savePost, saveComparison, getUserComparisons } from '@/utils/auth';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface PostComparisonContextType {
  post1: string;
  post2: string;
  setPost1: (content: string) => void;
  setPost2: (content: string) => void;
  metrics1: PostMetrics | null;
  metrics2: PostMetrics | null;
  timeSeries1: TimeSeriesData[];
  timeSeries2: TimeSeriesData[];
  suggestions1: PostSuggestion[];
  suggestions2: PostSuggestion[];
  comparison: {
    winner: number;
    margin: number;
  } | null;
  isAdvancedMode: boolean;
  toggleAdvancedMode: () => void;
  advancedParams: AdvancedAnalysisParams;
  updateAdvancedParams: (params: Partial<AdvancedAnalysisParams>) => void;
  saveComparison: () => Promise<void>;
  savedComparisons: SavedComparison[];
  isLoading: boolean;
  refreshComparisons: () => Promise<void>;
}

interface SavedComparison {
  id: string;
  date: string;
  post1: string;
  post2: string;
  winningPost: number;
  metrics1?: PostMetrics;
  metrics2?: PostMetrics;
}

const defaultAdvancedParams: AdvancedAnalysisParams = {
  followerRange: '1K-5K',
  industry: 'Technology',
  engagementLevel: 'Medium',
};

const PostComparisonContext = createContext<PostComparisonContextType | undefined>(undefined);

export function PostComparisonProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [post1, setPost1] = useState('');
  const [post2, setPost2] = useState('');
  const [metrics1, setMetrics1] = useState<PostMetrics | null>(null);
  const [metrics2, setMetrics2] = useState<PostMetrics | null>(null);
  const [timeSeries1, setTimeSeries1] = useState<TimeSeriesData[]>([]);
  const [timeSeries2, setTimeSeries2] = useState<TimeSeriesData[]>([]);
  const [suggestions1, setSuggestions1] = useState<PostSuggestion[]>([]);
  const [suggestions2, setSuggestions2] = useState<PostSuggestion[]>([]);
  const [comparison, setComparison] = useState<{ winner: number; margin: number } | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [advancedParams, setAdvancedParams] = useState<AdvancedAnalysisParams>(defaultAdvancedParams);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved comparisons when the user changes
  useEffect(() => {
    if (user) {
      refreshComparisons();
    }
  }, [user]);

  // Update analysis when posts change or advanced settings change
  useEffect(() => {
    // Don't analyze if posts are empty
    if (!post1.trim() && !post2.trim()) return;

    // Calculate metrics
    if (post1.trim()) {
      const currentParams = isAdvancedMode ? advancedParams : undefined;
      const newMetrics1 = analyzePost(post1, currentParams);
      setMetrics1(newMetrics1);
      setTimeSeries1(generateTimeSeries(post1));
      setSuggestions1(generateSuggestions(post1));
    } else {
      setMetrics1(null);
      setTimeSeries1([]);
      setSuggestions1([]);
    }

    if (post2.trim()) {
      const currentParams = isAdvancedMode ? advancedParams : undefined;
      const newMetrics2 = analyzePost(post2, currentParams);
      setMetrics2(newMetrics2);
      setTimeSeries2(generateTimeSeries(post2));
      setSuggestions2(generateSuggestions(post2));
    } else {
      setMetrics2(null);
      setTimeSeries2([]);
      setSuggestions2([]);
    }

    // Compare posts if both have content
    if (post1.trim() && post2.trim()) {
      const currentParams = isAdvancedMode ? advancedParams : undefined;
      const comparisonResult = comparePostsPerformance(post1, post2, currentParams);
      setComparison({
        winner: comparisonResult.winner,
        margin: comparisonResult.margin,
      });
    } else {
      setComparison(null);
    }
  }, [post1, post2, isAdvancedMode, advancedParams]);

  // Toggle advanced mode
  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  // Update advanced parameters
  const updateAdvancedParams = (params: Partial<AdvancedAnalysisParams>) => {
    setAdvancedParams(prev => ({ ...prev, ...params }));
  };

  // Refresh comparisons from the database
  const refreshComparisons = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const comparisons = await getUserComparisons();
      setSavedComparisons(comparisons);
    } catch (error) {
      console.error('Failed to load comparisons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your saved comparisons',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save comparison to database
  const handleSaveComparison = async () => {
    if (!metrics1 || !metrics2 || !comparison) {
      toast({
        title: 'Cannot save',
        description: 'Please make sure both posts have content',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // First save both posts
      const post1Id = await savePost(post1);
      const post2Id = await savePost(post2);
      
      // Determine winner ID
      const winnerId = comparison.winner === 1 ? post1Id : comparison.winner === 2 ? post2Id : null;
      
      // Save the comparison with references to the posts
      const metrics = {
        post1: metrics1,
        post2: metrics2
      };
      
      const suggestionsData = {
        post1: suggestions1,
        post2: suggestions2
      };
      
      await saveComparison(post1Id, post2Id, winnerId, metrics, suggestionsData);
      
      // Refresh the list of saved comparisons
      await refreshComparisons();
      
    } catch (error) {
      console.error('Failed to save comparison:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your comparison',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostComparisonContext.Provider
      value={{
        post1,
        post2,
        setPost1,
        setPost2,
        metrics1,
        metrics2,
        timeSeries1,
        timeSeries2,
        suggestions1,
        suggestions2,
        comparison,
        isAdvancedMode,
        toggleAdvancedMode,
        advancedParams,
        updateAdvancedParams,
        saveComparison: handleSaveComparison,
        savedComparisons,
        isLoading,
        refreshComparisons,
      }}
    >
      {children}
    </PostComparisonContext.Provider>
  );
}

export function usePostComparison() {
  const context = useContext(PostComparisonContext);
  if (context === undefined) {
    throw new Error('usePostComparison must be used within a PostComparisonProvider');
  }
  return context;
}
