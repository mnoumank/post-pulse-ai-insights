
// Enhanced LinkedIn Virality Prediction System
// Based on comprehensive research and 8-factor weighted formula

export interface ViralityFactors {
  hookStrength: number;        // 0-10 scale
  readabilityFormatting: number; // 0-10 scale
  valueRelevance: number;      // 0-10 scale
  authorCredibility: number;   // 0-10 scale
  storytellingRelatability: number; // 0-10 scale
  visualAppeal: number;        // 0-10 scale
  callToActionEngagement: number; // 0-10 scale
  timingFrequency: number;     // 0-10 scale
}

export interface EnhancedViralityResult {
  viralityScore: number;       // 0-10 scale
  factors: ViralityFactors;
  interpretation: 'High' | 'Moderate' | 'Low';
  topStrengths: string[];
  improvementAreas: string[];
  detailedAnalysis: {
    [key in keyof ViralityFactors]: {
      score: number;
      description: string;
      suggestions: string[];
    }
  };
}

// Factor weights based on research
const FACTOR_WEIGHTS = {
  hookStrength: 0.20,
  readabilityFormatting: 0.15,
  valueRelevance: 0.15,
  authorCredibility: 0.15,
  storytellingRelatability: 0.10,
  visualAppeal: 0.10,
  callToActionEngagement: 0.10,
  timingFrequency: 0.05,
} as const;

// Hook strength analysis patterns
const HOOK_PATTERNS = {
  strong: [
    'i just got fired', 'shocking truth', 'nobody tells you', 'unpopular opinion',
    'breaking:', 'attention:', 'listen up', 'game changer', 'secret to',
    'what happened next', 'you won\'t believe', 'the truth about',
    'little known fact', 'surprising', 'revealed', 'discovered'
  ],
  moderate: [
    'here\'s what i learned', 'my biggest mistake', 'case study',
    'how i', 'why you should', 'what if', 'imagine if',
    'the problem with', 'everyone thinks', 'most people'
  ],
  questions: ['?', 'what', 'why', 'how', 'when', 'where', 'who'],
  statistics: /\d+%|\d+ percent|\d+x|\d+\.\d+/,
  bold_statements: ['never', 'always', 'all', 'every', 'no one', 'everyone']
};

// Value indicators
const VALUE_INDICATORS = [
  'tips', 'strategy', 'framework', 'method', 'steps', 'ways to',
  'how to', 'guide', 'checklist', 'template', 'proven', 'tested',
  'insights', 'lessons', 'mistakes', 'experience', 'advice'
];

// Storytelling elements
const STORYTELLING_ELEMENTS = [
  'when i', 'i remember', 'last week', 'yesterday', 'my journey',
  'what happened', 'lesson learned', 'challenge', 'struggle',
  'realized', 'discovered', 'felt', 'emotion', 'story'
];

// Visual elements detection
const VISUAL_ELEMENTS = {
  emojis: /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/gu,
  bullets: /[•→✓▶]/g,
  formatting: /\*\*.*?\*\*|__.*?__|`.*?`/g,
  lists: /^\s*[\-\•\*]\s/gm
};

// CTA patterns
const CTA_PATTERNS = [
  'what do you think', 'share your', 'comment below', 'tag someone',
  'your thoughts', 'agree?', 'disagree?', 'your experience',
  'what would you', 'who else', 'thoughts?', 'opinions?'
];

function analyzeHookStrength(content: string): number {
  const firstLine = content.split('\n')[0].toLowerCase();
  const first100Chars = content.substring(0, 100).toLowerCase();
  
  let score = 3; // Base score
  
  // Check for strong hook patterns
  const strongHooks = HOOK_PATTERNS.strong.filter(pattern => 
    first100Chars.includes(pattern)
  ).length;
  score += Math.min(3, strongHooks * 1.5);
  
  // Check for moderate hooks
  const moderateHooks = HOOK_PATTERNS.moderate.filter(pattern => 
    first100Chars.includes(pattern)
  ).length;
  score += Math.min(2, moderateHooks * 1);
  
  // Question marks in opening
  if (firstLine.includes('?')) score += 1;
  
  // Statistics in opening
  if (HOOK_PATTERNS.statistics.test(first100Chars)) score += 1;
  
  // Bold statements
  const boldStatements = HOOK_PATTERNS.bold_statements.filter(word => 
    first100Chars.includes(word)
  ).length;
  score += Math.min(1, boldStatements * 0.5);
  
  return Math.min(10, Math.max(0, score));
}

