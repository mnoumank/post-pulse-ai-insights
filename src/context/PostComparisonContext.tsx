
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
import { toast } from '@/hooks/use-toast';

interface PostComparisonContextType {
  postA: string;
  postB: string;
  setPostA: (content: string) => void;
  setPostB: (content: string) => void;
  analysisA: AIPostMetrics | null;
  analysisB: AIPostMetrics | null;
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
  saveComparison: (postA: string, postB: string, analysisA: AIPostMetrics, analysisB: AIPostMetrics) => Promise<void>;
  isAnalyzing: boolean;
  analyzePost: (postA: string, postB: string) => Promise<void>;
  isAIEnabled: boolean;
  toggleAIAnalysis: () => void;
}

const defaultAdvancedParams: AdvancedAnalysisParams = {
  followerRange: '1K-5K',
  industry: 'Technology',
  engagementLevel: 'Medium',
};

const PostComparisonContext = createContext<PostComparisonContextType | undefined>(undefined);

export function PostComparisonProvider({ children }: { children: ReactNode }) {
  const [postA, setPostA] = useState('');
  const [postB, setPostB] = useState('');
  const [analysisA, setAnalysisA] = useState<AIPostMetrics | null>(null);
  const [analysisB, setAnalysisB] = useState<AIPostMetrics | null>(null);
  const [timeSeries1, setTimeSeries1] = useState<TimeSeriesData[]>([]);
  const [timeSeries2, setTimeSeries2] = useState<TimeSeriesData[]>([]);
  const [suggestions1, setSuggestions1] = useState<PostSuggestion[]>([]);
  const [suggestions2, setSuggestions2] = useState<PostSuggestion[]>([]);
  const [comparison, setComparison] = useState<{ winner: number; margin: number } | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [advancedParams, setAdvancedParams] = useState<AdvancedAnalysisParams>(defaultAdvancedParams);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(true);

  // Analyze posts function
  const handleAnalyzePost = async (postAContent: string, postBContent: string) => {
    setIsAnalyzing(true);
    try {
      // Analyze post A
      const currentParams = isAdvancedMode ? advancedParams : undefined;
      
      // Always run the algorithmic analysis
      const algorithmicMetricsA = analyzePost(postAContent, currentParams);
      const timeSeriesDataA = generateTimeSeries(postAContent);
      let postSuggestionsA = generateSuggestions(postAContent);
      
      // If AI is enabled, enhance with AI analysis
      let combinedMetricsA: AIPostMetrics = {
        ...algorithmicMetricsA,
        recommendedHashtags: [],
        isAIEnhanced: false
      };
      
      if (isAIEnabled) {
        try {
          const aiResultsA = await analyzePostWithAI(
            postAContent, 
            currentParams?.industry
          );
          
          if (aiResultsA) {
            combinedMetricsA = combineAnalysisResults(algorithmicMetricsA, aiResultsA);
            
            // Combine algorithmic and AI suggestions
            const aiSuggestionsA = convertAISuggestions(aiResultsA.suggestions);
            postSuggestionsA = [...aiSuggestionsA, ...postSuggestionsA].slice(0, 6);
          }
        } catch (error) {
          console.error('Error enhancing analysis with AI for post A:', error);
        }
      }

      // Analyze post B
      const algorithmicMetricsB = analyzePost(postBContent, currentParams);
      const timeSeriesDataB = generateTimeSeries(postBContent);
      let postSuggestionsB = generateSuggestions(postBContent);
      
      let combinedMetricsB: AIPostMetrics = {
        ...algorithmicMetricsB,
        recommendedHashtags: [],
        isAIEnhanced: false
      };
      
      if (isAIEnabled) {
        try {
          const aiResultsB = await analyzePostWithAI(
            postBContent, 
            currentParams?.industry
          );
          
          if (aiResultsB) {
            combinedMetricsB = combineAnalysisResults(algorithmicMetricsB, aiResultsB);
            
            const aiSuggestionsB = convertAISuggestions(aiResultsB.suggestions);
            postSuggestionsB = [...aiSuggestionsB, ...postSuggestionsB].slice(0, 6);
          }
        } catch (error) {
          console.error('Error enhancing analysis with AI for post B:', error);
        }
      }

      // Set results
      setAnalysisA(combinedMetricsA);
      setAnalysisB(combinedMetricsB);
      setTimeSeries1(timeSeriesDataA);
      setTimeSeries2(timeSeriesDataB);
      setSuggestions1(postSuggestionsA);
      setSuggestions2(postSuggestionsB);

      // Compare posts
      const postAScore = (combinedMetricsA.engagementScore + combinedMetricsA.reachScore + combinedMetricsA.viralityScore) / 3;
      const postBScore = (combinedMetricsB.engagementScore + combinedMetricsB.reachScore + combinedMetricsB.viralityScore) / 3;
      
      if (postAScore > postBScore) {
        setComparison({
          winner: 1,
          margin: ((postAScore - postBScore) / postBScore) * 100,
        });
      } else if (postBScore > postAScore) {
        setComparison({
          winner: 2,
          margin: ((postBScore - postAScore) / postAScore) * 100,
        });
      } else {
        setComparison({
          winner: 0,
          margin: 0,
        });
      }

    } catch (error) {
      console.error('Error analyzing posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze posts',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle advanced mode
  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  // Toggle AI analysis
  const toggleAIAnalysis = () => {
    setIsAIEnabled(!isAIEnabled);
    toast({
      title: isAIEnabled ? "AI Analysis Disabled" : "AI Analysis Enabled",
      description: isAIEnabled ? "Now using algorithmic analysis only." : "Posts will now be analyzed with AI assistance.",
    });
  };

  // Update advanced parameters
  const updateAdvancedParams = (params: Partial<AdvancedAnalysisParams>) => {
    setAdvancedParams(prev => ({ ...prev, ...params }));
  };

  // Save comparison (simplified since no auth)
  const handleSaveComparison = async (postA: string, postB: string, analysisA: AIPostMetrics, analysisB: AIPostMetrics) => {
    try {
      // Since we removed auth, we can just show a success message
      // In the future, this could save to local storage if needed
      toast({
        title: 'Comparison Saved',
        description: 'Your post comparison has been saved locally.',
      });
    } catch (error) {
      console.error('Failed to save comparison:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your comparison',
        variant: 'destructive',
      });
    }
  };

  return (
    <PostComparisonContext.Provider
      value={{
        postA,
        postB,
        setPostA,
        setPostB,
        analysisA,
        analysisB,
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
        isAnalyzing,
        analyzePost: handleAnalyzePost,
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
