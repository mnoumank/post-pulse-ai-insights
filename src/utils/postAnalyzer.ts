// Enhanced LinkedIn Post Analysis with Machine Learning-inspired Techniques (SMRT v3)

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
  followerRange?: string;
  industry?: string;
  engagementLevel?: string;
}

// ==== CONSTANTS & PRECOMPILED PATTERNS ====
const OPTIMAL_LENGTH = { min: 150, max: 1300, ideal: 750 }; //// Added ideal
const HASHTAG_OPTIMUM = { min: 3, max: 5, ideal: 4 };

type WeightedTerm = { term: string; weight: number }; //// Generic weighted type
const POSITIVE_FACTORS: WeightedTerm[] = [
  { term: 'thank', weight: 1.2 },
  { term: 'excited', weight: 1.5 },
  { term: 'proud', weight: 1.4 },
  { term: 'success', weight: 1.6 },
  { term: 'grateful', weight: 1.5 },
  { term: 'celebrate', weight: 1.6 },
  { term: 'achievement', weight: 1.7 },
  { term: 'unstoppable', weight: 1.8 },
  { term: 'growth', weight: 1.5 }, //// expanded
  { term: 'honored', weight: 1.4 }, //// expanded
  { term: 'appreciation', weight: 1.5 }, //// expanded
  { term: 'milestone', weight: 1.7 }, //// expanded
  { term: 'rewarding', weight: 1.6 }, //// expanded
  { term: 'blessed', weight: 1.4 }, //// expanded
  { term: 'amazing journey', weight: 1.5 }, //// expanded
  { term: 'next chapter', weight: 1.6 }, //// expanded
  { term: 'dream come true', weight: 1.7 }, //// expanded
  { term: 'overwhelmed with joy', weight: 1.8 }, //// expanded
  { term: 'incredible', weight: 1.5 }, //// expanded
  { term: 'energized', weight: 1.4 }, //// expanded
  { term: 'positive impact', weight: 1.5 }, //// expanded
  { term: 'unstoppable momentum', weight: 1.7 }, //// expanded
  { term: 'onwards and upwards', weight: 1.5 }, //// expanded
  { term: 'victory', weight: 1.6 }, //// expanded
  { term: 'moment of pride', weight: 1.5 }, //// expanded
  { term: 'thankful heart', weight: 1.4 }, //// expanded
  { term: 'bright future', weight: 1.5 }, //// expanded
  { term: 'huge win', weight: 1.6 }, //// expanded
  { term: 'fulfilled', weight: 1.4 }, //// expanded
  { term: 'momentous occasion', weight: 1.6 }, //// expanded
  { term: 'winning mindset', weight: 1.5 }, //// expanded
  { term: 'legacy', weight: 1.6 }, //// expanded
  { term: 'fulfilled dreams', weight: 1.7 }, //// expanded
  { term: 'grateful journey', weight: 1.5 }, //// expanded
  { term: 'elevated', weight: 1.5 }, //// expanded
  { term: 'unstoppable energy', weight: 1.8 }, //// expanded
  { term: 'positive vibes', weight: 1.4 }, //// expanded
  { term: 'forward progress', weight: 1.5 }, //// expanded
  { term: 'satisfying milestone', weight: 1.6 }, //// expanded
  { term: 'journey of success', weight: 1.6 }, //// expanded
  { term: 'major achievement', weight: 1.7 }, //// expanded
  { term: 'exciting future', weight: 1.5 }, //// expanded
  { term: 'dream realized', weight: 1.7 }, //// expanded
  { term: 'hard work pays off', weight: 1.6 }, //// expanded
  { term: 'personal growth', weight: 1.5 }, //// expanded
  { term: 'thankful for support', weight: 1.4 }, //// expanded
  { term: 'moment of gratitude', weight: 1.5 }, //// expanded
  { term: 'tremendous honor', weight: 1.5 }, //// expanded
  { term: 'milestone reached', weight: 1.6 }, //// expanded
  { term: 'lifelong dream', weight: 1.7 }, //// expanded
];