function analyzeReadabilityFormatting(content: string): number {
  const lines = content.split('\n');
  const paragraphs = content.split('\n\n');
  
  let score = 5; // Base score
  
  // Paragraph length analysis
  const avgParagraphLength = paragraphs.reduce((acc, p) => acc + p.length, 0) / paragraphs.length;
  if (avgParagraphLength < 200) score += 1;
  if (avgParagraphLength < 150) score += 1;
  
  // Line breaks and whitespace
  const emptyLines = lines.filter(line => line.trim() === '').length;
  const contentLines = lines.filter(line => line.trim() !== '').length;
  const whitespaceRatio = emptyLines / contentLines;
  
  if (whitespaceRatio > 0.2) score += 1;
  if (whitespaceRatio > 0.3) score += 1;
  
  // Visual elements
  const hasEmojis = VISUAL_ELEMENTS.emojis.test(content);
  const hasBullets = VISUAL_ELEMENTS.bullets.test(content);
  const hasLists = VISUAL_ELEMENTS.lists.test(content);
  
  if (hasEmojis) score += 0.5;
  if (hasBullets) score += 0.5;
  if (hasLists) score += 0.5;
  
  // Sentence length
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.length, 0) / sentences.length;
  
  if (avgSentenceLength < 80 && avgSentenceLength > 15) score += 1;
  
  return Math.min(10, Math.max(0, score));
}

function analyzeValueRelevance(content: string): number {
  const lowerContent = content.toLowerCase();
  
  let score = 3; // Base score
  
  // Value indicators
  const valueCount = VALUE_INDICATORS.filter(indicator => 
    lowerContent.includes(indicator)
  ).length;
  score += Math.min(3, valueCount * 0.5);
  
  // Actionable content detection
  const actionWords = ['step', 'action', 'implement', 'apply', 'use', 'try'];
  const actionCount = actionWords.filter(word => lowerContent.includes(word)).length;
  score += Math.min(2, actionCount * 0.3);
  
  // Industry relevance
  const professionalKeywords = [
    'business', 'career', 'leadership', 'management', 'strategy',
    'growth', 'success', 'professional', 'industry', 'market'
  ];
  const keywordCount = professionalKeywords.filter(word => 
    lowerContent.includes(word)
  ).length;
  score += Math.min(2, keywordCount * 0.2);
  
  return Math.min(10, Math.max(0, score));
}

function analyzeAuthorCredibility(content: string, advancedParams?: any): number {
  // Since we don't have actual author data, we'll estimate based on content sophistication
  let score = 5; // Base assumption
  
  // Content sophistication indicators
  const sophisticatedTerms = [
    'framework', 'methodology', 'paradigm', 'leverage', 'synergy',
    'stakeholder', 'roi', 'kpi', 'metrics', 'analytics'
  ];
  
  const lowerContent = content.toLowerCase();
  const termCount = sophisticatedTerms.filter(term => 
    lowerContent.includes(term)
  ).length;
  
  score += Math.min(3, termCount * 0.5);
  
  // Industry knowledge indicators
  if (lowerContent.includes('years of experience') || 
      lowerContent.includes('in my experience') ||
      lowerContent.includes('as a')) {
    score += 1;
  }
  
  // If advanced params suggest higher engagement level, boost credibility
  if (advancedParams?.engagementLevel === 'High') score += 1;
  if (advancedParams?.followerRange === '10K+') score += 2;
  if (advancedParams?.followerRange === '5K-10K') score += 1;
  
  return Math.min(10, Math.max(0, score));
}

function analyzeStorytellingRelatability(content: string): number {
  const lowerContent = content.toLowerCase();
  
  let score = 2; // Base score
  
  // Personal pronouns
  const personalPronouns = (lowerContent.match(/\b(i|me|my|mine|we|our|us)\b/g) || []).length;
  score += Math.min(3, personalPronouns * 0.1);
  
  // Storytelling elements
  const storyElements = STORYTELLING_ELEMENTS.filter(element => 
    lowerContent.includes(element)
  ).length;
  score += Math.min(3, storyElements * 0.8);
  
  // Emotional words
  const emotionalWords = [
    'felt', 'realized', 'struggled', 'learned', 'discovered',
    'excited', 'nervous', 'proud', 'disappointed', 'surprised'
  ];
  const emotionCount = emotionalWords.filter(word => 
    lowerContent.includes(word)
  ).length;
  score += Math.min(2, emotionCount * 0.4);
  
  return Math.min(10, Math.max(0, score));
}

