
// Improved LinkedIn Post Analysis with realistic scoring
// This replaces the overly generous scoring in postAnalyzer.ts

export interface PostMetrics {
  engagementScore: number;
  reachScore: number;
  viralityScore: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface TimeSeriesData {
  time: string;
  engagement: number;
}

export interface PostSuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'tip';
  title: string;
  description: string;
}

export interface AdvancedAnalysisParams {
  followerRange: string;
  industry: string;
  engagementLevel: string;
}

// Realistic base scores (much lower)
const BASE_SCORES = {
  engagement: 25,
  reach: 20,
  virality: 15,
};

// Content quality factors
const POSITIVE_FACTORS = [
  'thank', 'appreciate', 'excited', 'proud', 'happy', 'success', 
  'achievement', 'accomplished', 'growth', 'learned', 'opportunity',
  'connection', 'network', 'professional', 'career', 'insights'
];

const ENGAGEMENT_TRIGGERS = [
  'agree?', '?', 'thoughts', 'comment', 'share', 'like', 'what do you think',
  'your experience', 'your opinion', 'what would you', 'who else', 'tag someone'
];

const HOOK_PHRASES = [
  'i discovered', 'i learned', 'breaking:', 'unpopular opinion', 'the truth about',
  'little known fact', 'secret to', 'what nobody tells you', 'attention',
  'game changer', 'revealed', 'case study', 'my biggest mistake'
];

const STORYTELLING_ELEMENTS = [
  'when i', 'i remember', 'last week', 'last year', 'yesterday', 'today',
  'my journey', 'lesson learned', 'failure', 'success', 'challenge', 'overcome'
];

const VALUE_INDICATORS = [
  'benefit', 'advantage', 'save time', 'boost', 'increase', 'improve', 'solution',
  'tips', 'tricks', 'strategy', 'framework', 'how to', 'steps to', 'proven'
];

// Industry-specific performance baselines (realistic multipliers)
const INDUSTRY_PERFORMANCE = {
  'Technology': { baseline: 1.2, engagement: 1.1, reach: 1.3 },
  'Marketing': { baseline: 1.3, engagement: 1.4, reach: 1.2 },
  'Finance': { baseline: 0.9, engagement: 0.8, reach: 1.0 },
  'Healthcare': { baseline: 0.8, engagement: 0.9, reach: 0.8 },
  'Education': { baseline: 1.0, engagement: 1.2, reach: 0.9 },
  'Retail': { baseline: 1.1, engagement: 1.0, reach: 1.1 },
};

// Logarithmic scaling function for diminishing returns
function logScale(value: number, maxValue: number = 1.0): number {
  return Math.log(1 + value) / Math.log(1 + maxValue);
}

// Weighted combination instead of multiplication
function weightedScore(baseScore: number, factors: { weight: number; value: number }[]): number {
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weightedSum = factors.reduce((sum, f) => sum + (f.weight * f.value), 0);
  return baseScore + (weightedSum / totalWeight) * 30; // Max 30 point bonus
}

// Content length analysis with realistic curves
function analyzeContentLength(text: string): number {
  const length = text.length;
  
  // Optimal range: 150-800 characters (tighter than before)
  if (length < 50) return 0.3; // Too short
  if (length < 150) return 0.5 + (length - 50) / 100 * 0.3; // Growing
  if (length <= 800) return 0.8 + 0.2 * Math.cos((length - 150) / 650 * Math.PI); // Peak zone
  if (length <= 1500) return 0.8 - (length - 800) / 700 * 0.4; // Declining
  return 0.4; // Too long
}

// Engagement trigger analysis with diminishing returns
function analyzeEngagementTriggers(text: string): number {
  const lowerText = text.toLowerCase();
  const triggers = ENGAGEMENT_TRIGGERS.filter(trigger => lowerText.includes(trigger));
  const uniqueTriggers = new Set(triggers).size;
  
  // Logarithmic scaling - first trigger is worth more than subsequent ones
  return logScale(uniqueTriggers, 3) * 0.8; // Max 0.8 multiplier
}