const NEGATIVE_FACTORS: WeightedTerm[] = [
  { term: 'challenge', weight: 1.2 },
  { term: 'problem', weight: 1.3 },
  { term: 'failure', weight: 1.5 },
  { term: 'mistake', weight: 1.4 },
  { term: 'difficult', weight: 1.3 },
  { term: 'struggle', weight: 1.5 },
  { term: 'loss', weight: 1.4 },
  { term: 'setback', weight: 1.4 },
  { term: 'painful', weight: 1.5 }, //// expanded
  { term: 'obstacle', weight: 1.4 }, //// expanded
  { term: 'burnout', weight: 1.3 }, //// expanded
  { term: 'disappointment', weight: 1.5 }, //// expanded
  { term: 'critical', weight: 1.3 }, //// expanded
  { term: 'problematic', weight: 1.2 }, //// expanded
  { term: 'low point', weight: 1.4 }, //// expanded
  { term: 'crisis', weight: 1.5 }, //// expanded
  { term: 'hardship', weight: 1.4 }, //// expanded
  { term: 'stuck', weight: 1.2 }, //// expanded
  { term: 'difficult road', weight: 1.4 }, //// expanded
  { term: 'learning the hard way', weight: 1.5 }, //// expanded
];

const ENGAGEMENT_TRIGGERS: WeightedTerm[] = [
  { term: 'share your thoughts', weight: 1.8 },
  { term: 'comment below', weight: 1.7 },
  { term: 'your opinion matters', weight: 1.6 },
  { term: 'join the conversation', weight: 1.8 },
  { term: 'connect', weight: 1.5 },
  { term: 'community', weight: 1.5 },
  { term: 'let’s discuss', weight: 1.7 },
  { term: 'feedback welcome', weight: 1.6 },
  { term: 'tell us', weight: 1.6 }, //// expanded
  { term: 'love to hear from you', weight: 1.7 }, //// expanded
  { term: 'drop a comment', weight: 1.7 }, //// expanded
  { term: 'your thoughts?', weight: 1.7 }, //// expanded
  { term: 'we want your input', weight: 1.6 }, //// expanded
  { term: 'share experiences', weight: 1.8 }, //// expanded
  { term: 'inspire others', weight: 1.7 }, //// expanded
  { term: 'tell your story', weight: 1.8 }, //// expanded
  { term: 'how do you feel', weight: 1.7 }, //// expanded
];

const EMOJI_WEIGHTS: WeightedTerm[] = [
  { term: '🎉', weight: 1.6 },
  { term: '🔥', weight: 1.7 },
  { term: '💯', weight: 1.5 },
  { term: '👏', weight: 1.6 },
  { term: '🙏', weight: 1.5 },
  { term: '❤️', weight: 1.5 },
  { term: '🚀', weight: 1.6 },
  { term: '⭐', weight: 1.4 },
  { term: '🥳', weight: 1.5 }, //// expanded
  { term: '💪', weight: 1.5 }, //// expanded
  { term: '🌟', weight: 1.5 }, //// expanded
  { term: '🫶', weight: 1.4 }, //// expanded
  { term: '🤝', weight: 1.4 }, //// expanded
];

const STORYTELLING_TERMS: WeightedTerm[] = [
  { term: 'journey', weight: 1.7 },
  { term: 'story', weight: 1.6 },
  { term: 'experience', weight: 1.5 },
  { term: 'lesson', weight: 1.5 },
  { term: 'memory', weight: 1.4 },
  { term: 'reflection', weight: 1.4 },
  { term: 'path', weight: 1.5 },
  { term: 'chapter', weight: 1.5 },
  { term: 'turning point', weight: 1.6 }, //// expanded
  { term: 'growth journey', weight: 1.7 }, //// expanded
  { term: 'personal story', weight: 1.6 }, //// expanded
  { term: 'life-changing moment', weight: 1.7 }, //// expanded
  { term: 'pivot', weight: 1.5 }, //// expanded
  { term: 'narrative', weight: 1.5 }, //// expanded
];

