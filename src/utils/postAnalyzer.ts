// Enhanced LinkedIn Post Analysis with Machine Learning-inspired Techniques

// Interfaces remain the same
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

// Enhanced constants with weighted values and expanded factors
const OPTIMAL_LENGTH = {
  min: 150,
  max: 1300,
  ideal: 750 // Added ideal length
}; 
const POSITIVE_FACTORS = [
  {word: 'thank', weight: 1.2}, {word: 'appreciate', weight: 1.3}, 
  {word: 'excited', weight: 1.5}, {word: 'proud', weight: 1.4},
  {word: 'happy', weight: 1.2}, {word: 'success', weight: 1.6},
  {word: 'grateful', weight: 1.5}, {word: 'joyful', weight: 1.3},
  {word: 'inspired', weight: 1.4}, {word: 'amazing', weight: 1.7},
  {word: 'celebrate', weight: 1.6}, {word: 'accomplishment', weight: 1.5},
  {word: 'positive', weight: 1.4}, {word: 'thrilled', weight: 1.6},
  {word: 'motivation', weight: 1.5}, {word: 'winning', weight: 1.6},
  {word: 'achievement', weight: 1.7}, {word: 'incredible', weight: 1.5},
  {word: 'remarkable', weight: 1.5}, {word: 'unstoppable', weight: 1.8},
  {word: 'persistence', weight: 1.7}, {word: 'invaluable', weight: 1.6},
  {word: 'extraordinary', weight: 1.7}, {word: 'life-changing', weight: 1.8},
  {word: 'outstanding', weight: 1.7}, {word: 'blessed', weight: 1.6},
  {word: 'fortunate', weight: 1.5}, {word: 'inspired', weight: 1.6},
];

const NEGATIVE_FACTORS = [
  {word: 'disappointed', weight: 1.4}, {word: 'unfortunate', weight: 1.2},
  {word: 'sad', weight: 1.3}, {word: 'regret', weight: 1.5},
  {word: 'failure', weight: 1.6}, {word: 'frustrated', weight: 1.5},
  {word: 'hurt', weight: 1.4}, {word: 'unhappy', weight: 1.3},
  {word: 'missed', weight: 1.2}, {word: 'neglected', weight: 1.4},
  {word: 'sorrow', weight: 1.3}, {word: 'painful', weight: 1.5},
  {word: 'betrayal', weight: 1.6}, {word: 'regrettable', weight: 1.4},
  {word: 'losing', weight: 1.7}, {word: 'hopeless', weight: 1.8},
  {word: 'defeated', weight: 1.5}, {word: 'tragic', weight: 1.7},
  {word: 'embarrassment', weight: 1.6}, {word: 'downfall', weight: 1.7},
  {word: 'failure', weight: 1.8}, {word: 'dismay', weight: 1.5},
  {word: 'depression', weight: 1.6}, {word: 'demotivated', weight: 1.7},
  {word: 'rejection', weight: 1.6}, {word: 'heartbreak', weight: 1.7},
  {word: 'despair', weight: 1.8},
];




const ENGAGEMENT_TRIGGERS = [
  {phrase: 'agree?', weight: 1.3}, {phrase: 'thoughts', weight: 1.2},
  {phrase: 'comment below', weight: 1.5}, {phrase: 'share your', weight: 1.4},
  {phrase: 'what do you think', weight: 1.3}, {phrase: 'let us know', weight: 1.5},
  {phrase: 'join the conversation', weight: 1.4}, {phrase: 'have you experienced', weight: 1.6},
  {phrase: 'tag a friend', weight: 1.2}, {phrase: 'share your story', weight: 1.5},
  {phrase: 'don’t miss out', weight: 1.4}, {phrase: 'help us spread the word', weight: 1.3},
  {phrase: 'tell us about your', weight: 1.5}, {phrase: 'give us your thoughts', weight: 1.6},
  {phrase: 'your opinion matters', weight: 1.4}, {phrase: 'voice your opinion', weight: 1.5},
  {phrase: 'drop a comment', weight: 1.4}, {phrase: 'discuss in the comments', weight: 1.5},
  {phrase: 'share with others', weight: 1.3}, {phrase: 'we want to hear from you', weight: 1.6},
  {phrase: 'let’s talk', weight: 1.4}, {phrase: 'what’s your view?', weight: 1.5},
];

