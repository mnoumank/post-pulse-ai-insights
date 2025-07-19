
// Hybrid Analysis System - Combines Enhanced Algorithm with AI Analysis
import { analyzePostVirality, convertToLegacyMetrics, EnhancedViralityResult } from './enhancedViralityAnalyzer';
import { analyzePostWithAI, AIAnalysisResponse, combineAnalysisResults, AIPostMetrics } from './aiAnalyzer';
import { AdvancedAnalysisParams } from './improvedPostAnalyzer';

export interface HybridAnalysisResult {
  enhanced: EnhancedViralityResult;
  legacy: AIPostMetrics;
  confidence: number; // 0-1 scale
  analysisMethod: 'enhanced-only' | 'ai-only' | 'hybrid';
  aiContribution: number; // 0-1 scale (how much AI influenced the result)
}

export interface HybridAnalysisOptions {
  useAI: boolean;
  preferEnhanced: boolean; // When true, prioritizes enhanced algorithm
  confidenceThreshold: number; // 0-1 scale, minimum confidence for AI integration
}

export async function performHybridAnalysis(
  postContent: string,
  advancedParams?: AdvancedAnalysisParams,
  options: HybridAnalysisOptions = {
    useAI: false,
    preferEnhanced: true,
    confidenceThreshold: 0.6
  }
): Promise<HybridAnalysisResult> {
  
  // Always run the enhanced analysis (our scientific baseline)
  const enhancedResult = analyzePostVirality(postContent, advancedParams);
  console.log('Enhanced Analysis Result:', enhancedResult);
  
  // If AI is disabled, return enhanced-only result
  if (!options.useAI) {
    const legacyMetrics = convertToLegacyMetrics(enhancedResult);
    return {
      enhanced: enhancedResult,
      legacy: {
        ...legacyMetrics,
        recommendedHashtags: extractHashtagSuggestions(postContent, enhancedResult),
        isAIEnhanced: false
      },
      confidence: calculateEnhancedConfidence(enhancedResult),
      analysisMethod: 'enhanced-only',
      aiContribution: 0
    };
  }
  
  // Attempt AI analysis
  let aiResult: AIAnalysisResponse | null = null;
  try {
    aiResult = await analyzePostWithAI(postContent, advancedParams?.industry);
    console.log('AI Analysis Result:', aiResult);
  } catch (error) {
    console.error('AI analysis failed, falling back to enhanced-only:', error);
  }
  
  // If AI failed, return enhanced-only
  if (!aiResult) {
    const legacyMetrics = convertToLegacyMetrics(enhancedResult);
    return {
      enhanced: enhancedResult,
      legacy: {
        ...legacyMetrics,
        recommendedHashtags: extractHashtagSuggestions(postContent, enhancedResult),
        isAIEnhanced: false
      },
      confidence: calculateEnhancedConfidence(enhancedResult),
      analysisMethod: 'enhanced-only',
      aiContribution: 0
    };
  }
  
  // Calculate AI confidence based on score consistency and quality
  const aiConfidence = calculateAIConfidence(aiResult, enhancedResult);
  console.log('AI Confidence:', aiConfidence);
  
  // If AI confidence is too low, use enhanced-only
  if (aiConfidence < options.confidenceThreshold) {
    console.log('AI confidence below threshold, using enhanced-only');
    const legacyMetrics = convertToLegacyMetrics(enhancedResult);
    return {
      enhanced: enhancedResult,
      legacy: {
        ...legacyMetrics,
        recommendedHashtags: aiResult.recommendedHashtags || [],
        isAIEnhanced: false,
        analysis: aiResult.analysis
      },
      confidence: calculateEnhancedConfidence(enhancedResult),
      analysisMethod: 'enhanced-only',
      aiContribution: 0.1 // Slight contribution from hashtags and analysis
    };
  }
  
  // Perform intelligent hybrid blending
  const hybridResult = createIntelligentHybrid(enhancedResult, aiResult, aiConfidence, options.preferEnhanced);
  
  return {
    enhanced: enhancedResult,
    legacy: hybridResult,
    confidence: Math.max(calculateEnhancedConfidence(enhancedResult), aiConfidence),
    analysisMethod: 'hybrid',
    aiContribution: options.preferEnhanced ? aiConfidence * 0.3 : aiConfidence * 0.7
  };
}

function calculateEnhancedConfidence(result: EnhancedViralityResult): number {
  // Calculate confidence based on factor consistency and score distribution
  const scores = Object.values(result.factors);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Lower standard deviation = higher confidence (more consistent scores)
  // Normalize to 0-1 scale
  const consistencyScore = Math.max(0, 1 - (standardDeviation / 5));
  
  // Factor in the overall score level (higher scores = higher confidence in analysis)
  const scoreConfidence = result.viralityScore / 10;
  
  // Combine factors
  return Math.min(1, (consistencyScore * 0.6) + (scoreConfidence * 0.4));
}

