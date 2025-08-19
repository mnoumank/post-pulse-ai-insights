import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  generateTimeSeries, 
  generateSuggestions, 
  comparePostsPerformance,
  TimeSeriesData,
  PostSuggestion,
  AdvancedAnalysisParams
} from '@/utils/improvedPostAnalyzer';
import { performHybridAnalysis, HybridAnalysisResult } from '@/utils/hybridAnalyzer';
import { AIPostMetrics } from '@/utils/aiAnalyzer';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/utils/auth/profiles';
import { saveComparison as saveComparisonRecord } from '@/utils/auth/comparisons';
import { useContentPersistence } from './ContentPersistenceContext';

interface PostComparisonContextType {
  postA: string;
  postB: string;
  setPostA: (content: string) => void;
  setPostB: (content: string) => void;
  clearPosts: () => void;
  analysisA: AIPostMetrics | null;
  analysisB: AIPostMetrics | null;
  enhancedAnalysisA: HybridAnalysisResult | null;
  enhancedAnalysisB: HybridAnalysisResult | null;
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
  analysisMethod: 'enhanced' | 'legacy';
  toggleAnalysisMethod: () => void;
}

const defaultAdvancedParams: AdvancedAnalysisParams = {
  followerRange: '1K-5K',
  industry: 'Technology',
  engagementLevel: 'Medium',
};

const PostComparisonContext = createContext<PostComparisonContextType | undefined>(undefined);