const VALUE_INDICATORS: WeightedTerm[] = [
  { term: 'valuable', weight: 1.6 },
  { term: 'insight', weight: 1.5 },
  { term: 'wisdom', weight: 1.5 },
  { term: 'knowledge', weight: 1.4 },
  { term: 'expertise', weight: 1.5 },
  { term: 'guidance', weight: 1.4 },
  { term: 'lesson learned', weight: 1.6 },
  { term: 'deep dive', weight: 1.5 },
  { term: 'framework', weight: 1.4 }, //// expanded
  { term: 'methodology', weight: 1.4 }, //// expanded
  { term: 'tip', weight: 1.5 }, //// expanded
  { term: 'strategy', weight: 1.5 }, //// expanded
  { term: 'roadmap', weight: 1.5 }, //// expanded
  { term: 'resource', weight: 1.4 }, //// expanded
];

const INDUSTRY_KEYWORDS: WeightedTerm[] = [
  { term: 'tech', weight: 1.5 },
  { term: 'AI', weight: 1.6 },
  { term: 'cloud', weight: 1.5 },
  { term: 'startups', weight: 1.4 },
  { term: 'SaaS', weight: 1.4 },
  { term: 'fintech', weight: 1.5 },
  { term: 'blockchain', weight: 1.6 },
  { term: 'marketing', weight: 1.4 },
  { term: 'sales', weight: 1.4 },
  { term: 'healthcare', weight: 1.5 }, //// expanded
  { term: 'edtech', weight: 1.5 }, //// expanded
  { term: 'greentech', weight: 1.5 }, //// expanded
  { term: 'cybersecurity', weight: 1.6 }, //// expanded
  { term: 'consulting', weight: 1.4 }, //// expanded
  { term: 'leadership', weight: 1.5 }, //// expanded
  { term: 'ecommerce', weight: 1.5 }, //// expanded
  { term: 'biotech', weight: 1.6 }, //// expanded
];



const TIME_OF_DAY_WEIGHTS: Record<string, number> = { //// Simplified
  '6-9': 1.15, //// original
  '9-12': 1.3, //// original
  '12-15': 1.4, //// original
  '15-18': 1.35, //// original
  '18-21': 1.2, //// original
  //// expanded
  '0-3': 0.8,
  '3-6': 0.9,
  '21-24': 1.0
};

const DAY_OF_WEEK_WEIGHTS: Record<string, number> = {
  monday: 1.1, //// original
  tuesday: 1.15, //// original
  wednesday: 1.2, //// original
  thursday: 1.25, //// original
  friday: 1.2, //// original
  //// expanded
  saturday: 0.9,
  sunday: 0.85
};

const analysisCache = new Map<string, PostMetrics>();

// ==== GENERIC HELPERS ====
function weightedMatchCount(list: WeightedTerm[], text: string): number { //// New helper
  const lower = text.toLowerCase();
  return list.reduce((sum, { term, weight }) =>
    lower.includes(term) ? sum + weight : sum
  , 0);
}

const syllableCache = new Map<string, number>(); //// Memoize syllables
function countSyllables(word: string): number {
  const key = word.toLowerCase();
  if (syllableCache.has(key)) return syllableCache.get(key)!;
  const cleaned = key.replace(/[^a-z]/g, '');
  const count = Math.max(1, (cleaned.match(/[aeiouy]{1,2}/g) || []).length);
  syllableCache.set(key, count);
  return count;
}

// ==== ANALYSIS FUNCTIONS ====
export function analyzeSentiment(text: string): number {
  const words = text.split(/\s+/).length;
  const pos = weightedMatchCount(POSITIVE_FACTORS, text);
  const neg = weightedMatchCount(NEGATIVE_FACTORS, text);
  const raw = (pos - neg) / words * 2;
  return Math.max(-0.5, Math.min(1.5, raw));
}

