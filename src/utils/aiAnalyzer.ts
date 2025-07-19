
import { PostMetrics, PostSuggestion } from './improvedPostAnalyzer';

export interface AIAnalysisResponse {
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
    const response = await fetch('/api/rest/v1/functions/analyze-post-ai/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjem11bWV5YnVpbGJ3b2doY3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDYwMzMsImV4cCI6MjA2MDM4MjAzM30.0XOVeH7svDmsXRgjmiMWdqCOXLu3-_GP4JaQVFx48ZQ`,
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

  // More conservative blending: 50% algorithmic, 50% AI
  // This prevents AI from completely overriding the improved algorithmic scoring
  const combinedEngagementScore = Math.round(
    algorithmicResults.engagementScore * 0.5 + aiResults.engagementScore * 0.5
  );
  
  const combinedReachScore = Math.round(
    algorithmicResults.reachScore * 0.5 + aiResults.reachScore * 0.5
  );
  
  const combinedViralityScore = Math.round(
    algorithmicResults.viralityScore * 0.5 + aiResults.viralityScore * 0.5
  );

  // More realistic engagement scaling based on combined scores
  const engagementMultiplier = Math.max(0.5, combinedEngagementScore / 60); // Base of 60 instead of 50
  const viralityMultiplier = Math.max(0.3, combinedViralityScore / 60);

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
