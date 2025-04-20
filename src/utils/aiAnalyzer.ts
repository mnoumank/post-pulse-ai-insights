
import { PostMetrics, PostSuggestion } from './postAnalyzer';

interface AIAnalysisResponse {
  engagementScore: number;
  reachScore: number;
  viralityScore: number;
  suggestions: {
    title: string;
    description: string;
  }[];
  recommendedHashtags: string[];
}

export interface AIPostMetrics extends PostMetrics {
  recommendedHashtags: string[];
  isAIEnhanced: boolean;
}

export async function analyzePostWithAI(
  postContent: string, 
  industry?: string
): Promise<AIAnalysisResponse | null> {
  try {
    const response = await fetch('/api/rest/v1/pg/functions/analyze-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postContent,
        industry,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AI analysis failed:', errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error during AI post analysis:', error);
    return null;
  }
}

export function combineAnalysisResults(
  algorithmicResults: PostMetrics,
  aiResults: AIAnalysisResponse | null
): AIPostMetrics {
  // If AI analysis failed, return algorithmic results only
  if (!aiResults) {
    return {
      ...algorithmicResults,
      recommendedHashtags: [],
      isAIEnhanced: false,
    };
  }

  // Combine scores with 40% weight on algorithmic and 60% on AI
  const combinedEngagementScore = Math.round(
    algorithmicResults.engagementScore * 0.4 + aiResults.engagementScore * 0.6
  );
  
  const combinedReachScore = Math.round(
    algorithmicResults.reachScore * 0.4 + aiResults.reachScore * 0.6
  );
  
  const combinedViralityScore = Math.round(
    algorithmicResults.viralityScore * 0.4 + aiResults.viralityScore * 0.6
  );

  // Scale likes, comments, shares proportionally
  const engagementRatio = combinedEngagementScore / algorithmicResults.engagementScore;
  const viralityRatio = combinedViralityScore / algorithmicResults.viralityScore;

  return {
    engagementScore: combinedEngagementScore,
    reachScore: combinedReachScore,
    viralityScore: combinedViralityScore,
    likes: Math.round(algorithmicResults.likes * engagementRatio),
    comments: Math.round(algorithmicResults.comments * engagementRatio),
    shares: Math.round(algorithmicResults.shares * viralityRatio),
    recommendedHashtags: aiResults.recommendedHashtags,
    isAIEnhanced: true,
  };
}

export function convertAISuggestions(aiSuggestions: AIAnalysisResponse['suggestions']): PostSuggestion[] {
  if (!aiSuggestions || !Array.isArray(aiSuggestions)) {
    return [];
  }
  
  return aiSuggestions.map((suggestion, index) => ({
    id: `ai-suggestion-${index}`,
    type: index % 3 === 0 ? 'improvement' : index % 3 === 1 ? 'tip' : 'warning',
    title: suggestion.title,
    description: suggestion.description,
  }));
}