const HASHTAG_OPTIMUM = {
  min: 3,
  max: 5,
  ideal: 4
};

const EMOJI_WEIGHTS = {
  '😀': 1.1, '😃': 1.1, '😄': 1.2, '😁': 1.1, '😆': 1.0,
  '😊': 1.3, '😎': 1.4, '💪': 1.5, '🔥': 1.6, '✨': 1.4,
  '👏': 1.5,  '❤️': 1.6, '👍': 1.2, '💯': 1.5,
  '😢': 1.4, '😔': 1.3, '😤': 1.6, '😞': 1.5, '😭': 1.6,
  '🤔': 1.2, '🤩': 1.4, '🥳': 1.6, '😜': 1.1, '🤯': 1.5,
  '💥': 1.70, '🎉': 1.4, '💃': 1.5, '🕺': 1.4, '💝': 1.6,
  '🎯': 1.74, '🤗': 1.5, '🙌': 1.6, '⚡': 1.7001, '🔑': 1.8,
  '🌟': 1.721, '📈': 1.6, '🔓': 1.71, '💬': 1.5, '🔴': 1.4,
};

const HOOK_PHRASES = [
  {phrase: 'i discovered', weight: 1.4}, 
  {phrase: 'breaking:', weight: 1.6},
  {phrase: 'unveiling', weight: 1.5}, 
  {phrase: 'did you know', weight: 1.4},
  {phrase: 'introducing', weight: 1.5},
  {phrase: 'find out', weight: 1.3},
  {phrase: 'here’s why', weight: 1.4},
  {phrase: 'the truth behind', weight: 1.5},
  {phrase: 'how to', weight: 1.6},
  {phrase: 'the secret to', weight: 1.7},
  {phrase: 'why you need to', weight: 1.6},
  {phrase: 'what’s next', weight: 1.5},
  {phrase: 'let’s dive into', weight: 1.6},
  {phrase: 'did you realize', weight: 1.5},
  {phrase: 'the inside scoop', weight: 1.7},
  {phrase: 'here’s the deal', weight: 1.4},
  {phrase: 'your guide to', weight: 1.5},
  {phrase: 'just released', weight: 1.4},
  {phrase: 'see how', weight: 1.5},
  {phrase: 'find out why', weight: 1.6},
  {phrase: 'step into', weight: 1.6},
  {phrase: 'it’s time for', weight: 1.7},
  {phrase: 'you won’t believe', weight: 1.8},
];

const STORYTELLING_ELEMENTS = [
  {element: 'when i', weight: 1.2}, 
  {element: 'my journey', weight: 1.4},
  {element: 'it all started', weight: 1.5},
  {element: 'back then', weight: 1.3},
  {element: 'at that moment', weight: 1.5},
  {element: 'it was a turning point', weight: 1.6},
  {element: 'that’s when i realized', weight: 1.6},
  {element: 'and then', weight: 1.4},
  {element: 'after months of', weight: 1.7},
  {element: 'as time went by', weight: 1.5},
  {element: 'unexpectedly', weight: 1.5},
  {element: 'one day', weight: 1.3},
  {element: 'along the way', weight: 1.5},
  {element: 'from there', weight: 1.6},
  {element: 'looking back', weight: 1.5},
  {element: 'over the years', weight: 1.4},
  {element: 'suddenly', weight: 1.5},
  {element: 'by then', weight: 1.4},
  {element: 'the turning point', weight: 1.6},
  {element: 'what happened next', weight: 1.5},
];