function analyzeVisualAppeal(content: string): number {
  let score = 3; // Base score
  
  // Emoji usage
  const emojiMatches = content.match(VISUAL_ELEMENTS.emojis) || [];
  const emojiCount = emojiMatches.length;
  
  if (emojiCount > 0 && emojiCount <= 5) score += 2;
  else if (emojiCount > 5 && emojiCount <= 10) score += 1;
  else if (emojiCount > 10) score -= 1; // Too many
  
  // Visual formatting elements
  const bulletCount = (content.match(VISUAL_ELEMENTS.bullets) || []).length;
  if (bulletCount > 0) score += 1;
  
  const listCount = (content.match(VISUAL_ELEMENTS.lists) || []).length;
  if (listCount > 0) score += 1;
  
  // Formatting variety
  const hasFormatting = VISUAL_ELEMENTS.formatting.test(content);
  if (hasFormatting) score += 1;
  
  // Visual hierarchy (multiple paragraph breaks)
  const paragraphBreaks = content.split('\n\n').length - 1;
  if (paragraphBreaks > 2) score += 1;
  
  return Math.min(10, Math.max(0, score));
}

function analyzeCallToActionEngagement(content: string): number {
  const lowerContent = content.toLowerCase();
  
  let score = 2; // Base score
  
  // Direct CTA patterns
  const ctaCount = CTA_PATTERNS.filter(pattern => 
    lowerContent.includes(pattern)
  ).length;
  score += Math.min(4, ctaCount * 2);
  
  // Question marks (engagement indicators)
  const questionCount = (content.match(/\?/g) || []).length;
  score += Math.min(2, questionCount * 0.5);
  
  // Engagement words
  const engagementWords = ['comment', 'share', 'like', 'connect', 'follow', 'tag'];
  const engagementCount = engagementWords.filter(word => 
    lowerContent.includes(word)
  ).length;
  score += Math.min(2, engagementCount * 0.5);
  
  return Math.min(10, Math.max(0, score));
}

function analyzeTimingFrequency(): number {
  // Since we can't analyze actual timing, return a moderate score
  // In a real implementation, this would check posting patterns
  return 6;
}

