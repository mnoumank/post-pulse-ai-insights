// This file contains functions to analyze LinkedIn posts and predict performance

// Interfaces
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

// Constants - factors that affect LinkedIn post performance
const OPTIMAL_LENGTH = {
  min: 150,
  max: 1300,
};

const POSITIVE_FACTORS = [
  'thank', 'appreciate', 'excited', 'proud', 'happy', 'success', 
  'achievement', 'accomplished', 'growth', 'learned', 'opportunity',
  'connection', 'network', 'professional', 'career', 'job', 'hiring',
  'tips', 'advice', 'how to', 'guide', 'insights', 'experience', 'story'
];

const NEGATIVE_FACTORS = [
  'disappointed', 'unfortunate', 'sad', 'regret', 'sorry', 'problem', 
  'issue', 'difficult', 'challenging', 'bad', 'worst', 'hate', 'fail'
];

const ENGAGEMENT_TRIGGERS = [
  'agree?', '?', 'thoughts', 'comment', 'share', 'like', 'what do you think',
  'your experience', 'your opinion', 'what would you', 'who else', 'tag someone',
];

const HASHTAG_OPTIMUM = {
  min: 3,
  max: 5,
};

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌',
  '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓',
  '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫',
  '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
  '👍', '👏', '🙌', '🤝', '🔥', '⭐', '💯', '📊', '📈', '🚀', '💡', '📝', '🎯', '🏆'
];

const INDUSTRY_KEYWORDS = {
  'Technology': ['tech', 'technology', 'software', 'developer', 'code', 'programming', 'digital', 'innovation', 'cloud', 'ai', 'artificial intelligence', 'machine learning', 'data science'],
  'Marketing': ['marketing', 'brand', 'content', 'seo', 'social media', 'campaign', 'audience', 'customer', 'promotion', 'advertising'],
  'Finance': ['finance', 'banking', 'investment', 'financial', 'money', 'budget', 'revenue', 'profit', 'roi', 'market', 'stocks', 'trading'],
  'Healthcare': ['healthcare', 'medical', 'health', 'patient', 'doctor', 'hospital', 'care', 'clinical', 'wellness', 'pharma'],
  'Education': ['education', 'learning', 'teaching', 'student', 'school', 'university', 'college', 'academic', 'classroom', 'course'],
  'Retail': ['retail', 'shopping', 'ecommerce', 'product', 'customer', 'consumer', 'store', 'sales', 'price', 'discount'],
};

// Text fingerprint function to ensure consistent scoring for identical texts
function getTextFingerprint(text: string): string {
  return text.trim().toLowerCase();
}

// Cache for storing previously analyzed posts
const analysisCache = new Map<string, PostMetrics>();

// Helper function to calculate reading time
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 225; // Average reading speed
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper function to analyze content structure
function analyzeContentStructure(text: string): {paragraphs: number, bulletPoints: number, numberedLists: number} {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const bulletPoints = lines.filter(line => /^\s*[\-\•\*]\s/.test(line)).length;
  const numberedLists = lines.filter(line => /^\s*\d+[\.\)]\s/.test(line)).length;
  
  // Count paragraphs (groups of text not starting with bullets or numbers)
  let paragraphs = 0;
  let inParagraph = false;
  
  for (const line of lines) {
    const isBulletOrNumber = /^\s*[\-\•\*]\s/.test(line) || /^\s*\d+[\.\)]\s/.test(line);
    
    if (!isBulletOrNumber && line.trim().length > 0) {
      if (!inParagraph) {
        paragraphs++;
        inParagraph = true;
      }
    } else {
      inParagraph = false;
    }
  }
  
  return {paragraphs, bulletPoints, numberedLists};
}