const VALUE_INDICATORS = [
  {indicator: 'cutting-edge', weight: 1.5},
  {indicator: 'game-changing', weight: 1.6},
  {indicator: 'world-class', weight: 1.7},
  {indicator: 'innovative', weight: 1.5},
  {indicator: 'best-in-class', weight: 1.6},
  {indicator: 'state-of-the-art', weight: 1.7},
  {indicator: 'top-tier', weight: 1.5},
  {indicator: 'premium', weight: 1.6},
  {indicator: 'leading', weight: 1.7},
  {indicator: 'unparalleled', weight: 1.6},
  {indicator: 'exclusive', weight: 1.7},
  {indicator: 'next-level', weight: 1.6},
  {indicator: 'outstanding', weight: 1.7},
  {indicator: 'top-of-the-line', weight: 1.8},
  {indicator: 'innovative', weight: 1.6},
  {indicator: 'exceptional', weight: 1.6},
  {indicator: 'premium quality', weight: 1.5},
  {indicator: 'best quality', weight: 1.6},
];

const INDUSTRY_KEYWORDS = [
  'technology', 'innovation', 'entrepreneurship', 'business', 'leadership', 'growth', 
  'startup', 'disruption', 'strategy', 'marketing', 'branding', 'investing', 
  'funding', 'venture capital', 'productivity', 'sustainability', 'AI', 'machine learning',
  'data', 'cloud', 'digital transformation', 'web 3.0', 'crypto', 'blockchain', 'fintech', 
  'leadership development', 'sales', 'customer service', 'healthcare', 'e-commerce',
  'financial services', 'software development', 'automation', 'robotics', 'cybersecurity', 
  'education', 'remote work', 'online learning', 'self-improvement', 'personal growth',
  'digital marketing', 'UX/UI', 'agile', 'design thinking', 'customer experience',
  'mobile app development', 'data science', 'AR/VR', 'IoT', '5G', 'edge computing', 'tech trends',
];


// Time and day weights for LinkedIn post timing optimization

const TIME_OF_DAY_WEIGHTS = {
  '0-2': 0.9,   // Late night
  '2-4': 0.8,   // Very late night
  '4-6': 1.0,   // Early morning
  '6-8': 1.15,  // Morning start
  '8-10': 1.2,  // Morning peak, great time for engagement
  '10-12': 1.3, // Late morning
  '12-14': 1.4, // Early afternoon, ideal for posting during lunch breaks
  '14-16': 1.3, // Mid-afternoon
  '16-18': 1.4, // Late afternoon, another peak time
  '18-20': 1.3, // Evening, when professionals wrap up their day
  '20-22': 1.1, // Night, winding down but still decent engagement
  '22-24': 1.0, // Late night, low engagement
};

const DAY_OF_WEEK_WEIGHTS = {
  'monday': 1.1,     // Start of the week, people are catching up
  'tuesday': 1.15,   // Best day for engagement, people are active and focused
  'wednesday': 1.2,  // Mid-week, higher productivity and engagement
  'thursday': 1.25,  // Another strong day for engagement, closer to the weekend
  'friday': 1.2,     // People preparing for the weekend, engagement is still good
  'saturday': 1.0,   // Weekend, lower engagement but might get attention
  'sunday': 0.9,     // End of the weekend, low engagement for professional posts
};



// Enhanced text fingerprint using hash of first 100 words
function getTextFingerprint(text: string): string {
  const words = text.trim().toLowerCase().split(/\s+/).slice(0, 100).join(' ');
  let hash = 0;
  for (let i = 0; i < words.length; i++) {
    const char = words.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

// Enhanced reading time calculation with syllable analysis
function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/);
  const syllableCount = words.reduce((total, word) => total + countSyllables(word), 0);
  const avgSyllablesPerWord = syllableCount / words.length;
  
  // Adjust reading speed based on complexity
  let baseSpeed = 225;
  if (avgSyllablesPerWord > 1.8) baseSpeed -= 25;
  
  return Math.max(1, Math.ceil(words.length / baseSpeed));
}