export function analyzePostVirality(
  content: string, 
  advancedParams?: any
): EnhancedViralityResult {
  
  // Calculate individual factor scores
  const factors: ViralityFactors = {
    hookStrength: analyzeHookStrength(content),
    readabilityFormatting: analyzeReadabilityFormatting(content),
    valueRelevance: analyzeValueRelevance(content),
    authorCredibility: analyzeAuthorCredibility(content, advancedParams),
    storytellingRelatability: analyzeStorytellingRelatability(content),
    visualAppeal: analyzeVisualAppeal(content),
    callToActionEngagement: analyzeCallToActionEngagement(content),
    timingFrequency: analyzeTimingFrequency(),
  };
  
  // Calculate weighted virality score using the formula: V = Σ(Fi × Wi)
  const viralityScore = 
    (factors.hookStrength * FACTOR_WEIGHTS.hookStrength) +
    (factors.readabilityFormatting * FACTOR_WEIGHTS.readabilityFormatting) +
    (factors.valueRelevance * FACTOR_WEIGHTS.valueRelevance) +
    (factors.authorCredibility * FACTOR_WEIGHTS.authorCredibility) +
    (factors.storytellingRelatability * FACTOR_WEIGHTS.storytellingRelatability) +
    (factors.visualAppeal * FACTOR_WEIGHTS.visualAppeal) +
    (factors.callToActionEngagement * FACTOR_WEIGHTS.callToActionEngagement) +
    (factors.timingFrequency * FACTOR_WEIGHTS.timingFrequency);
  
  // Determine interpretation
  let interpretation: 'High' | 'Moderate' | 'Low';
  if (viralityScore >= 8.0) interpretation = 'High';
  else if (viralityScore >= 6.0) interpretation = 'Moderate';
  else interpretation = 'Low';
  
  // Identify top strengths and improvement areas
  const factorEntries = Object.entries(factors) as [keyof ViralityFactors, number][];
  const sortedFactors = factorEntries.sort((a, b) => b[1] - a[1]);
  
  const topStrengths = sortedFactors.slice(0, 3).map(([key, score]) => 
    `${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${score.toFixed(1)}/10`
  );
  
  const improvementAreas = sortedFactors.slice(-3).map(([key, score]) => 
    `${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${score.toFixed(1)}/10`
  );
  
  // Create detailed analysis
  const detailedAnalysis = {
    hookStrength: {
      score: factors.hookStrength,
      description: factors.hookStrength >= 7 ? 
        'Strong opening that grabs attention effectively' : 
        'Opening could be more compelling to stop the scroll',
      suggestions: factors.hookStrength < 7 ? [
        'Start with a provocative question or bold statement',
        'Use specific numbers or surprising statistics',
        'Consider vulnerability or contrarian viewpoints'
      ] : ['Maintain this strong hook style in future posts']
    },
    readabilityFormatting: {
      score: factors.readabilityFormatting,
      description: factors.readabilityFormatting >= 7 ? 
        'Well-formatted and easy to read' : 
        'Formatting could be improved for better readability',
      suggestions: factors.readabilityFormatting < 7 ? [
        'Break content into shorter paragraphs (2-3 sentences)',
        'Add more whitespace and visual breaks',
        'Use bullet points or emojis for visual interest'
      ] : ['Great formatting - keep this structure']
    },
    valueRelevance: {
      score: factors.valueRelevance,
      description: factors.valueRelevance >= 7 ? 
        'Provides clear professional value' : 
        'Could offer more actionable insights',
      suggestions: factors.valueRelevance < 7 ? [
        'Include specific tips or strategies',
        'Share concrete examples or case studies',
        'Focus on professional relevance and applicability'
      ] : ['Excellent value proposition']
    },
    authorCredibility: {
      score: factors.authorCredibility,
      description: factors.authorCredibility >= 7 ? 
        'Content demonstrates expertise and authority' : 
        'Could establish more credibility and expertise',
      suggestions: factors.authorCredibility < 7 ? [
        'Share relevant experience or credentials',
        'Include industry-specific insights',
        'Reference data or research to support points'
      ] : ['Strong credibility indicators']
    },
    storytellingRelatability: {
      score: factors.storytellingRelatability,
      description: factors.storytellingRelatability >= 7 ? 
        'Engaging personal story that resonates' : 
        'Could benefit from more personal storytelling',
      suggestions: factors.storytellingRelatability < 7 ? [
        'Include personal experiences and emotions',
        'Use "I", "my", "we" to create connection',
        'Share vulnerable moments or lessons learned'
      ] : ['Compelling storytelling approach']
    },
    visualAppeal: {
      score: factors.visualAppeal,
      description: factors.visualAppeal >= 7 ? 
        'Good use of visual elements' : 
        'Could be more visually engaging',
      suggestions: factors.visualAppeal < 7 ? [
        'Add 2-3 relevant emojis strategically',
        'Use bullet points (• → ✓) for lists',
        'Create visual hierarchy with formatting'
      ] : ['Nice visual presentation']
    },
    callToActionEngagement: {
      score: factors.callToActionEngagement,
      description: factors.callToActionEngagement >= 7 ? 
        'Strong call-to-action that encourages interaction' : 
        'Needs clearer engagement prompts',
      suggestions: factors.callToActionEngagement < 7 ? [
        'End with a specific question related to your content',
        'Ask for opinions or personal experiences',
        'Invite readers to share or comment'
      ] : ['Excellent engagement strategy']
    },
    timingFrequency: {
      score: factors.timingFrequency,
      description: 'Timing optimization requires consistent posting strategy',
      suggestions: [
        'Post during business hours on weekdays',
        'Maintain consistent posting schedule',
        'Engage actively in first 5 minutes after posting'
      ]
    }
  };
  
  return {
    viralityScore: Math.round(viralityScore * 10) / 10, // Round to 1 decimal
    factors,
    interpretation,
    topStrengths,
    improvementAreas,
    detailedAnalysis
  };
}

// Convert enhanced results to legacy format for compatibility
export function convertToLegacyMetrics(result: EnhancedViralityResult): {
  engagementScore: number;
  reachScore: number;
  viralityScore: number;
  likes: number;
  comments: number;
  shares: number;
} {
  const baseMultiplier = result.interpretation === 'High' ? 1.2 : 
                        result.interpretation === 'Moderate' ? 1.0 : 0.7;
  
  // Convert 0-10 scale to 0-100 scale
  const scaledScore = result.viralityScore * 10;
  
  return {
    engagementScore: Math.round(scaledScore * 0.9), // Slightly lower than virality
    reachScore: Math.round(scaledScore * 0.8),      // Lower than engagement
    viralityScore: Math.round(scaledScore),         // Direct conversion
    likes: Math.round(scaledScore * baseMultiplier * 1.2),
    comments: Math.round(scaledScore * baseMultiplier * 0.3),
    shares: Math.round(scaledScore * baseMultiplier * 0.2),
  };
}
