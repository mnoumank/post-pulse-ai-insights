
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
import { analyzePostWithAI, combineAnalysisResults, convertAISuggestions, AIPostMetrics } from '@/utils/aiAnalyzer';
import { savePost, saveComparison, getUserComparisons } from '@/utils/auth';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface PostComparisonContextType {
  post1: string;
  post2: string;
  setPost1: (content: string) => void;
  setPost2: (content: string) => void;
  metrics1: AIPostMetrics | null;
  metrics2: AIPostMetrics | null;
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
  isAIEnabled: boolean;
  toggleAIAnalysis: () => void;
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
  const [metrics1, setMetrics1] = useState<AIPostMetrics | null>(null);
  const [metrics2, setMetrics2] = useState<AIPostMetrics | null>(null);
  const [timeSeries1, setTimeSeries1] = useState<TimeSeriesData[]>([]);
  const [timeSeries2, setTimeSeries2] = useState<TimeSeriesData[]>([]);
  const [suggestions1, setSuggestions1] = useState<PostSuggestion[]>([]);
  const [suggestions2, setSuggestions2] = useState<PostSuggestion[]>([]);
  const [comparison, setComparison] = useState<{ winner: number; margin: number } | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [advancedParams, setAdvancedParams] = useState<AdvancedAnalysisParams>(defaultAdvancedParams);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(true);

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

    const analyzePostWithCombinedApproach = async (postContent: string, isPost1: boolean) => {
      if (!postContent.trim()) {
        if (isPost1) {
          setMetrics1(null);
          setTimeSeries1([]);
          setSuggestions1([]);
        } else {
          setMetrics2(null);
          setTimeSeries2([]);
          setSuggestions2([]);
        }
        return null;
      }

      const currentParams = isAdvancedMode ? advancedParams : undefined;
      
      // Always run the algorithmic analysis
      const algorithmicMetrics = analyzePost(postContent, currentParams);
      const timeSeriesData = generateTimeSeries(postContent);
      let postSuggestions = generateSuggestions(postContent);
      
      // If AI is enabled, enhance with AI analysis
      let combinedMetrics: AIPostMetrics = {
        ...algorithmicMetrics,
        recommendedHashtags: [],
        isAIEnhanced: false
      };
      
      if (isAIEnabled) {
        try {
          const aiResults = await analyzePostWithAI(
            postContent, 
            currentParams?.industry
          );
          
          if (aiResults) {
            combinedMetrics = combineAnalysisResults(algorithmicMetrics, aiResults);
            
            // Combine algorithmic and AI suggestions
            const aiSuggestions = convertAISuggestions(aiResults.suggestions);
            postSuggestions = [...aiSuggestions, ...postSuggestions].slice(0, 6);
          }
        } catch (error) {
          console.error('Error enhancing analysis with AI:', error);
          // Fall back to algorithmic results if AI fails
        }
      }
      
      if (isPost1) {
        setMetrics1(combinedMetrics);
        setTimeSeries1(timeSeriesData);
        setSuggestions1(postSuggestions);
      } else {
        setMetrics2(combinedMetrics);
        setTimeSeries2(timeSeriesData);
        setSuggestions2(postSuggestions);
      }
      
      return combinedMetrics;
    };

    // Run analysis for both posts
    const runAnalysis = async () => {
      const metrics1Result = await analyzePostWithCombinedApproach(post1, true);
      const metrics2Result = await analyzePostWithCombinedApproach(post2, false);
      
      // Compare posts if both have content
      if (metrics1Result && metrics2Result) {
        const post1Score = (metrics1Result.engagementScore + metrics1Result.reachScore + metrics1Result.viralityScore) / 3;
        const post2Score = (metrics2Result.engagementScore + metrics2Result.reachScore + metrics2Result.viralityScore) / 3;
        
        if (post1Score > post2Score) {
          setComparison({
            winner: 1,
            margin: ((post1Score - post2Score) / post2Score) * 100,
          });
        } else if (post2Score > post1Score) {
          setComparison({
            winner: 2,
            margin: ((post2Score - post1Score) / post1Score) * 100,
          });
        } else {
          setComparison({
            winner: 0,
            margin: 0,
          });
        }
      } else {
        setComparison(null);
      }
    };
    
    runAnalysis();
  }, [post1, post2, isAdvancedMode, advancedParams, isAIEnabled]);

  // Toggle advanced mode
  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  // Toggle AI analysis
  const toggleAIAnalysis = () => {
    setIsAIEnabled(!isAIEnabled);
    // Notify the user of the change
    toast({
      title: isAIEnabled ? "AI Analysis Disabled" : "AI Analysis Enabled",
      description: isAIEnabled ? "Now using algorithmic analysis only." : "Posts will now be analyzed with AI assistance.",
    });
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
        isAIEnabled,
        toggleAIAnalysis,
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
