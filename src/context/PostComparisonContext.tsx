
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
  saveComparison: () => void;
  savedComparisons: SavedComparison[];
}

interface SavedComparison {
  id: string;
  date: string;
  post1: string;
  post2: string;
  winningPost: number;
  metrics1: PostMetrics;
  metrics2: PostMetrics;
}

const defaultAdvancedParams: AdvancedAnalysisParams = {
  followerRange: '1K-5K',
  industry: 'Technology',
  engagementLevel: 'Medium',
};

const PostComparisonContext = createContext<PostComparisonContextType | undefined>(undefined);

export function PostComparisonProvider({ children }: { children: ReactNode }) {
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

  // Load saved comparisons from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('savedComparisons');
    if (savedData) {
      try {
        setSavedComparisons(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to load saved comparisons', e);
      }
    }
  }, []);

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

  // Save comparison to history
  const saveComparison = () => {
    if (!metrics1 || !metrics2 || !comparison) return;

    const newComparison: SavedComparison = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      post1,
      post2,
      winningPost: comparison.winner,
      metrics1,
      metrics2,
    };

    const updatedComparisons = [...savedComparisons, newComparison];
    setSavedComparisons(updatedComparisons);
    
    // Save to localStorage
    localStorage.setItem('savedComparisons', JSON.stringify(updatedComparisons));
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
        saveComparison,
        savedComparisons,
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
