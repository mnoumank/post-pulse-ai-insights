import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, Hash, HelpCircle, Megaphone, Tags, Type, Smile } from 'lucide-react';
import { toast } from 'sonner';
import Fuse from 'fuse.js';

// Types
interface AIPostMetrics {
  engagementScore: number;
  reachScore: number;
  viralityScore: number;
  isAIEnhanced?: boolean;
}

interface PostEditorProps {
  postNumber: 1 | 2;
  content: string;
  onChange: (content: string) => void;
  metrics: AIPostMetrics | null;
  isWinner?: boolean;
}

type SuggestionKey =
  | 'hook'
  | 'question'
  | 'cta'
  | 'hashtags'
  | 'whitespace'
  | 'emojis'
  | 'readability'
  | 'passive';

interface ContentAnalysis {
  missing: Record<SuggestionKey, boolean>;
  suggestions: Suggestion[];
  recommendedCta: string;
  hashtags: string[];
  readabilityScore: number;
}

interface Suggestion {
  key: SuggestionKey;
  title: string;
  description: string;
  examples: string[];
  benefits: string;
  Icon: React.ComponentType<any>;
}




// 1. Expanded Hook Templates
const HOOK_OPTIONS = [
  "🚀 Excited to share our latest breakthrough!",
  "💡 Here's an insight that surprised me…",
  "🎉 Celebrating a major milestone today—",
  "🔑 Key takeaway: always focus on…",
  "✨ Big news: we've just released…",
  "📈 Growth alert: our community just hit…",
  "⚡ Breaking: new feature now available!",
  "🤔 Did you know you can…?",
  "🎯 My top tip for [topic] is…",
  "🔥 Hot off the press: our team achieved…",
  "📢 Announcing our partnership with…",
  "🌟 Here’s why this matters to you…",
  "💪 Overcame a challenge today—here’s how…",
  "🙏 Grateful for the support—thank you everyone!",
  "📣 Major update: [brief summary]…",
  // NEW ADDITIONS (15+ more):
  "🏆 Humbled to win [award]—this is why it matters…",
  "🌍 Proud to share: we just expanded to [location]!",
  "⚠️ The biggest mistake I see in [industry]?",
  "🔄 We pivoted—here’s why it was the best decision…",
  "💯 [X] clients served—and the #1 lesson they taught us…",
  "🚨 PSA: If you’re not doing [X], you’re missing out…",
  "🌱 How we grew [metric] by [X]% in [timeframe]…",
  "🤯 Mind blown by [trend/stat]—here’s what it means…",
  "🎙️ Just featured on [podcast/media]! Listen here → [link]",
  "🛠️ Behind the scenes: how we built [product/feature]…",
  "📉 Why we failed at [X] (and what we learned)…",
  "👀 Sneak peek: our next big thing drops [date]…",
  "🤝 Thrilled to collaborate with [influencer/company]!",
  "📚 Sharing my top [X] lessons from [event/year]…",
  "⏳ Time-sensitive: this opportunity closes [date]!",
  "💬 Ask me anything about [topic]—I’ll reply below!",
  "🏅 [Team member] just did [achievement]—so proud!",
  "🔍 Deep dive: why [trend] is changing everything…"
];

const samplePosts = [
  "🚀 Exciting news! I just launched my new startup focused on AI-driven solutions. 💡 What are your thoughts on the future of AI in business?",
];

// 2. Expanded Hashtag Categories
const HASHTAG_CATEGORIES = {
  leadership: [
    '#leadership','#management','#teamwork','#coaching','#mentoring',
    '#vision','#strategy','#inspiration','#empowerment','#executive'
  ],
  career: [
    '#career','#careeradvice','#careerdevelopment','#jobsearch','#hiring',
    '#resume','#interview','#promotion','#success','#professional'
  ],
  business: [
    '#business','#entrepreneurship','#startups','#innovation','#strategy',
    '#growth','#finance','#marketing','#leadership','#scale'
  ],
  technology: [
    '#technology','#tech','#AI','#machinelearning','#software',
    '#cloud','#automation','#IoT','#cybersecurity','#bigdata'
  ],
  marketing: [
    '#marketing','#digitalmarketing','#socialmedia','#branding','#contentmarketing',
    '#SEO','#advertising','#campaign','#growthhacking','#inboundmarketing'
  ],
  productivity: [
    '#productivity','#timemanagement','#efficiency','#goals','#focus',
    '#workflow','#habits','#motivation','#mindset','#organization'
  ],
  networking: [
    '#networking','#connections','#community','#collaboration','#events',
    '#LinkedIn','#partnerships','#referrals','#socialnetworking','#relationships'
  ],
  learning: [
    '#learning','#growth','#education','#skills','#training',
    '#elearning','#development','#knowledge','#mindset','#continuouslearning'
  ],
  industry: [
    '#industry','#trends','#insights','#analysis','#expertise',
    '#sector','#innovation','#research','#forecast','#professional'
  ]
};