export function analyzeEngagementTriggers(text: string): number {
  const w = weightedMatchCount(ENGAGEMENT_TRIGGERS, text);
  return 1 + Math.min(1, w * 0.1);
}
const HOOK_PHRASES: WeightedTerm[] = [
  { term: 'did you know', weight: 1.5 },
  { term: 'what if', weight: 1.6 },
  { term: 'imagine', weight: 1.4 },
  { term: 'have you ever', weight: 1.5 },
  { term: 'why not', weight: 1.4 },
  { term: 'curious', weight: 1.3 },
  { term: 'guess what', weight: 1.5 },
  { term: 'breaking news', weight: 1.6 },
  { term: 'picture this', weight: 1.4 },
  { term: 'you won’t believe', weight: 1.7 },
  { term: 'this might surprise you', weight: 1.5 },
  { term: 'little known fact', weight: 1.4 },
  { term: 'the truth is', weight: 1.3 },
  { term: 'here’s the deal', weight: 1.3 },
  { term: 'important update', weight: 1.5 },
  { term: 'shocking discovery', weight: 1.7 },
  { term: 'the real reason', weight: 1.6 },
  { term: 'must see', weight: 1.5 },
  { term: 'startling fact', weight: 1.6 },
  { term: 'once in a lifetime', weight: 1.7 },
  { term: 'a new study reveals', weight: 1.5 },
  { term: 'scientists say', weight: 1.4 },
  { term: 'many people don’t know', weight: 1.5 },
  { term: 'this changes everything', weight: 1.7 },
  { term: 'experts agree', weight: 1.4 },
  { term: 'new research shows', weight: 1.5 },
  { term: 'revealed', weight: 1.5 },
  { term: 'you need to see this', weight: 1.6 },
  
  // Expanded List
  { term: 'unbelievable but true', weight: 1.6 }, //// expanded
  { term: 'you won’t guess', weight: 1.5 }, //// expanded
  { term: 'did you ever wonder', weight: 1.4 }, //// expanded
  { term: 'it’s time to know', weight: 1.5 }, //// expanded
  { term: 'this will blow your mind', weight: 1.7 }, //// expanded
  { term: 'get ready for', weight: 1.4 }, //// expanded
  { term: 'this is huge', weight: 1.6 }, //// expanded
  { term: 'here’s why', weight: 1.5 }, //// expanded
  { term: 'a shocking reveal', weight: 1.7 }, //// expanded
  { term: 'you won’t believe your eyes', weight: 1.6 }, //// expanded
  { term: 'did you know this about', weight: 1.5 }, //// expanded
  { term: 'prepare to be amazed', weight: 1.6 }, //// expanded
  { term: 'don’t miss out', weight: 1.5 }, //// expanded
  { term: 'here’s the kicker', weight: 1.4 }, //// expanded
  { term: 'it’s a game-changer', weight: 1.7 }, //// expanded
  { term: 'breaking news alert', weight: 1.6 }, //// expanded
  { term: 'game-changing discovery', weight: 1.7 }, //// expanded
  { term: 'hidden truth', weight: 1.5 }, //// expanded
  { term: 'here’s the surprise', weight: 1.6 }, //// expanded
  { term: 'wait until you hear this', weight: 1.7 }, //// expanded
  { term: 'a shocking truth', weight: 1.6 }, //// expanded
  { term: 'don’t believe this', weight: 1.7 }, //// expanded
  { term: 'get ready to be shocked', weight: 1.7 }, //// expanded
  { term: 'take a moment to think', weight: 1.5 }, //// expanded
  { term: 'new insights reveal', weight: 1.5 }, //// expanded
  { term: 'prepare to be stunned', weight: 1.7 }, //// expanded
  { term: 'it’s going to blow your mind', weight: 1.7 }, //// expanded
  { term: 'you’ll be amazed by this', weight: 1.6 }, //// expanded
  { term: 'this is something you didn’t know', weight: 1.6 }, //// expanded
];