// Enhanced syllable counting algorithm
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  return Math.max(1, (word.match(/[aeiouy]{1,2}/g) || []).length);
}

// Enhanced content structure analysis
function analyzeContentStructure(text: string): {
  paragraphs: number;
  bulletPoints: number;
  numberedLists: number;
  headings: number;
} {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  let paragraphs = 0;
  let bulletPoints = 0;
  let numberedLists = 0;
  let headings = 0;
  let inParagraph = false;

  const bulletRegex = /^\s*[\-\•\*]\s/;
  const numberedRegex = /^\s*\d+[\.\)]\s/;
  const headingRegex = /^\s*#{1,3}\s/;

  for (const line of lines) {
    if (headingRegex.test(line)) {
      headings++;
      inParagraph = false;
    } else if (bulletRegex.test(line)) {
      bulletPoints++;
      inParagraph = false;
    } else if (numberedRegex.test(line)) {
      numberedLists++;
      inParagraph = false;
    } else if (line.trim().length > 0) {
      if (!inParagraph) {
        paragraphs++;
        inParagraph = true;
      }
    } else {
      inParagraph = false;
    }
  }

  return { paragraphs, bulletPoints, numberedLists, headings };
}

// Enhanced emoji analysis with weights
function analyzeEmojis(text: string): { count: number; score: number } {
  const emojiRegex = /[\u{1F600}-\u{1F6FF}]/gu;
  const emojis = text.match(emojiRegex) || [];
  const uniqueEmojis = [...new Set(emojis)];
  
  const score = (emojis as string[]).reduce((total, emoji) => {
    return total + (EMOJI_WEIGHTS[emoji] || 1.0);
  }, 0);
  
  return {
    count: emojis.length,
    score: Math.min(2.0, 1.0 + (Number(score) * 0.05))
  };
}

// Enhanced sentiment analysis with weighted words
function analyzeSentiment(text: string): number {
  const lowerText = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  const words = lowerText.split(/\s+/);
  const totalWords = words.length;

  POSITIVE_FACTORS.forEach(({ word, weight }) => {
    if (lowerText.includes(word)) {
      positiveScore += weight;
    }
  });

  NEGATIVE_FACTORS.forEach(({ word, weight }) => {
    if (lowerText.includes(word)) {
      negativeScore += weight;
    }
  });

  const positiveRatio = positiveScore / totalWords;
  const negativeRatio = negativeScore / totalWords;
  
  return Math.min(1.5, Math.max(-0.5, (positiveRatio - negativeRatio) * 2));
}

// Enhanced engagement trigger analysis
function analyzeEngagementTriggers(text: string): number {
  const lowerText = text.toLowerCase();
  let triggerScore = 0;
  
  ENGAGEMENT_TRIGGERS.forEach(({ phrase, weight }) => {
    if (lowerText.includes(phrase)) {
      triggerScore += weight;
    }
  });

  return Math.min(2.0, 1.0 + (triggerScore * 0.1));
}

// Enhanced hook strength analysis
function analyzeHookStrength(text: string): number {
  const firstHundred = text.toLowerCase().substring(0, 100);
  let score = 1.0;

  if (firstHundred.includes('?')) score += 0.15;

  let hookPhrasesFound = 0;
  for (const { phrase, weight } of HOOK_PHRASES) {
    if (firstHundred.includes(phrase)) {
      hookPhrasesFound++;
      score += weight * 0.1;
      if (hookPhrasesFound >= 2) break;
    }
  }

  if (/\d+/.test(firstHundred)) score += 0.1;
  if (countEmojis(firstHundred) > 0) score += 0.15;

  return Math.min(1.5, score);
}