// Hook strength analysis
function analyzeHookStrength(text: string): number {
  const firstLine = text.split('\n')[0].toLowerCase();
  const first100Chars = text.substring(0, 100).toLowerCase();
  
  let score = 0;
  
  // Question in opening
  if (firstLine.includes('?')) score += 0.3;
  
  // Hook phrases
  const hookMatches = HOOK_PHRASES.filter(phrase => first100Chars.includes(phrase));
  score += Math.min(0.4, hookMatches.length * 0.15);
  
  // Numbers in opening
  if (/\d+/.test(first100Chars)) score += 0.2;
  
  // Personal opening
  if (first100Chars.startsWith('i ') || first100Chars.includes(' i ')) score += 0.1;
  
  return Math.min(1.0, score);
}

// Storytelling elements analysis
function analyzeStorytelling(text: string): number {
  const lowerText = text.toLowerCase();
  const storyElements = STORYTELLING_ELEMENTS.filter(element => lowerText.includes(element));
  const personalPronouns = (lowerText.match(/\b(i|me|my|mine)\b/g) || []).length;
  
  const storyScore = logScale(storyElements.length, 5) * 0.6;
  const personalScore = logScale(personalPronouns, 15) * 0.4;
  
  return storyScore + personalScore;
}

// Value proposition analysis
function analyzeValueProposition(text: string): number {
  const lowerText = text.toLowerCase();
  const valueIndicators = VALUE_INDICATORS.filter(indicator => lowerText.includes(indicator));
  const hasStats = /\d+%|\d+ percent|\d+x/i.test(text);
  
  return logScale(valueIndicators.length, 4) * 0.7 + (hasStats ? 0.3 : 0);
}

// Follower count impact (much more realistic)
function getFollowerMultiplier(followerRange: string): number {
  switch (followerRange) {
    case '0-500': return 0.6; // Significant but not devastating penalty
    case '500-1K': return 0.8;
    case '1K-5K': return 1.0; // Baseline
    case '5K-10K': return 1.3; // Modest boost
    case '10K+': return 1.6; // Good boost, not crazy
    default: return 1.0;
  }
}

// Industry relevance (more nuanced)
function getIndustryMultiplier(industry: string): { engagement: number; reach: number; virality: number } {
  const defaults = { engagement: 1.0, reach: 1.0, virality: 1.0 };
  const performance = INDUSTRY_PERFORMANCE[industry];
  
  if (!performance) return defaults;
  
  return {
    engagement: performance.engagement,
    reach: performance.baseline * performance.reach,
    virality: performance.baseline
  };
}

