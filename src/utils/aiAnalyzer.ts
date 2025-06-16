
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
  analysis?: {
    strengths: string[];
    weaknesses: string[];
    tone: string;
    readability: string;
    callToAction: string;
  };
}

export interface AIPostMetrics extends PostMetrics {
  recommendedHashtags: string[];
  isAIEnhanced: boolean;
  analysis?: AIAnalysisResponse['analysis'];
}

export async function analyzePostWithAI(
  postContent: string, 
  industry?: string
): Promise<AIAnalysisResponse | null> {
  try {
    const response = await fetch('/api/rest/v1/pg/functions/analyze-post-ai', {
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

    const result = await response.json();
    console.log('AI Analysis Result:', result);
    return result;
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

  // Combine scores with 30% weight on algorithmic and 70% on AI for better accuracy
  const combinedEngagementScore = Math.round(
    algorithmicResults.engagementScore * 0.3 + aiResults.engagementScore * 0.7
  );
  
  const combinedReachScore = Math.round(
    algorithmicResults.reachScore * 0.3 + aiResults.reachScore * 0.7
  );
  
  const combinedViralityScore = Math.round(
    algorithmicResults.viralityScore * 0.3 + aiResults.viralityScore * 0.7
  );

  // Scale likes, comments, shares based on AI scores
  const engagementMultiplier = combinedEngagementScore / 50; // Base score of 50
  const viralityMultiplier = combinedViralityScore / 50;

  return {
    engagementScore: combinedEngagementScore,
    reachScore: combinedReachScore,
    viralityScore: combinedViralityScore,
    likes: Math.round(algorithmicResults.likes * engagementMultiplier),
    comments: Math.round(algorithmicResults.comments * engagementMultiplier),
    shares: Math.round(algorithmicResults.shares * viralityMultiplier),
    recommendedHashtags: aiResults.recommendedHashtags || [],
    isAIEnhanced: true,
    analysis: aiResults.analysis,
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