// 3. Expanded CTA Options
const CTA_OPTIONS = [
  "👇 Drop your thoughts below",
  "➡️ Tag someone who would benefit",
  "🔖 Save for later",
  "✍️ Share your experience",
  "💬 Like & share to help others",
  "📢 Spread the word by sharing",
  "🔗 Feel free to share this post",
  "👍 Hit like if this resonates",
  "🗣️ Let’s discuss in the comments",
  "📲 Share with your network",
  "🤝 Invite a friend to weigh in",
  "🎯 What’s your top takeaway?",
  "❓ Any questions? Ask below",
  "📌 Bookmark this for reference",
  "💡 Got ideas? Drop them below",
  // NEW ADDITIONS:
  "🚀 Which point resonates most? Comment!",
  "👀 Who needs to see this? Tag them!",
  "📈 Want more tips like this? Follow →",
  "🤔 Agree or disagree? Tell me why!",
  "🌱 Found this helpful? Repost ♻️",
  "🔄 Share with your team!",
  "💭 How would you apply this?",
  "📥 DM me for the full guide",
  "🏷️ Know someone struggling with this? Tag them!",
  "📝 What would you add to this list?",
  "⏳ Will you try this today? Say yes below!",
  "🎁 Bonus tip in the comments ↓",
  "📚 Want the full framework? Comment 'Guide'",
  "🧠 How do you approach this?",
  "💥 First time hearing this?",
  "🛠️ Which strategy will you use first?",
  "🤯 Did this change your perspective?",
  "👋 New here? Connect with me!",
  "📣 Help me reach [X] likes!",
  "⚡ Quick favor: share with 1 friend",
  "🏆 Which tip was most valuable?",
  "🔔 Turn on notifications for more!",
  "💌 DM me your biggest challenge"
];

const EMOJI_MAP: Record<string, string[]> = {
  announcement: ['🚀', '📢', '✨', '🎊', '📣', '🔔', '🌟', '⚡', '🆕', '🎯'],
  idea:         ['💡', '🧠', '🌟', '🔍', '💭', '🎨', '🤯', '💎', '🛠️', '💫'],
  growth:       ['📈', '🌱', '💹', '🚀', '🔼', '📊', '🪴', '🌳', '🧗', '🏔️'],
  challenge:    ['💪', '🧗', '🦾', '🏋️', '⚔️', '🥊', '🛡️', '🧩', '🏃', '⛰️'],
  question:     ['🤔', '❓', '🧐', '⁉️', '❔', '🔎', '👀', '💬', '🗨️', '🤷'],
  gratitude:    ['🙏', '❤️', '😊', '🤗', '🥰', '💝', '🎁', '🫂', '🌺', '☀️'],
  team:         ['👥', '🤝', '🫂', '👫', '👬', '👭', '🤜🤛', '🤲', '🧑‍🤝‍🧑', '🏘️'],
  future:       ['🔮', '⌛', '🔭', '🚧', '🛸', '🧭', '⏳', '🕰️', '🗓️', '🔜'],
  important:    ['🔑', '❗', '⚠️', '‼️', '🚨', '⛔', '🔴', '🔔', '🔎', '💢'],
  celebration:  ['🎉', '🥳', '🏆', '🎊', '🎁', '🏅', '🎖️', '🍾', '🥂', '🪅'],
  learning:     ['📚', '🎓', '🧠', '📖', '✏️', '📝', '📘', '📙', '📒', '🖋️'],
  tech:         ['💻', '📱', '🔌', '🖥️', '⌨️', '🖱️', '📡', '🛰️', '🤖', '👾'],
  business:     ['💼', '📊', '📑', '📌', '🏢', '🏭', '🛒', '💰', '💳', '💵'],
  motivation:   ['🔥', '⚡', '💯', '🏆', '🚀', '🎯', '💥', '👊', '🦾', '💪'],
  productivity: ['⏱️', '🕒', '✅', '📅', '🗓️', '📋', '✂️', '📎', '📌', '🖇️'],
  creativity:   ['🎨', '🖌️', '🖍️', '✏️', '📝', '📐', '🎭', '🎬', '🎤', '🎼'],
  default:      ['👋', '💬', '📝', '🔹', '▪️', '🔘', '🔵', '⚫', '🔳', '🔷']
};