function calculateAIConfidence(aiResult: AIAnalysisResponse, enhancedResult: EnhancedViralityResult): number {
  // Check score consistency between AI and enhanced algorithm
  const aiScoreAvg = (aiResult.engagementScore + aiResult.reachScore + aiResult.viralityScore) / 3;
  const enhancedScoreScaled = enhancedResult.viralityScore * 10; // Scale to 0-100
  
  const scoreDifference = Math.abs(aiScoreAvg - enhancedScoreScaled);
  const consistencyScore = Math.max(0, 1 - (scoreDifference / 50)); // Normalize difference
  
  // Check for realistic scoring (AI shouldn't give scores that are too high)
  const maxScore = Math.max(aiResult.engagementScore, aiResult.reachScore, aiResult.viralityScore);
  const realismScore = maxScore > 85 ? 0.5 : maxScore > 70 ? 0.8 : 1.0;
  
  // Check for quality indicators in suggestions and analysis
  const qualityScore = (aiResult.suggestions && aiResult.suggestions.length >= 2) ? 1.0 : 0.7;
  
  return Math.min(1, (consistencyScore * 0.5) + (realismScore * 0.3) + (qualityScore * 0.2));
}

function createIntelligentHybrid(
  enhanced: EnhancedViralityResult,
  ai: AIAnalysisResponse,
  aiConfidence: number,
  preferEnhanced: boolean
): AIPostMetrics {
  
  const enhancedLegacy = convertToLegacyMetrics(enhanced);
  
  // Determine blending weights based on preferences and confidence
  const enhancedWeight = preferEnhanced ? 
    Math.max(0.6, 1 - aiConfidence * 0.4) : // 60-100% enhanced when preferring enhanced
    Math.max(0.4, 1 - aiConfidence * 0.6);   // 40-100% enhanced when not preferring
  
  const aiWeight = 1 - enhancedWeight;
  
  console.log(`Hybrid blending: Enhanced ${(enhancedWeight * 100).toFixed(1)}%, AI ${(aiWeight * 100).toFixed(1)}%`);
  
  // Blend scores intelligently
  const blendedEngagement = Math.round(
    (enhancedLegacy.engagementScore * enhancedWeight) + (ai.engagementScore * aiWeight)
  );
  
  const blendedReach = Math.round(
    (enhancedLegacy.reachScore * enhancedWeight) + (ai.reachScore * aiWeight)
  );
  
  const blendedVirality = Math.round(
    (enhancedLegacy.viralityScore * enhancedWeight) + (ai.viralityScore * aiWeight)
  );
  
  // For engagement numbers, use enhanced algorithm as base with AI adjustment
  const engagementMultiplier = Math.max(0.5, blendedEngagement / 60);
  const viralityMultiplier = Math.max(0.3, blendedVirality / 60);
  
  return {
    engagementScore: blendedEngagement,
    reachScore: blendedReach,
    viralityScore: blendedVirality,
    likes: Math.round(enhancedLegacy.likes * engagementMultiplier),
    comments: Math.round(enhancedLegacy.comments * engagementMultiplier),
    shares: Math.round(enhancedLegacy.shares * viralityMultiplier),
    recommendedHashtags: ai.recommendedHashtags || [],
    isAIEnhanced: true,
    analysis: ai.analysis
  };
}

function extractHashtagSuggestions(content: string, result: EnhancedViralityResult): string[] {
  // Generate hashtag suggestions based on enhanced analysis
  const suggestions: string[] = [];
  
  // Based on content analysis
  const lowerContent = content.toLowerCase();
  
  // Professional hashtags based on value/relevance score
  if (result.factors.valueRelevance >= 7) {
    suggestions.push('#ProfessionalTips', '#CareerAdvice', '#Leadership');
  }
  
  // Story-based hashtags
  if (result.factors.storytellingRelatability >= 7) {
    suggestions.push('#MyStory', '#LessonsLearned', '#PersonalGrowth');
  }
  
  // Industry-specific suggestions
  if (lowerContent.includes('tech') || lowerContent.includes('software')) {
    suggestions.push('#Technology', '#Innovation', '#TechCareers');
  }
  
  if (lowerContent.includes('business') || lowerContent.includes('entrepreneur')) {
    suggestions.push('#Business', '#Entrepreneurship', '#StartupLife');
  }
  
  // General LinkedIn hashtags
  suggestions.push('#LinkedIn', '#Professional', '#Networking');
  
  // Return top 5 unique suggestions
  return Array.from(new Set(suggestions)).slice(0, 5);
}