export function analyzeHookStrength(text: string): number {
  const head = text.slice(0,100);
  let score = 1 + (/\?/.test(head) ? 0.15 : 0);
  score += Math.min(2, weightedMatchCount(HOOK_PHRASES, head) * 0.1);
  return Math.min(1.5, score);
}

export function analyzeStorytelling(text: string): number {
  const found = weightedMatchCount(STORYTELLING_TERMS, text);
  const pronouns = (text.match(/\b(i|we|my|our)\b/gi) || []).length;
  return 1 + Math.min(0.3, found*0.05) + Math.min(0.2, pronouns*0.02);
}

export function analyzeValueProposition(text: string): number {
  const found = weightedMatchCount(VALUE_INDICATORS, text);
  const bonus = /\d+%|\d+ percent/.test(text) ? 0.1 : 0;
  return 1 + Math.min(0.3, found*0.05) + bonus;
}

export function analyzeIndustryRelevance(text: string, industry?: string): number {
  if (!industry || !INDUSTRY_KEYWORDS[industry]) return 1;
  const s = weightedMatchCount(INDUSTRY_KEYWORDS[industry], text);
  return Math.min(1.2, 0.8 + s*0.1);
}

export function calculateReadingTime(text: string): number {
  const words = text.split(/\s+/);
  const syllables = words.reduce((a,w) => a + countSyllables(w), 0);
  let speed = 225 - (syllables/words.length > 1.8 ? 25 : 0);
  return Math.max(1, Math.ceil(words.length / speed));
}

export function analyzeEmojis(text: string): { count: number; score: number } {
  const emojis: string[] = text.match(/[\u{1F600}-\u{1F6FF}]/gu) || [];
  const score = emojis.reduce((a, e) => a + (EMOJI_WEIGHTS[e] || 1), 0);
  return { count: emojis.length, score: 1 + Math.min(1, score*0.05) };
}

export function analyzeContentStructure(text: string) {
  const lines = text.split('\n');
  let paras=0, bullets=0, lists=0, heads=0, inPara=false;
  lines.forEach(ln => {
    if (/^#{1,3}\s/.test(ln)) { heads++; inPara=false; }
    else if (/^[-*•]\s/.test(ln)) { bullets++; inPara=false; }
    else if (/^\d+[\.)]\s/.test(ln)) { lists++; inPara=false; }
    else if (ln.trim()) { if (!inPara){ paras++; inPara=true; }} else inPara=false;
  });
  return { paragraphs: paras, bulletPoints: bullets, numberedLists: lists, headings: heads };
}

export function getTextFingerprint(text: string): string {
  const key = text.toLowerCase().split(/\s+/).slice(0,100).join(' ');
  let h=0; for (let c of key) { h=((h<<5)-h)+c.charCodeAt(0); h|=0; }
  return h.toString();
}

// ==== SCORING HELPERS ====
function calculateLengthMultiplier(len: number): number {
  const center = (OPTIMAL_LENGTH.min + OPTIMAL_LENGTH.max)/2;
  const width = (OPTIMAL_LENGTH.max - OPTIMAL_LENGTH.min)/2;
  const dist = Math.abs(len - center)/width;
  return Math.max(0.7, Math.min(1.5, 1.2 - Math.pow(dist,1.5)*0.5));
}

function calculateFollowerImpact(range: string = ''): number {
  const map: Record<string,number> = {'0-500':0.4,'500-1K':0.6,'1K-5K':1,'5K+':1.7};
  return map[range] || 1;
}

function calculateEngagementImpact(level: string = ''): number {
  return { High:1.8, Medium:1, Low:0.4 }[level] || 1;
}

function combineMultipliers(m: Record<string, number>): number {
  return Object.values(m).reduce((a,v) => a*v, 1);
}