export function PostComparisonProvider({ children }: { children: ReactNode }) {
  const { comparisonState, updateComparisonState, clearComparisonState } = useContentPersistence();
  const [postA, setPostA] = useState(comparisonState.postA);
  const [postB, setPostB] = useState(comparisonState.postB);
  const [analysisA, setAnalysisA] = useState<AIPostMetrics | null>(comparisonState.analysisResults?.analysisA || null);
  const [analysisB, setAnalysisB] = useState<AIPostMetrics | null>(comparisonState.analysisResults?.analysisB || null);
  const [enhancedAnalysisA, setEnhancedAnalysisA] = useState<HybridAnalysisResult | null>(comparisonState.analysisResults?.enhancedAnalysisA || null);
  const [enhancedAnalysisB, setEnhancedAnalysisB] = useState<HybridAnalysisResult | null>(comparisonState.analysisResults?.enhancedAnalysisB || null);
  const [timeSeries1, setTimeSeries1] = useState<TimeSeriesData[]>([]);
  const [timeSeries2, setTimeSeries2] = useState<TimeSeriesData[]>([]);
  const [suggestions1, setSuggestions1] = useState<PostSuggestion[]>([]);
  const [suggestions2, setSuggestions2] = useState<PostSuggestion[]>([]);
  const [comparison, setComparison] = useState<{ winner: number; margin: number } | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [advancedParams, setAdvancedParams] = useState<AdvancedAnalysisParams>(defaultAdvancedParams);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [analysisMethod, setAnalysisMethod] = useState<'enhanced' | 'legacy'>('enhanced');

  // Update persistent storage when posts change
  const handleSetPostA = (content: string) => {
    setPostA(content);
    updateComparisonState({ postA: content });
  };

  const handleSetPostB = (content: string) => {
    setPostB(content);
    updateComparisonState({ postB: content });
  };

  const clearPosts = () => {
    setPostA('');
    setPostB('');
    setAnalysisA(null);
    setAnalysisB(null);
    setEnhancedAnalysisA(null);
    setEnhancedAnalysisB(null);
    setTimeSeries1([]);
    setTimeSeries2([]);
    setSuggestions1([]);
    setSuggestions2([]);
    setComparison(null);
    clearComparisonState();
  };

  const handleAnalyzePost = useCallback(async (postAContent: string, postBContent: string) => {
    if (isAnalyzing || !postAContent.trim() || !postBContent.trim()) {
      return;
    }

    setIsAnalyzing(true);
    console.log(`Starting ${analysisMethod} analysis...`);
    
    try {
      const currentParams = isAdvancedMode ? advancedParams : undefined;
      
      if (analysisMethod === 'enhanced') {
        // Use the new hybrid analysis system
        const hybridOptionsA = {
          useAI: isAIEnabled,
          preferEnhanced: true,
          confidenceThreshold: 0.6
        };
        
        const hybridOptionsB = {
          useAI: isAIEnabled,
          preferEnhanced: true,
          confidenceThreshold: 0.6
        };
        
        // Analyze both posts with hybrid system
        const [hybridResultA, hybridResultB] = await Promise.all([
          performHybridAnalysis(postAContent, currentParams, hybridOptionsA),
          performHybridAnalysis(postBContent, currentParams, hybridOptionsB)
        ]);
        
        console.log('Hybrid Analysis A:', hybridResultA);
        console.log('Hybrid Analysis B:', hybridResultB);
        
        // Set enhanced analysis results
        setEnhancedAnalysisA(hybridResultA);
        setEnhancedAnalysisB(hybridResultB);
        
        // Set legacy format for compatibility
        setAnalysisA(hybridResultA.legacy);
        setAnalysisB(hybridResultB.legacy);

        // Update persistent storage with analysis results
        updateComparisonState({
          analysisResults: {
            analysisA: hybridResultA.legacy,
            analysisB: hybridResultB.legacy,
            enhancedAnalysisA: hybridResultA,
            enhancedAnalysisB: hybridResultB,
          }
        });
        
        // Generate suggestions based on enhanced analysis
        const enhancedSuggestionsA = generateEnhancedSuggestions(hybridResultA.enhanced);
        const enhancedSuggestionsB = generateEnhancedSuggestions(hybridResultB.enhanced);
        
        setSuggestions1(enhancedSuggestionsA);
        setSuggestions2(enhancedSuggestionsB);
        
        // Calculate comparison based on enhanced scores
        const comparisonResult = compareEnhancedPosts(hybridResultA, hybridResultB);
        setComparison(comparisonResult);
        
        // Show analysis method in toast
        toast({
          title: `Analysis Complete (${hybridResultA.analysisMethod})`,
          description: isAIEnabled && hybridResultA.analysisMethod === 'hybrid' ? 
            `AI contribution: ${(hybridResultA.aiContribution * 100).toFixed(0)}%` :
            'Using enhanced virality prediction algorithm',
        });
        
      } else {
        // Use original improved analyzer for legacy mode
        const { analyzePost } = await import('@/utils/improvedPostAnalyzer');
        
        const algorithmicMetricsA = analyzePost(postAContent, currentParams);
        const algorithmicMetricsB = analyzePost(postBContent, currentParams);
        
        let combinedMetricsA: AIPostMetrics = {
          ...algorithmicMetricsA,
          recommendedHashtags: [],
          isAIEnhanced: false
        };
        
        let combinedMetricsB: AIPostMetrics = {
          ...algorithmicMetricsB,
          recommendedHashtags: [],
          isAIEnhanced: false
        };
        
        setAnalysisA(combinedMetricsA);
        setAnalysisB(combinedMetricsB);

        // Update persistent storage with analysis results
        updateComparisonState({
          analysisResults: {
            analysisA: combinedMetricsA,
            analysisB: combinedMetricsB,
            enhancedAnalysisA: null,
            enhancedAnalysisB: null,
          }
        });
        
        const postSuggestionsA = generateSuggestions(postAContent);
        const postSuggestionsB = generateSuggestions(postBContent);
        
        setSuggestions1(postSuggestionsA);
        setSuggestions2(postSuggestionsB);
        
        const comparisonResult = comparePostsPerformance(postAContent, postBContent, currentParams);
        setComparison({
          winner: comparisonResult.winner,
          margin: comparisonResult.margin,
        });
      }

      // Generate time series data (common for both methods)
      const timeSeriesDataA = generateTimeSeries(postAContent);
      const timeSeriesDataB = generateTimeSeries(postBContent);
      setTimeSeries1(timeSeriesDataA);
      setTimeSeries2(timeSeriesDataB);

    } catch (error) {
      console.error('Error analyzing posts:', error);
      toast({
        title: 'Analysis Error',
        description: 'There was an issue analyzing the posts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, isAdvancedMode, advancedParams, isAIEnabled, analysisMethod]);

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  const toggleAIAnalysis = () => {
    setIsAIEnabled(!isAIEnabled);
    toast({
      title: isAIEnabled ? "AI Analysis Disabled" : "AI Analysis Enabled",
      description: isAIEnabled ? 
        "Now using algorithmic analysis only." : 
        "Posts will now be analyzed with AI assistance.",
    });
  };

  const toggleAnalysisMethod = () => {
    const newMethod = analysisMethod === 'enhanced' ? 'legacy' : 'enhanced';
    setAnalysisMethod(newMethod);
    toast({
      title: `Switched to ${newMethod === 'enhanced' ? 'Enhanced' : 'Legacy'} Analysis`,
      description: newMethod === 'enhanced' ? 
        'Using new 8-factor virality prediction system' :
        'Using original analysis algorithm',
    });
  };

  const updateAdvancedParams = (params: Partial<AdvancedAnalysisParams>) => {
    setAdvancedParams(prev => ({ ...prev, ...params }));
  };

  const handleSaveComparison = async (postAText: string, postBText: string, analysisAData: AIPostMetrics, analysisBData: AIPostMetrics) => {
    // Create two post records and then create a comparison linking them
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to save a comparison');
    }

    // Insert posts (always new records to keep history simple)
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .insert([
        { user_id: user.id, content: postAText },
        { user_id: user.id, content: postBText },
      ])
      .select();

    if (postsError) {
      console.error('Error creating posts for comparison:', postsError);
      throw new Error(postsError.message);
    }

    const postAId = postsData?.[0]?.id;
    const postBId = postsData?.[1]?.id;

    if (!postAId || !postBId) {
      throw new Error('Failed to create post records');
    }

    const computedWinnerId =
      comparison?.winner === 1 ? postAId :
      comparison?.winner === 2 ? postBId :
      null;

    // Prepare payloads
    const metricsPayload = {
      postA: analysisAData,
      postB: analysisBData,
      comparison: comparison,
    };

    const suggestionsPayload = {
      postA: suggestions1,
      postB: suggestions2,
    };

    // Save comparison record
    await saveComparisonRecord(
      postAId,
      postBId,
      computedWinnerId,
      metricsPayload,
      suggestionsPayload
    );
  };

  return (
    <PostComparisonContext.Provider
      value={{
        postA,
        postB,
        setPostA: handleSetPostA,
        setPostB: handleSetPostB,
        clearPosts,
        analysisA,
        analysisB,
        enhancedAnalysisA,
        enhancedAnalysisB,
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
        analysisMethod,
        toggleAnalysisMethod,
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

// Helper functions for enhanced analysis
function generateEnhancedSuggestions(enhanced: any): PostSuggestion[] {
  const suggestions: PostSuggestion[] = [];
  
  // Convert enhanced analysis to suggestions
  Object.entries(enhanced.detailedAnalysis).forEach(([key, analysis]: [string, any]) => {
    if (analysis.score < 7 && analysis.suggestions.length > 0) {
      suggestions.push({
        id: `enhanced-${key}`,
        type: analysis.score < 4 ? 'warning' : 'improvement',
        title: analysis.suggestions[0].replace(/^(.)/, (c: string) => c.toUpperCase()),
        description: analysis.description,
      });
    }
  });
  
  // Add top strengths as tips
  enhanced.topStrengths.slice(0, 2).forEach((strength: string, index: number) => {
    suggestions.push({
      id: `strength-${index}`,
      type: 'tip',
      title: `Strength: ${strength.split(':')[0]}`,
      description: `This is performing well - maintain this approach in future posts.`,
    });
  });
  
  return suggestions.slice(0, 6); // Limit to 6 suggestions
}

function compareEnhancedPosts(resultA: HybridAnalysisResult, resultB: HybridAnalysisResult) {
  const scoreA = resultA.enhanced.viralityScore;
  const scoreB = resultB.enhanced.viralityScore;
  
  if (scoreA > scoreB) {
    return {
      winner: 1,
      margin: ((scoreA - scoreB) / scoreB) * 100
    };
  } else if (scoreB > scoreA) {
    return {
      winner: 2,
      margin: ((scoreB - scoreA) / scoreA) * 100
    };
  } else {
    return {
      winner: 0,
      margin: 0
    };
  }
}