const SUGGESTION_CONFIG: Record<SuggestionKey, Suggestion> = {
  hook: {
    key: 'hook',
    title: "Attention-Grabbing Hook",
    description: "The first lines should spark curiosity or emotion.",
    examples: HOOK_OPTIONS.slice(0, 3),
    benefits: "Hooks boost initial engagement by up to 5×",
    Icon: Megaphone
  },
  question: {
    key: 'question',
    title: "Engagement Question",
    description: "Questions invite comments and discussions.",
    examples: ["What's your experience?", "How would you handle this?"],
    benefits: "Posts with questions get 2–3× more comments",
    Icon: HelpCircle
  },
  cta: {
    key: 'cta',
    title: "Call-to-Action",
    description: "A clear CTA tells readers what to do next.",
    examples: CTA_OPTIONS.slice(0, 3),
    benefits: "CTAs increase engagement by 30–50%",
    Icon: Tags
  },
  hashtags: {
    key: 'hashtags',
    title: "Relevant Hashtags",
    description: "Hashtags help new audiences discover you.",
    examples: ["#Leadership #CareerGrowth", "#TechInnovation"],
    benefits: "3–5 hashtags can double your reach",
    Icon: Hash
  },
  whitespace: {
    key: 'whitespace',
    title: "Proper Spacing",
    description: "Spacing improves mobile readability.",
    examples: ["Short paragraphs with blank lines"],
    benefits: "Well-spaced posts retain 25% more readers",
    Icon: Type
  },
  emojis: {
    key: 'emojis',
    title: "Strategic Emojis",
    description: "Emojis add visual interest and convey tone.",
    examples: ["🚀 for launches", "💡 for insights"],
    benefits: "Emojis boost engagement by 15–20%",
    Icon: Smile
  },
  readability: {
    key: 'readability',
    title: "Simplify Sentences",
    description: "Shorter sentences improve clarity.",
    examples: ["Split long sentences at commas"],
    benefits: "Simpler text holds reader attention better",
    Icon: Sparkles
  },
  passive: {
    key: 'passive',
    title: "Active Voice",
    description: "Active voice strengthens your message.",
    examples: ["We developed (not 'was developed')"],
    benefits: "Active voice drives stronger engagement",
    Icon: Megaphone
  }
};

// Utilities
class ContentAnalyzer {
  private hookFuse: Fuse<string>;
  private ctaFuse: Fuse<string>;

  constructor() {
    this.hookFuse = new Fuse(HOOK_OPTIONS, {
      includeScore: true,
      threshold: 0.4,
      keys: ['text']
    });

    this.ctaFuse = new Fuse(CTA_OPTIONS, {
      threshold: 0.3,
      ignoreLocation: true
    });
  }

  analyze(content: string): ContentAnalysis {
    const cleanContent = this.cleanContent(content);
    const missing = this.checkMissingElements(cleanContent);
    
    return {
      missing,
      suggestions: this.getSuggestions(missing),
      recommendedCta: this.getRecommendedCta(cleanContent),
      hashtags: this.getHashtags(cleanContent),
      readabilityScore: this.calculateReadability(cleanContent)
    };
  }

  private cleanContent(text: string): string {
    return text
      .replace(/\s+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[^\S\r\n]{2,}/g, ' ')
      .trim();
  }

