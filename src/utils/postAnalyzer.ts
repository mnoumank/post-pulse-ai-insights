
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

const ENGAGEMENT_TRIGGERS = [
  'agree?', '?', 'thoughts', 'comment', 'share', 'like', 'what do you think',
  'your experience', 'your opinion', 'what would you', 'who else', 'tag someone',
];

const HASHTAG_OPTIMUM = {
  min: 3,
  max: 5,
};

// Analyze functions
export function analyzePost(postContent: string, advancedParams?: AdvancedAnalysisParams): PostMetrics {
  // Simulating an AI analysis with some simple heuristics
  const cleanContent = postContent.trim().toLowerCase();
  
  // Base scores 
  let engagementBase = 40 + Math.random() * 20; // 40-60 range
  let reachBase = 35 + Math.random() * 30; // 35-65 range
  let viralityBase = 30 + Math.random() * 25; // 30-55 range
  
  // Content length factor
  const contentLength = cleanContent.length;
  let lengthMultiplier = 1.0;
  
  if (contentLength < OPTIMAL_LENGTH.min) {
    lengthMultiplier = 0.7 + (0.3 * contentLength / OPTIMAL_LENGTH.min);
  } else if (contentLength > OPTIMAL_LENGTH.max) {
    lengthMultiplier = 0.95 - (0.2 * (contentLength - OPTIMAL_LENGTH.max) / 1000);
    lengthMultiplier = Math.max(0.6, lengthMultiplier); // Don't penalize too much
  } else {
    // Sweet spot bonus
    lengthMultiplier = 1.1;
  }
  
  // Positive words factor
  const positiveWordsCount = POSITIVE_FACTORS.filter(word => 
    cleanContent.includes(word)
  ).length;
  const positiveMultiplier = 1 + (0.05 * positiveWordsCount);
  
  // Engagement triggers factor
  const engagementTriggersCount = ENGAGEMENT_TRIGGERS.filter(trigger => 
    cleanContent.includes(trigger)
  ).length;
  const engagementMultiplier = 1 + (0.1 * engagementTriggersCount);
  
  // Hashtag factor
  const hashtagMatches = cleanContent.match(/#\w+/g);
  const hashtagCount = hashtagMatches ? hashtagMatches.length : 0;
  let hashtagMultiplier = 1.0;
  
  if (hashtagCount === 0) {
    hashtagMultiplier = 0.85;
  } else if (hashtagCount >= HASHTAG_OPTIMUM.min && hashtagCount <= HASHTAG_OPTIMUM.max) {
    hashtagMultiplier = 1.15;
  } else if (hashtagCount > HASHTAG_OPTIMUM.max) {
    hashtagMultiplier = 1 - (0.03 * (hashtagCount - HASHTAG_OPTIMUM.max));
    hashtagMultiplier = Math.max(0.85, hashtagMultiplier);
  }
  
  // Advanced parameters adjustments (if provided)
  let advancedMultiplier = 1.0;
  if (advancedParams) {
    // Follower range impact
    switch (advancedParams.followerRange) {
      case '0-500':
        advancedMultiplier *= 0.8;
        break;
      case '500-1K':
        advancedMultiplier *= 0.9;
        break;
      case '1K-5K':
        advancedMultiplier *= 1.0;
        break;
      case '5K-10K':
        advancedMultiplier *= 1.1;
        break;
      case '10K+':
        advancedMultiplier *= 1.2;
        break;
    }
    
    // Industry impact (tech and marketing tend to perform better on LinkedIn)
    switch (advancedParams.industry) {
      case 'Technology':
      case 'Marketing':
        advancedMultiplier *= 1.1;
        break;
      case 'Finance':
      case 'Healthcare':
        advancedMultiplier *= 1.05;
        break;
      case 'Education':
      case 'Retail':
        advancedMultiplier *= 0.95;
        break;
    }
    
    // Engagement level
    switch (advancedParams.engagementLevel) {
      case 'High':
        advancedMultiplier *= 1.2;
        break;
      case 'Medium':
        advancedMultiplier *= 1.0;
        break;
      case 'Low':
        advancedMultiplier *= 0.8;
        break;
    }
  }
  
  // Calculate final scores
  const engagementScore = Math.min(100, engagementBase * lengthMultiplier * positiveMultiplier * engagementMultiplier * hashtagMultiplier * advancedMultiplier);
  const reachScore = Math.min(100, reachBase * lengthMultiplier * hashtagMultiplier * advancedMultiplier);
  const viralityScore = Math.min(100, viralityBase * engagementMultiplier * positiveMultiplier * hashtagMultiplier * advancedMultiplier);
  
  // Estimate engagement numbers based on scores
  const likesEstimate = Math.floor(engagementScore * 0.6);
  const commentsEstimate = Math.floor(engagementScore * 0.15);
  const sharesEstimate = Math.floor(viralityScore * 0.08);
  
  return {
    engagementScore: Math.round(engagementScore),
    reachScore: Math.round(reachScore),
    viralityScore: Math.round(viralityScore),
    likes: likesEstimate,
    comments: commentsEstimate,
    shares: sharesEstimate,
  };
}

export function generateTimeSeries(postContent: string, hours: number = 24): TimeSeriesData[] {
  const { engagementScore } = analyzePost(postContent);
  
  // Generate a realistic engagement curve over time
  const data: TimeSeriesData[] = [];
  
  // Most LinkedIn posts follow a curve where engagement peaks in the first few hours
  // then gradually declines
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
      // Peak with some randomness
      const peakHeight = engagementScore * (0.7 + Math.random() * 0.3);
      engagement = peakHeight - (peakHeight * 0.05 * (hour - 3));
    } 
    // Decline phase
    else {
      // Gradual decline with some randomness
      const decay = 1 - (0.07 * (hour - 8));
      const baseline = engagementScore * 0.6; // Lowest it should go
      engagement = Math.max(
        baseline,
        engagementScore * 0.7 * decay * (1 + (Math.random() * 0.1 - 0.05))
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
    ];
    
    // Add random tips until we have at least 2 suggestions
    while (suggestions.length < 2 && tips.length > 0) {
      const randomIndex = Math.floor(Math.random() * tips.length);
      suggestions.push(tips[randomIndex]);
      tips.splice(randomIndex, 1);
    }
  }
  
  return suggestions;
}

// Compare two posts and determine which is likely to perform better
export function comparePostsPerformance(post1: string, post2: string, advancedParams?: AdvancedAnalysisParams) {
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
  } else {
    return {
      winner: 2,
      margin: ((post2Score - post1Score) / post1Score) * 100, // percentage difference
      metrics1,
      metrics2
    };
  }
}
