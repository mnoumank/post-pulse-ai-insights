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
  industry?: string,
  apiKey?: string
): Promise<AIAnalysisResponse | null> {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
      },
      body: JSON.stringify({
        inputs: `
          Analyze this LinkedIn post and provide metrics and suggestions:
          Post: "${postContent}"
          ${industry ? `Industry: ${industry}` : ''}
          
          Respond with JSON format containing:
          - engagementScore (1-100)
          - reachScore (1-100)
          - viralityScore (1-100)
          - suggestions array with title and description
          - recommendedHashtags array
          
          Example response:
          {
            "engagementScore": 75,
            "reachScore": 80,
            "viralityScore": 65,
            "suggestions": [
              {
                "title": "Add more personal story",
                "description": "Posts with personal stories get 30% more engagement"
              }
            ],
            "recommendedHashtags": ["career", "success"]
          }
        `,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AI analysis failed:', errorData);
      return null;
    }

    const result = await response.json();
    const generatedText = result[0]?.generated_text;
    
    if (!generatedText) {
      console.error('No generated text in response');
      return null;
    }

    // Extract JSON from the response
    const jsonStart = generatedText.indexOf('{');
    const jsonEnd = generatedText.lastIndexOf('}') + 1;
    const jsonString = generatedText.slice(jsonStart, jsonEnd);
    
    try {
      const parsedResult: AIAnalysisResponse = JSON.parse(jsonString);
      
      // Validate and normalize scores
      parsedResult.engagementScore = Math.min(100, Math.max(1, parsedResult.engagementScore || 50));
      parsedResult.reachScore = Math.min(100, Math.max(1, parsedResult.reachScore || 50));
      parsedResult.viralityScore = Math.min(100, Math.max(1, parsedResult.viralityScore || 50));
      
      // Ensure arrays exist
      parsedResult.suggestions = parsedResult.suggestions || [];
      parsedResult.recommendedHashtags = parsedResult.recommendedHashtags || [];

      return parsedResult;
    } catch (e) {
      console.error('Failed to parse AI response:', generatedText);
      return null;
    }
  } catch (error) {
    console.error('Error during AI post analysis:', error);
    return null;
  }
}

// The following functions remain EXACTLY THE SAME as in your original code:

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