  private checkMissingElements(content: string): Record<SuggestionKey, boolean> {
    return {
      hook: !this.hookFuse.search(content).some(r => r.score! < 0.4),
      question: !/[?]/.test(content),
      cta: !this.ctaFuse.search(content).length,
      hashtags: (content.match(/#\w+/g) || []).length < 3,
      whitespace: !/\n\n/.test(content),
      emojis: !/[\p{Emoji}]/u.test(content),
      readability: this.calculateReadability(content) > 12,
      passive: /\b(am|is|are|was|were|be|been|being)\s+[\w]+ed\b/gi.test(content)
    };
  }

  private getSuggestions(missing: Record<SuggestionKey, boolean>): Suggestion[] {
    return (Object.entries(missing) as [SuggestionKey, boolean][])
      .filter(([_, isMissing]) => isMissing)
      .map(([key]) => SUGGESTION_CONFIG[key]);
  }

  private getRecommendedCta(content: string): string {
    const existingCtas = CTA_OPTIONS.filter(cta => content.includes(cta));
    return existingCtas.length > 0 
      ? existingCtas[0]
      : CTA_OPTIONS[Math.floor(Math.random() * CTA_OPTIONS.length)];
  }

  private getHashtags(content: string): string[] {
    const existing = [...new Set(content.match(/#\w+/g) || [])];
    return existing.length >= 5 ? existing : [
      ...existing,
      ...HASHTAG_CATEGORIES.business.slice(0, 5 - existing.length)
    ];
  }

  private calculateReadability(content: string): number {
    const words = content.split(/\s+/).length || 1;
    const sentences = (content.match(/[.!?]+/g) || []).length || 1;
    return Math.round((words / sentences) * 0.4 + (content.length / words) * 5.84);
  }
}

// Component
export function PostEditor({ postNumber, content, onChange, metrics, isWinner }: PostEditorProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(!content);
  const [activeSuggestion, setActiveSuggestion] = useState<SuggestionKey | null>(null);
  const analyzer = useMemo(() => new ContentAnalyzer(), []);
  const analysis = useMemo(() => analyzer.analyze(content), [content, analyzer]);

  useEffect(() => {
    setShowPlaceholder(!content);
    setActiveSuggestion(null);
  }, [content]);

  const handleEnhance = useCallback(() => {
    let enhanced = content;
    
    // Add missing elements
    if (analysis.missing.hook) {
      enhanced = `${HOOK_OPTIONS[Math.floor(Math.random() * HOOK_OPTIONS.length)]}\n\n${enhanced}`;
    }
    
    if (analysis.missing.cta) {
      enhanced += `\n\n${analysis.recommendedCta}`;
    }

    // Formatting improvements
    enhanced = enhanced
      .split('\n\n')
      .map(para => {
        if (para.length > 160) {
          return para.replace(/([,;])\s+/g, '$1\n• ');
        }
        return para;
      })
      .join('\n\n');

    onChange(enhanced);
    toast.success("Post enhanced", {
      description: `Added: ${analysis.suggestions.map(s => s.title).join(', ')}`
    });
  }, [content, analysis, onChange]);

  const getScoreColor = (score: number) =>
    score >= 80 ? 'bg-green-500' :
    score >= 60 ? 'bg-green-400' :
    score >= 40 ? 'bg-yellow-400' :
    'bg-red-400';

  return (
    <Card className={`w-full ${isWinner ? 'border-2 border-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            Post {postNumber}
            {isWinner && <Badge className="ml-2 bg-green-500">Winner</Badge>}
            {metrics?.isAIEnhanced && (
              <Badge variant="outline" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" /> AI Enhanced
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onChange('')}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={handleEnhance}>
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Enhance
            </Button>
          </div>
        </div>
        {metrics && (
          <div className="flex gap-2 mt-2">
            {(['engagementScore', 'reachScore', 'viralityScore'] as const).map((metric) => (
              <Badge key={metric} variant="outline" className="text-xs">
                {metric}:
                <span className={`ml-1 px-1.5 rounded-sm text-white ${getScoreColor(metrics[metric])}`}>
                  {metrics[metric]}
                </span>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[240px] resize-y p-4 font-sans leading-relaxed"
            placeholder="Type your LinkedIn post here..."
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start pt-0 gap-2">
        {analysis.suggestions.length > 0 && (
          <div className="w-full">
            <h4 className="text-xs font-semibold mb-2">Optimization Suggestions</h4>
            <div className="grid grid-cols-2 gap-2">
              {analysis.suggestions.map((suggestion) => (
                <div key={suggestion.key} className="relative">
                  <Badge
                    variant="outline"
                    className="w-full cursor-pointer text-left"
                    onClick={() => setActiveSuggestion(
                      activeSuggestion === suggestion.key ? null : suggestion.key
                    )}
                  >
                    <suggestion.Icon className="h-3 w-3 mr-1 inline-block" />
                    {suggestion.title}
                  </Badge>
                  {activeSuggestion === suggestion.key && (
                    <div className="absolute z-10 mt-1 p-3 bg-background border rounded-lg shadow-lg w-[300px]">
                      <h4 className="font-bold mb-2">{suggestion.title}</h4>
                      <p className="text-sm mb-2">{suggestion.description}</p>
                      <div className="text-sm mb-2">
                        <span className="font-medium">Examples:</span>
                        <ul className="list-disc pl-4 mt-1">
                          {suggestion.examples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-green-500 text-sm">{suggestion.benefits}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}