// Enhanced storytelling analysis
function analyzeStorytellingElements(text: string): number {
  const lowerText = text.toLowerCase();
  let elementsFound = 0;
  let personalPronouns = 0;

  for (const { element, weight } of STORYTELLING_ELEMENTS) {
    if (lowerText.includes(element)) {
      elementsFound++;
      if (elementsFound >= 5) break;
    }
  }

  const pronouns = [' i ', ' me ', ' my ', ' mine ', ' we ', ' our ', ' us '];
  for (const pronoun of pronouns) {
    let pos = lowerText.indexOf(pronoun);
    while (pos !== -1) {
      personalPronouns++;
      pos = lowerText.indexOf(pronoun, pos + 1);
    }
  }

  return 1.0 + Math.min(0.3, elementsFound * 0.06) + Math.min(0.2, personalPronouns * 0.02);
}

// Enhanced value proposition analysis
function analyzeValueProposition(text: string): number {
  const lowerText = text.toLowerCase();
  let indicatorsFound = 0;

  for (const { indicator, weight } of VALUE_INDICATORS) {
    if (lowerText.includes(indicator)) {
      indicatorsFound++;
      if (indicatorsFound >= 6) break;
    }
  }

  const hasStatistics = /\d+%|\d+ percent|\d+x/i.test(text);
  return 1.0 + Math.min(0.3, indicatorsFound * 0.05) + (hasStatistics ? 0.1 : 0);
}

// Enhanced industry relevance analysis
function analyzeIndustryRelevance(text: string, industry: string): number {
  if (!industry || !INDUSTRY_KEYWORDS[industry]) return 1.0;
  
  const lowerText = text.toLowerCase();
  let relevanceScore = 0;
  
  INDUSTRY_KEYWORDS[industry].forEach(({ keyword, score }) => {
    if (lowerText.includes(keyword)) {
      relevanceScore += score;
    }
  });

  return 0.8 + Math.min(1.2, relevanceScore * 0.1);
}

// Enhanced post analysis with all factors
export function analyzePost(postContent: string, advancedParams?: AdvancedAnalysisParams): PostMetrics {
  const fingerprint = getTextFingerprint(postContent);
  
  // Check cache first
  if (analysisCache.has(fingerprint)) {
    return { ...analysisCache.get(fingerprint)! };
  }

  // Enhanced content analysis
  const contentAnalysis = {
    ...analyzeContentStructure(postContent),
    readingTime: calculateReadingTime(postContent),
    sentiment: analyzeSentiment(postContent),
    engagementTriggers: analyzeEngagementTriggers(postContent),
    emojis: analyzeEmojis(postContent),
    hookStrength: analyzeHookStrength(postContent),
    storytelling: analyzeStorytellingElements(postContent),
    valueProposition: analyzeValueProposition(postContent),
    industryRelevance: advancedParams?.industry ? 
      analyzeIndustryRelevance(postContent, advancedParams.industry) : 1.0
  };

  // Enhanced scoring multipliers
  const multipliers = {
    length: calculateLengthMultiplier(postContent.length),
    sentiment: 1 + (contentAnalysis.sentiment * 0.15),
    engagement: contentAnalysis.engagementTriggers,
    emojis: contentAnalysis.emojis.score,
    hookStrength: contentAnalysis.hookStrength,
    storytelling: contentAnalysis.storytelling,
    valueProposition: contentAnalysis.valueProposition,
    industryRelevance: contentAnalysis.industryRelevance,
    // ... other multipliers
  };

  // Enhanced advanced parameter handling
  let advancedMultiplier = 1.0;
  if (advancedParams) {
    advancedMultiplier *= calculateFollowerImpact(advancedParams.followerRange);
    advancedMultiplier *= calculateEngagementImpact(advancedParams.engagementLevel);
  }

  // Enhanced score calculation
  const scores = {
    engagement: calculateEngagementScore(
      baseScores.engagement,
      multipliers,
      advancedMultiplier
    ),
    reach: calculateReachScore(
      baseScores.reach,
      multipliers,
      advancedMultiplier
    ),
    virality: calculateViralityScore(
      baseScores.virality,
      multipliers,
      advancedMultiplier
    )
  };

  // Enhanced engagement estimation
  const engagementEstimates = {
    likes: estimateLikes(scores.engagement, multipliers),
    comments: estimateComments(scores.engagement, multipliers),
    shares: estimateShares(scores.virality, multipliers)
  };

  const result = {
    engagementScore: scores.engagement,
    reachScore: scores.reach,
    viralityScore: scores.virality,
    likes: engagementEstimates.likes,
    comments: engagementEstimates.comments,
    shares: engagementEstimates.shares
  };

  // Cache result
  analysisCache.set(fingerprint, { ...result });
  return result;
}