// Count emojis in text
function countEmojis(text: string): number {
  let count = 0;
  for (const emoji of EMOJIS) {
    const matches = text.match(new RegExp(emoji, 'g'));
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

// Analyze sentiment score from -1 (negative) to 1 (positive)
function analyzeSentiment(text: string): number {
  const lowercaseText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Count positive words
  for (const positive of POSITIVE_FACTORS) {
    if (lowercaseText.includes(positive)) {
      positiveCount++;
    }
  }
  
  // Count negative words
  for (const negative of NEGATIVE_FACTORS) {
    if (lowercaseText.includes(negative)) {
      negativeCount++;
    }
  }
  
  // Calculate net sentiment
  const totalWords = lowercaseText.split(/\s+/).length;
  const positiveRatio = positiveCount / totalWords;
  const negativeRatio = negativeCount / totalWords;
  
  return positiveRatio - negativeRatio;
}

// Analyze industry relevance
function analyzeIndustryRelevance(text: string, industry: string): number {
  if (!industry || !INDUSTRY_KEYWORDS[industry]) {
    return 1.0; // Default multiplier if industry not provided or not found
  }
  
  const lowercaseText = text.toLowerCase();
  const industryKeywords = INDUSTRY_KEYWORDS[industry];
  let matchCount = 0;
  
  for (const keyword of industryKeywords) {
    if (lowercaseText.includes(keyword)) {
      matchCount++;
    }
  }
  
  // Calculate relevance score: 0.8 base + up to 0.6 bonus for keywords (increased from 0.4)
  return 0.8 + Math.min(0.6, (matchCount / industryKeywords.length) * 0.6);
}

// Analyze functions
export function analyzePost(postContent: string, advancedParams?: AdvancedAnalysisParams): PostMetrics {
  // Get fingerprint of the text to ensure identical texts get identical scores
  const fingerprint = getTextFingerprint(postContent);
  
  // Check if we've already analyzed this exact text
  if (analysisCache.has(fingerprint)) {
    return {...analysisCache.get(fingerprint)!};
  }
  
  // Normalize input to ensure consistent analysis
  const cleanContent = fingerprint;
  
  // Fixed base scores for consistency
  const engagementBase = 50;
  const reachBase = 45;
  const viralityBase = 40;
  
  // Content length factor - precise calculation
  const contentLength = cleanContent.length;
  let lengthMultiplier = 1.0;
  
  if (contentLength < OPTIMAL_LENGTH.min) {
    lengthMultiplier = 0.7 + (0.3 * contentLength / OPTIMAL_LENGTH.min);
  } else if (contentLength > OPTIMAL_LENGTH.max) {
    lengthMultiplier = 0.95 - (0.2 * (contentLength - OPTIMAL_LENGTH.max) / OPTIMAL_LENGTH.max);
    lengthMultiplier = Math.max(0.6, lengthMultiplier);
  } else {
    // Sweet spot bonus with more granular scaling
    const sweetSpotCenter = (OPTIMAL_LENGTH.min + OPTIMAL_LENGTH.max) / 2;
    const distanceFromCenter = Math.abs(contentLength - sweetSpotCenter);
    const maxDistance = (OPTIMAL_LENGTH.max - OPTIMAL_LENGTH.min) / 2;
    lengthMultiplier = 1.1 - (0.1 * distanceFromCenter / maxDistance);
  }
  
  // Positive words factor - improved weighting
  const positiveWordsCount = POSITIVE_FACTORS.filter(word => 
    cleanContent.includes(word)
  ).length;
  const uniquePositiveWords = new Set(POSITIVE_FACTORS.filter(word => 
    cleanContent.includes(word)
  )).size;
  const positiveMultiplier = 1 + (0.03 * uniquePositiveWords);
  
  // Engagement triggers factor - improved detection
  const engagementTriggersCount = ENGAGEMENT_TRIGGERS.filter(trigger => 
    cleanContent.includes(trigger)
  ).length;
  const uniqueEngagementTriggers = new Set(ENGAGEMENT_TRIGGERS.filter(trigger => 
    cleanContent.includes(trigger)
  )).size;
  const engagementMultiplier = 1 + (0.05 * uniqueEngagementTriggers);
  
  // Hashtag factor - improved calculation
  const hashtagMatches = cleanContent.match(/#\w+/g);
  const hashtagCount = hashtagMatches ? hashtagMatches.length : 0;
  let hashtagMultiplier = 1.0;
  
  if (hashtagCount === 0) {
    hashtagMultiplier = 0.85;
  } else if (hashtagCount >= HASHTAG_OPTIMUM.min && hashtagCount <= HASHTAG_OPTIMUM.max) {
    hashtagMultiplier = 1.15 - (0.05 * Math.abs(hashtagCount - ((HASHTAG_OPTIMUM.min + HASHTAG_OPTIMUM.max) / 2)));
  } else if (hashtagCount > HASHTAG_OPTIMUM.max) {
    hashtagMultiplier = 1 - (0.03 * (hashtagCount - HASHTAG_OPTIMUM.max));
    hashtagMultiplier = Math.max(0.85, hashtagMultiplier);
  }
  
  // Sentence structure analysis
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 
    ? sentences.reduce((acc, s) => acc + s.trim().length, 0) / sentences.length
    : 0;
  const sentenceMultiplier = avgSentenceLength > 15 && avgSentenceLength < 100 ? 1.05 : 0.95;
  
  // NEW: Emoji analysis
  const emojiCount = countEmojis(postContent);
  const emojiMultiplier = emojiCount > 0 && emojiCount <= 5 
    ? 1.05 + (0.01 * emojiCount)  // Small bonus for 1-5 emojis
    : emojiCount > 5 
      ? 1.05 - (0.01 * (emojiCount - 5))  // Penalty for too many emojis
      : 0.95;  // Small penalty for no emojis
  
  // NEW: Content structure analysis
  const structure = analyzeContentStructure(postContent);
  const structureScore = 
    (structure.paragraphs > 1 ? 0.05 : 0) + 
    (structure.bulletPoints > 0 ? 0.05 : 0) + 
    (structure.numberedLists > 0 ? 0.05 : 0);
  const structureMultiplier = 1 + structureScore;
  
  // NEW: Reading time analysis
  const readingTimeMinutes = calculateReadingTime(postContent);
  const readingTimeMultiplier = readingTimeMinutes >= 1 && readingTimeMinutes <= 3 
    ? 1.05  // Ideal reading time (1-3 minutes)
    : readingTimeMinutes > 3 
      ? 1 - (0.03 * (readingTimeMinutes - 3))  // Penalty for long content
      : 0.95;  // Penalty for very short content
  
  // NEW: Sentiment analysis
  const sentiment = analyzeSentiment(postContent);
  const sentimentMultiplier = 1 + (sentiment * 0.1);  // Positive sentiment gets a small boost
  
  // Advanced parameters adjustments (if provided)
  let advancedMultiplier = 1.0;
  if (advancedParams) {
    // Follower range impact - SIGNIFICANTLY increased impact
    switch (advancedParams.followerRange) {
      case '0-500':
        advancedMultiplier *= 0.4; // 60% reduction (increased from 0.6)
        break;
      case '500-1K':
        advancedMultiplier *= 0.65; // 35% reduction (increased from 0.8)
        break;
      case '1K-5K':
        advancedMultiplier *= 1.0; // Baseline
        break;
      case '5K-10K':
        advancedMultiplier *= 1.6; // 60% boost (increased from 1.3)
        break;
      case '10K+':
        advancedMultiplier *= 2.2; // 120% boost (increased from 1.6)
        break;
    }
    
    // Industry impact - now using keyword detection with much stronger multipliers
    if (advancedParams.industry) {
      const industryRelevance = analyzeIndustryRelevance(postContent, advancedParams.industry);
      advancedMultiplier *= (industryRelevance * 2.0); // 100% stronger effect (increased from 1.5)
    }
    
    // Engagement level - significantly increased impact
    switch (advancedParams.engagementLevel) {
      case 'High':
        advancedMultiplier *= 1.8; // 80% boost (increased from 1.4)
        break;
      case 'Medium':
        advancedMultiplier *= 1.0; // Baseline
        break;
      case 'Low':
        advancedMultiplier *= 0.45; // 55% reduction (increased from 0.6)
        break;
    }
  }
  
  // Calculate final scores with deterministic rounding
  const engagementScore = Math.round(Math.min(100, engagementBase * 
    lengthMultiplier * 
    positiveMultiplier * 
    engagementMultiplier * 
    hashtagMultiplier * 
    sentenceMultiplier * 
    emojiMultiplier * 
    structureMultiplier * 
    readingTimeMultiplier * 
    sentimentMultiplier * 
    advancedMultiplier
  ));
  
  const reachScore = Math.round(Math.min(100, reachBase * 
    lengthMultiplier * 
    hashtagMultiplier * 
    sentenceMultiplier * 
    structureMultiplier *
    readingTimeMultiplier *
    advancedMultiplier
  ));
  
  const viralityScore = Math.round(Math.min(100, viralityBase * 
    engagementMultiplier * 
    positiveMultiplier * 
    hashtagMultiplier * 
    sentenceMultiplier * 
    emojiMultiplier * 
    structureMultiplier * 
    sentimentMultiplier *
    advancedMultiplier
  ));
  
  // Estimate engagement numbers based on scores - more closely tied to advanced parameters
  const likesEstimate = Math.floor(engagementScore * (advancedParams ? 0.8 : 0.55));
  const commentsEstimate = Math.floor(engagementScore * (advancedParams ? 0.18 : 0.12));
  const sharesEstimate = Math.floor(viralityScore * (advancedParams ? 0.12 : 0.07));
  
  const result = {
    engagementScore,
    reachScore,
    viralityScore,
    likes: likesEstimate,
    comments: commentsEstimate,
    shares: sharesEstimate,
  };
  
  // Cache the result for future lookups with the same text
  analysisCache.set(fingerprint, {...result});
  
  return result;
}

export function generateTimeSeries(postContent: string, hours: number = 24): TimeSeriesData[] {
  const fingerprint = getTextFingerprint(postContent);
  const { engagementScore } = analyzePost(postContent);
  
  // Generate a deterministic engagement curve over time
  const data: TimeSeriesData[] = [];
  
  // LinkedIn posts follow a curve where engagement peaks in the first few hours
  // then gradually declines - now completely deterministic
  for (let hour = 0; hour < hours; hour++) {
    let timeLabel = `${hour}h`;
    
    // Early growth phase (first 3 hours)
    let engagement;
    if (hour < 3) {
      // Rapid growth phase
      engagement = (engagementScore * 0.3) * (hour + 1) / 3;
    } 
    // Peak phase (hours 3-8)
    else if (hour < 8) {
      // Peak phase - no randomness
      const peakHeight = engagementScore * 0.9;
      engagement = peakHeight - (peakHeight * 0.05 * (hour - 3));
    } 
    // Decline phase
    else {
      // Gradual decline - no randomness
      const decay = 1 - (0.07 * (hour - 8));
      const baseline = engagementScore * 0.6; // Lowest it should go
      engagement = Math.max(
        baseline,
        engagementScore * 0.7 * decay
      );
    }
    
    data.push({
      time: timeLabel,
      engagement: Math.round(engagement),
    });
  }
  
  return data;
}

export function generateSuggestions(postContent: string): PostSuggestion[] {
  const cleanContent = postContent.trim().toLowerCase();
  const suggestions: PostSuggestion[] = [];
  
  // Check post length
  if (cleanContent.length < OPTIMAL_LENGTH.min) {
    suggestions.push({
      id: 'length-short',
      type: 'improvement',
      title: 'Add more content',
      description: `Your post is shorter than the optimal length (${OPTIMAL_LENGTH.min}-${OPTIMAL_LENGTH.max} characters). Consider adding more details or insights to improve engagement.`,
    });
  } else if (cleanContent.length > OPTIMAL_LENGTH.max) {
    suggestions.push({
      id: 'length-long',
      type: 'warning',
      title: 'Post is too long',
      description: `Your post exceeds the optimal length of ${OPTIMAL_LENGTH.max} characters. Consider trimming it down or breaking it into a series of posts.`,
    });
  }
  
  // Check for hashtags
  const hashtagMatches = cleanContent.match(/#\w+/g);
  const hashtagCount = hashtagMatches ? hashtagMatches.length : 0;
  
  if (hashtagCount === 0) {
    suggestions.push({
      id: 'no-hashtags',
      type: 'improvement',
      title: 'Add relevant hashtags',
      description: `Including ${HASHTAG_OPTIMUM.min}-${HASHTAG_OPTIMUM.max} relevant hashtags can increase your post's discoverability and reach.`,
    });
  } else if (hashtagCount > HASHTAG_OPTIMUM.max) {
    suggestions.push({
      id: 'too-many-hashtags',
      type: 'warning',
      title: 'Too many hashtags',
      description: `You're using ${hashtagCount} hashtags, which may appear spammy. Aim for ${HASHTAG_OPTIMUM.min}-${HASHTAG_OPTIMUM.max} highly relevant hashtags instead.`,
    });
  }
  
  // Check for engagement triggers
  const hasEngagementTrigger = ENGAGEMENT_TRIGGERS.some(trigger => 
    cleanContent.includes(trigger)
  );
  
  if (!hasEngagementTrigger) {
    suggestions.push({
      id: 'engagement-prompt',
      type: 'improvement',
      title: 'Add a call to action',
      description: 'End your post with a question or call to action to encourage comments and engagement.',
    });
  }
  
  // Check for spacing and formatting
  if (!cleanContent.includes('\n')) {
    suggestions.push({
      id: 'formatting',
      type: 'tip',
      title: 'Improve readability',
      description: 'Break your text into smaller paragraphs to improve readability and engagement.',
    });
  }
  
  // NEW: Check for emojis
  if (countEmojis(postContent) === 0) {
    suggestions.push({
      id: 'emoji-tip',
      type: 'tip',
      title: 'Add relevant emojis',
      description: 'Posts with 2-3 relevant emojis tend to get higher engagement than text-only posts.',
    });
  } else if (countEmojis(postContent) > 8) {
    suggestions.push({
      id: 'too-many-emojis',
      type: 'warning',
      title: 'Too many emojis',
      description: 'Using too many emojis can make your post look unprofessional. Try limiting to 2-4 relevant emojis.',
    });
  }
  
  // NEW: Check content structure
  const structure = analyzeContentStructure(postContent);
  if (structure.paragraphs <= 1 && structure.bulletPoints === 0 && structure.numberedLists === 0) {
    suggestions.push({
      id: 'structure-tip',
      type: 'improvement',
      title: 'Improve content structure',
      description: 'Try breaking your content into multiple paragraphs or using bullet points for better readability.',
    });
  }
  
  // NEW: Check reading time
  const readingTime = calculateReadingTime(postContent);
  if (readingTime > 3) {
    suggestions.push({
      id: 'reading-time',
      type: 'warning',
      title: 'Post might be too long to read',
      description: `Your post takes about ${readingTime} minutes to read. Consider trimming it down for higher engagement.`,
    });
  }
  
  // NEW: Check sentiment
  const sentiment = analyzeSentiment(postContent);
  if (sentiment < -0.1) {
    suggestions.push({
      id: 'negative-tone',
      type: 'tip',
      title: 'Consider a more positive tone',
      description: 'Your post has a somewhat negative tone. LinkedIn audiences typically respond better to positive, solution-oriented content.',
    });
  }
  
  // Random tips if no major issues found
  if (suggestions.length < 2) {
    const tips: PostSuggestion[] = [
      {
        id: 'timing-tip',
        type: 'tip',
        title: 'Optimize posting time',
        description: 'LinkedIn engagement is highest on Tuesday, Wednesday, and Thursday between 8-10am and 3-5pm.',
      },
      {
        id: 'storytelling-tip',
        type: 'tip',
        title: 'Use storytelling',
        description: 'Posts that tell a personal story tend to get 2-3x more engagement on LinkedIn.',
      },
      {
        id: 'visual-tip',
        type: 'tip',
        title: 'Add visual content',
        description: 'Posts with images or videos get 2x more comments than text-only posts.',
      },
      {
        id: 'first-line-tip',
        type: 'tip',
        title: 'Strengthen your opening',
        description: 'Only the first 2-3 lines appear before the "see more" button. Make them compelling.',
      },
      {
        id: 'balance-tip',
        type: 'tip',
        title: 'Balance personal and professional',
        description: 'LinkedIn posts that blend professional insights with personal experiences tend to perform best.',
      },
      {
        id: 'data-tip',
        type: 'tip',
        title: 'Include data or statistics',
        description: 'Including specific data points or statistics can increase credibility and shareability.',
      },
    ];
    
    // Deterministically add tips until we have at least 2 suggestions
    let index = 0;
    while (suggestions.length < 2 && index < tips.length) {
      suggestions.push(tips[index]);
      index++;
    }
  }
  
  return suggestions;
}

// Compare two posts and determine which is likely to perform better
export function comparePostsPerformance(post1: string, post2: string, advancedParams?: AdvancedAnalysisParams) {
  // Get fingerprints to ensure identical texts get identical scores
  const fingerprint1 = getTextFingerprint(post1);
  const fingerprint2 = getTextFingerprint(post2);
  
  // If posts are identical, they should have identical scores
  if (fingerprint1 === fingerprint2) {
    const metrics = analyzePost(post1, advancedParams);
    return {
      winner: 0, // 0 indicates a tie
      margin: 0,
      metrics1: {...metrics},
      metrics2: {...metrics}
    };
  }
  
  const metrics1 = analyzePost(post1, advancedParams);
  const metrics2 = analyzePost(post2, advancedParams);
  
  const post1Score = (metrics1.engagementScore + metrics1.reachScore + metrics1.viralityScore) / 3;
  const post2Score = (metrics2.engagementScore + metrics2.reachScore + metrics2.viralityScore) / 3;
  
  if (post1Score > post2Score) {
    return {
      winner: 1,
      margin: ((post1Score - post2Score) / post2Score) * 100, // percentage difference
      metrics1,
      metrics2
    };
  } else if (post2Score > post1Score) {
    return {
      winner: 2,
      margin: ((post2Score - post1Score) / post1Score) * 100, // percentage difference
      metrics1,
      metrics2
    };
  } else {
    // Exact same score
    return {
      winner: 0, // 0 indicates a tie
      margin: 0,
      metrics1,
      metrics2
    };
  }
}

// NEW: Export utility functions for testing or advanced usage
export const analyzers = {
  calculateReadingTime,
  analyzeContentStructure,
  countEmojis,
  analyzeSentiment,
  analyzeIndustryRelevance,
  getTextFingerprint
};