// Main analysis function with improved scoring
export function analyzePost(postContent: string, advancedParams?: AdvancedAnalysisParams): PostMetrics {
  const cleanContent = postContent.trim().toLowerCase();
  
  if (!cleanContent) {
    return {
      engagementScore: 0,
      reachScore: 0,
      viralityScore: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    };
  }
  
  // Content analysis factors (0-1 range)
  const lengthFactor = analyzeContentLength(postContent);
  const engagementTriggerFactor = analyzeEngagementTriggers(postContent);
  const hookFactor = analyzeHookStrength(postContent);
  const storytellingFactor = analyzeStorytelling(postContent);
  const valueFactor = analyzeValueProposition(postContent);
  
  // Hashtag analysis (more conservative)
  const hashtagCount = (postContent.match(/#\w+/g) || []).length;
  let hashtagFactor = 0.5; // Default penalty for no hashtags
  if (hashtagCount >= 1 && hashtagCount <= 3) hashtagFactor = 1.0; // Optimal
  else if (hashtagCount >= 4 && hashtagCount <= 5) hashtagFactor = 0.8; // Good
  else if (hashtagCount > 5) hashtagFactor = 0.6; // Too many
  
  // Structure analysis
  const hasLineBreaks = postContent.includes('\n');
  const hasBullets = /^\s*[\-\•\*]/m.test(postContent);
  const structureFactor = 0.7 + (hasLineBreaks ? 0.15 : 0) + (hasBullets ? 0.15 : 0);
  
  // Advanced parameters
  const followerMultiplier = advancedParams ? getFollowerMultiplier(advancedParams.followerRange) : 1.0;
  const industryMultipliers = advancedParams ? getIndustryMultiplier(advancedParams.industry) : 
    { engagement: 1.0, reach: 1.0, virality: 1.0 };
  
  // Engagement level impact
  let engagementLevelMultiplier = 1.0;
  if (advancedParams?.engagementLevel === 'High') engagementLevelMultiplier = 1.4;
  else if (advancedParams?.engagementLevel === 'Low') engagementLevelMultiplier = 0.7;
  
  // Calculate scores using weighted combinations
  const engagementFactors = [
    { weight: 3, value: lengthFactor },
    { weight: 4, value: engagementTriggerFactor },
    { weight: 3, value: hookFactor },
    { weight: 3, value: storytellingFactor },
    { weight: 2, value: hashtagFactor },
    { weight: 2, value: structureFactor }
  ];
  
  const reachFactors = [
    { weight: 3, value: lengthFactor },
    { weight: 2, value: hashtagFactor },
    { weight: 4, value: hookFactor },
    { weight: 2, value: structureFactor },
    { weight: 1, value: engagementTriggerFactor }
  ];
  
  const viralityFactors = [
    { weight: 4, value: storytellingFactor },
    { weight: 3, value: valueFactor },
    { weight: 3, value: engagementTriggerFactor },
    { weight: 2, value: hookFactor },
    { weight: 1, value: hashtagFactor }
  ];
  
  // Calculate base scores with weighted factors
  let engagementScore = weightedScore(BASE_SCORES.engagement, engagementFactors);
  let reachScore = weightedScore(BASE_SCORES.reach, reachFactors);
  let viralityScore = weightedScore(BASE_SCORES.virality, viralityFactors);
  
  // Apply external multipliers
  engagementScore *= followerMultiplier * industryMultipliers.engagement * engagementLevelMultiplier;
  reachScore *= followerMultiplier * industryMultipliers.reach;
  viralityScore *= followerMultiplier * industryMultipliers.virality;
  
  // Cap at 100 and round
  engagementScore = Math.min(100, Math.round(engagementScore));
  reachScore = Math.min(100, Math.round(reachScore));
  viralityScore = Math.min(100, Math.round(viralityScore));
  
  // Calculate engagement numbers (more realistic)
  const baseEngagement = Math.max(1, followerMultiplier * 10);
  const likes = Math.floor(engagementScore * baseEngagement * 0.8);
  const comments = Math.floor(engagementScore * baseEngagement * 0.15);
  const shares = Math.floor(viralityScore * baseEngagement * 0.1);
  
  return {
    engagementScore,
    reachScore,
    viralityScore,
    likes,
    comments,
    shares,
  };
}

// Generate time series with more realistic engagement curves
export function generateTimeSeries(postContent: string, hours: number = 24): TimeSeriesData[] {
  const { engagementScore } = analyzePost(postContent);
  const data: TimeSeriesData[] = [];
  
  for (let hour = 0; hour < hours; hour++) {
    let engagement;
    
    if (hour < 2) {
      // Slower initial growth
      engagement = engagementScore * 0.1 * (hour + 1) / 2;
    } else if (hour < 6) {
      // Peak building
      engagement = engagementScore * (0.1 + 0.4 * (hour - 1) / 5);
    } else if (hour < 12) {
      // Peak maintenance
      engagement = engagementScore * (0.5 + 0.3 * Math.sin((hour - 6) / 6 * Math.PI));
    } else {
      // Gradual decline
      const decay = Math.exp(-(hour - 12) / 8);
      engagement = engagementScore * 0.5 * decay;
    }
    
    data.push({
      time: `${hour}h`,
      engagement: Math.max(1, Math.round(engagement)),
    });
  }
  
  return data;
}

// Enhanced suggestions with score-specific recommendations
export function generateSuggestions(postContent: string): PostSuggestion[] {
  const suggestions: PostSuggestion[] = [];
  const metrics = analyzePost(postContent);
  
  // Length-based suggestions
  const length = postContent.length;
  if (length < 150) {
    suggestions.push({
      id: 'length-short',
      type: 'improvement',
      title: 'Expand your content',
      description: 'Posts between 150-800 characters typically perform better. Add more context, examples, or insights.',
    });
  } else if (length > 1500) {
    suggestions.push({
      id: 'length-long',
      type: 'warning',
      title: 'Consider shortening',
      description: 'Very long posts may lose reader attention. Try breaking into multiple posts or cutting unnecessary details.',
    });
  }
  
  // Engagement trigger analysis
  const hasQuestion = postContent.includes('?');
  const hasCallToAction = ENGAGEMENT_TRIGGERS.some(trigger => 
    postContent.toLowerCase().includes(trigger)
  );
  
  if (!hasQuestion && !hasCallToAction) {
    suggestions.push({
      id: 'engagement-missing',
      type: 'improvement',
      title: 'Add engagement prompt',
      description: 'End with a question or call-to-action to encourage comments and discussion.',
    });
  }
  
  // Hook analysis
  const hookStrength = analyzeHookStrength(postContent);
  if (hookStrength < 0.3) {
    suggestions.push({
      id: 'weak-hook',
      type: 'improvement',
      title: 'Strengthen your opening',
      description: 'Start with a compelling hook - a question, surprising fact, or personal story opener.',
    });
  }
  
  // Hashtag analysis
  const hashtagCount = (postContent.match(/#\w+/g) || []).length;
  if (hashtagCount === 0) {
    suggestions.push({
      id: 'no-hashtags',
      type: 'improvement',
      title: 'Add relevant hashtags',
      description: 'Include 1-3 industry-relevant hashtags to improve discoverability.',
    });
  } else if (hashtagCount > 5) {
    suggestions.push({
      id: 'too-many-hashtags',
      type: 'warning',
      title: 'Reduce hashtags',
      description: 'Too many hashtags can appear spammy. Stick to 1-3 highly relevant ones.',
    });
  }
  
  // Structure suggestions
  if (!postContent.includes('\n')) {
    suggestions.push({
      id: 'add-structure',
      type: 'tip',
      title: 'Break into paragraphs',
      description: 'Use line breaks to improve readability and make your content more scannable.',
    });
  }
  
  // Score-based suggestions
  if (metrics.engagementScore < 40) {
    suggestions.push({
      id: 'low-engagement',
      type: 'improvement',
      title: 'Boost engagement potential',
      description: 'Try adding personal anecdotes, asking questions, or sharing lessons learned.',
    });
  }
  
  if (metrics.viralityScore < 30) {
    suggestions.push({
      id: 'low-virality',
      type: 'tip',
      title: 'Increase shareability',
      description: 'Content with strong value propositions, surprising insights, or emotional stories gets shared more.',
    });
  }
  
  return suggestions.slice(0, 4); // Limit to most important suggestions
}

// Compare posts with more nuanced analysis
export function comparePostsPerformance(post1: string, post2: string, advancedParams?: AdvancedAnalysisParams) {
  const metrics1 = analyzePost(post1, advancedParams);
  const metrics2 = analyzePost(post2, advancedParams);
  
  // Weighted overall score (engagement weighted higher)
  const score1 = metrics1.engagementScore * 0.5 + metrics1.reachScore * 0.3 + metrics1.viralityScore * 0.2;
  const score2 = metrics2.engagementScore * 0.5 + metrics2.reachScore * 0.3 + metrics2.viralityScore * 0.2;
  
  const difference = Math.abs(score1 - score2);
  const margin = difference > 0 ? (difference / Math.min(score1, score2)) * 100 : 0;
  
  let winner = 0;
  if (difference > 2) { // Only declare winner if meaningful difference
    winner = score1 > score2 ? 1 : 2;
  }
  
  return {
    winner,
    margin: Math.round(margin),
    metrics1,
    metrics2
  };
}

// Export utilities
export const analyzers = {
  analyzeContentLength,
  analyzeEngagementTriggers,
  analyzeHookStrength,
  analyzeStorytelling,
  analyzeValueProposition,
  logScale,
  weightedScore
};