// Enhanced time series generation with realistic engagement curve
export function generateTimeSeries(postContent: string, hours: number = 24): TimeSeriesData[] {
  const { engagementScore } = analyzePost(postContent);
  const data: TimeSeriesData[] = [];
  
  // Enhanced engagement curve modeling
  for (let hour = 0; hour < hours; hour++) {
    let engagement: number;
    
    if (hour < 3) {
      // Initial rapid growth phase
      engagement = engagementScore * (0.2 + (0.8 * (hour / 3)));
    } else if (hour < 8) {
      // Peak and slight decay phase
      const peakHeight = engagementScore * (0.9 + (Math.random() * 0.1));
      engagement = peakHeight * (1 - (0.03 * (hour - 3)));
    } else {
      // Long tail decay phase
      const decayRate = 0.04 + (Math.random() * 0.03);
      engagement = engagementScore * 0.7 * Math.pow(1 - decayRate, hour - 8);
    }
    
    data.push({
      time: `${hour}h`,
      engagement: Math.round(Math.max(engagementScore * 0.2, engagement))
    });
  }
  
  return data;
}

// Enhanced suggestion generation with more specific recommendations
export function generateSuggestions(postContent: string): PostSuggestion[] {
  const analysis = analyzePost(postContent);
  const suggestions: PostSuggestion[] = [];
  
  // Length suggestion
  if (postContent.length < OPTIMAL_LENGTH.min) {
    suggestions.push({
      id: 'length-short',
      type: 'improvement',
      title: 'Increase post length',
      description: `Your post is ${Math.round((postContent.length/OPTIMAL_LENGTH.min)*100)}% of the recommended minimum length. Add more details or examples.`
    });
  } else if (postContent.length > OPTIMAL_LENGTH.max) {
    suggestions.push({
      id: 'length-long',
      type: 'warning',
      title: 'Consider shortening your post',
      description: `Your post is ${Math.round((postContent.length/OPTIMAL_LENGTH.max)*100)}% of the recommended maximum length. Consider splitting into multiple posts.`
    });
  }
  
  // Engagement triggers suggestion
  if (analysis.engagementScore < 60) {
    suggestions.push({
      id: 'engagement-low',
      type: 'improvement',
      title: 'Add engagement triggers',
      description: 'Include questions or calls-to-action to increase comments and shares.'
    });
  }
  
  // Sentiment suggestion
  const sentiment = analyzeSentiment(postContent);
  if (sentiment < -0.2) {
    suggestions.push({
      id: 'sentiment-negative',
      type: 'warning',
      title: 'Negative tone detected',
      description: 'Consider balancing negative statements with positive solutions or outcomes.'
    });
  }
  
  // Add more sophisticated suggestions...
  
  return suggestions;
}

// Enhanced post comparison with better margin calculation
export function comparePostsPerformance(
  post1: string, 
  post2: string, 
  advancedParams?: AdvancedAnalysisParams
) {
  const metrics1 = analyzePost(post1, advancedParams);
  const metrics2 = analyzePost(post2, advancedParams);

  // Enhanced scoring formula
  const post1Score = (metrics1.engagementScore * 0.45) + 
                     (metrics1.reachScore * 0.3) + 
                     (metrics1.viralityScore * 0.25);
  const post2Score = (metrics2.engagementScore * 0.45) + 
                     (metrics2.reachScore * 0.3) + 
                     (metrics2.viralityScore * 0.25);

  // Enhanced margin calculation
  const margin = Math.abs(post1Score - post2Score) / 
                Math.min(post1Score, post2Score) * 100;

  return {
    winner: post1Score > post2Score ? 1 : post2Score > post1Score ? 2 : 0,
    margin: Number(margin.toFixed(1)),
    metrics1,
    metrics2
  };
}