// ==== CORE ANALYSIS ====
export function analyzePost(
  content: string,
  params?: AdvancedAnalysisParams
): PostMetrics {
  const fp = getTextFingerprint(content);
  if (analysisCache.has(fp)) return { ...analysisCache.get(fp)! };

  const struct  = analyzeContentStructure(content);
  const reading = calculateReadingTime(content);
  const sent    = analyzeSentiment(content);
  const trig    = analyzeEngagementTriggers(content);
  const emoInfo = analyzeEmojis(content);
  const hook    = analyzeHookStrength(content);
  const story   = analyzeStorytelling(content);
  const value   = analyzeValueProposition(content);
  const industryRel = analyzeIndustryRelevance(content, params?.industry);

  const multipliers = {
    length: calculateLengthMultiplier(content.length),
    sentiment: 1 + sent*0.1,
    triggers: trig,
    emojis: emoInfo.score,
    hook,
    story,
    value,
    industryRel
  };
  const advMult = calculateFollowerImpact(params?.followerRange || '') *
                  calculateEngagementImpact(params?.engagementLevel || '');
  const base = { eng:50, reach:50, viral:50 };

  const engagementScore = Math.min(100, Math.round(base.eng * combineMultipliers(multipliers) * advMult));
  const reachScore     = Math.min(100, Math.round(base.reach * multipliers.length * multipliers.emojis * industryRel * advMult * 0.9));
  const viralityScore  = Math.min(100, Math.round(base.viral * trig * multipliers.sentiment * story * advMult * 1.1));

  const likes    = Math.floor(Math.pow(engagementScore,1.1)*0.5);
  const comments = Math.floor(Math.pow(engagementScore,1.3)*0.08);
  const shares   = Math.floor(Math.pow(viralityScore,1.2)*0.1);

  const result = { engagementScore, reachScore, viralityScore, likes, comments, shares };
  analysisCache.set(fp, result);
  return result;
}

export function generateTimeSeries(content: string, hrs = 24): TimeSeriesData[] {
  const { engagementScore } = analyzePost(content);
  const data: TimeSeriesData[] = [];
  for (let h = 0; h < hrs; h++) {
    const val = engagementScore * (h < 3
      ? 0.2 + 0.8 * (h / 3)
      : h < 8
        ? (0.9 + Math.random()*0.1)*(1 - 0.03*(h-3))
        : 0.7 * Math.pow(1 - (0.04+Math.random()*0.03), h-8)
    );
    data.push({ time: `${h}h`, engagement: Math.round(Math.max(engagementScore*0.2, val)) });
  }
  return data;
}

export function generateSuggestions(content: string): PostSuggestion[] {
  const analysis = analyzePost(content);
  const suggestions: PostSuggestion[] = [];

  if (content.length < OPTIMAL_LENGTH.min) {
    suggestions.push({
      id: 'len-short',
      type: 'improvement',
      title: 'Post too short',
      description: `Only ${Math.round((content.length/OPTIMAL_LENGTH.min)*100)}% of min length.`
    });
  }
  if (content.length > OPTIMAL_LENGTH.max) {
    suggestions.push({
      id: 'len-long',
      type: 'warning',
      title: 'Post too long',
      description: `At ${Math.round((content.length/OPTIMAL_LENGTH.max)*100)}% of max length.`
    });
  }
  if (analysis.engagementScore < 60) {
    suggestions.push({
      id: 'low-eng',
      type: 'improvement',
      title: 'Boost engagement',
      description: 'Add questions or CTAs to invite comments.'
    });
  }
  const tagCount = (content.match(/#\w+/g) || []).length;
  if (tagCount < HASHTAG_OPTIMUM.min) {
    suggestions.push({
      id: 'few-tags',
      type: 'tip',
      title: 'Add more hashtags',
      description: `Use at least ${HASHTAG_OPTIMUM.min} hashtags.`
    });
  }

  return suggestions;
}