// Utility exports for testing
export const analyzers = {
  calculateReadingTime,
  analyzeContentStructure,
  analyzeEmojis,
  analyzeSentiment,
  analyzeEngagementTriggers,
  getTextFingerprint,
  analyzeHookStrength,
  analyzeStorytellingElements,
  analyzeValueProposition
};

// Internal implementations
const analysisCache = new Map<string, PostMetrics>();
const baseScores = {
  engagement: 50,
  reach: 50,
  virality: 50
};

function calculateLengthMultiplier(length: number): number {
  const optimalRangeCenter = (OPTIMAL_LENGTH.min + OPTIMAL_LENGTH.max) / 2;
  const optimalRangeWidth = (OPTIMAL_LENGTH.max - OPTIMAL_LENGTH.min) / 2;
  
  const distanceFromCenter = Math.abs(length - optimalRangeCenter);
  const normalizedDistance = distanceFromCenter / optimalRangeWidth;
  
  return Math.min(1.5, Math.max(0.7, 1.2 - Math.pow(normalizedDistance, 1.5) * 0.5));
}

function calculateFollowerImpact(followerRange: string): number {
  const impacts = {
    '0-500': 0.4, '500-1K': 0.6, '1K-5K': 1.0,
    '5K-10K': 1.7, '10K-50K': 2.2, '50K+': 3.0
  };
  return impacts[followerRange] || 1.0;
}

function calculateEngagementImpact(engagementLevel: string): number {
  const impacts = {
    'High': 1.8, 'Medium': 1.0, 'Low': 0.4
  };
  return impacts[engagementLevel] || 1.0;
}

function calculateEngagementScore(
  base: number,
  multipliers: Record<string, number>,
  advancedMultiplier: number
): number {
  return Math.min(100, Math.round(
    base *
    multipliers.length *
    multipliers.sentiment *
    multipliers.engagement *
    multipliers.emojis *
    multipliers.hookStrength *
    multipliers.storytelling *
    multipliers.valueProposition *
    multipliers.industryRelevance *
    advancedMultiplier
  ));
}

function calculateReachScore(
  base: number,
  multipliers: Record<string, number>,
  advancedMultiplier: number
): number {
  return Math.min(100, Math.round(
    base *
    multipliers.length *
    multipliers.emojis *
    multipliers.hookStrength *
    multipliers.industryRelevance *
    advancedMultiplier * 0.9
  ));
}

function calculateViralityScore(
  base: number,
  multipliers: Record<string, number>,
  advancedMultiplier: number
): number {
  return Math.min(100, Math.round(
    base *
    multipliers.engagement *
    multipliers.sentiment *
    multipliers.emojis *
    multipliers.storytelling *
    multipliers.valueProposition *
    advancedMultiplier * 1.1
  ));
}

function estimateLikes(engagementScore: number, multipliers: Record<string, number>): number {
  return Math.floor(
    Math.pow(engagementScore, 1.15) * 
    0.5 * 
    multipliers.sentiment
  );
}

function estimateComments(engagementScore: number, multipliers: Record<string, number>): number {
  return Math.floor(
    Math.pow(engagementScore, 1.35) * 
    0.08 * 
    multipliers.engagement
  );
}

function estimateShares(viralityScore: number, multipliers: Record<string, number>): number {
  return Math.floor(
    Math.pow(viralityScore, 1.25) * 
    0.12 * 
    multipliers.sentiment
  );
}
function countEmojis(text: string): number {
  const emojiRegex = /[\u{1F600}-\u{1F6FF}]/gu;
  const emojis = text.match(emojiRegex) || [];
  return emojis.length;
}
