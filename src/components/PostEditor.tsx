import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, Hash, HelpCircle, Megaphone, Tags, Type, Smile } from 'lucide-react';
import { toast } from 'sonner';
import { AIPostMetrics } from '@/utils/aiAnalyzer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PostEditorProps {
  postNumber: 1 | 2;
  content: string;
  onChange: (content: string) => void;
  metrics: AIPostMetrics | null;
  isWinner?: boolean;
}

const samplePosts = [
  "🚀 Excited to announce our new product launch! After months of hard work, our team has created something truly innovative. #ProductLaunch #Innovation\n\nWhat features would you like to see in our next update?",
  "💡 I've been reflecting on leadership lessons I've learned in my career:\n\n1. Listen more than you speak\n2. Empower your team to make decisions\n3. Celebrate small wins along the way\n4. Be transparent, especially during challenges\n\nWhat's your most valuable leadership lesson? Comment below 👇 #Leadership #CareerAdvice",
  "🎉 Today marks 5 years at Company X!\n\nLooking back, I'm grateful for:\n- The amazing colleagues who became friends\n- Challenging projects that helped me grow\n- The supportive environment that encourages innovation\n\nExcited for what the future holds! #WorkAnniversary #CareerGrowth",
  "📈 Just hit 10K followers! A huge thank you to everyone who's been part of this journey.\n\nKey lessons from growing this community:\n• Consistency matters\n• Quality over quantity\n• Engagement builds relationships\n\nWhat's your favorite tip for community building? #Growth #ThankYou",
  "🤔 Have you noticed how workplace dynamics have changed post-pandemic?\n\nHere's what we're seeing:\n🔹 More focus on mental health\n🔹 Hybrid work is here to stay\n🔹 Skills matter more than degrees\n\nHow has your workplace evolved? #FutureOfWork #Leadership"
];

const HASHTAG_CATEGORIES = {
  leadership: ['#leadership', '#management', '#leadershipdevelopment', '#teamwork', '#coaching', '#mentoring'],
  career: ['#careeradvice', '#careerdevelopment', '#careerchange', '#jobsearch', '#hiring', '#careers'],
  business: ['#business', '#entrepreneurship', '#startups', '#smallbusiness', '#innovation', '#strategy'],
  technology: ['#technology', '#tech', '#innovation', '#ai', '#digitaltransformation', '#future'],
  marketing: ['#marketing', '#digitalmarketing', '#socialmedia', '#branding', '#contentmarketing'],
  productivity: ['#productivity', '#timemanagement', '#goals', '#success', '#motivation', '#planning'],
  networking: ['#networking', '#connections', '#community', '#professionals', '#linkedinnetwork'],
  learning: ['#learning', '#growth', '#personaldevelopment', '#education', '#skills', '#mindset'],
  industry: ['#industry', '#trends', '#solutions', '#insights', '#expertise', '#professional']
};

interface ContentAnalysis {
  missingElements: {
    hook: boolean;
    question: boolean;
    cta: boolean;
    hashtags: boolean;
    whitespace: boolean;
    emojis: boolean;
  };
  suggestedImprovements: string[];
  recommendedCta: string;
}

const EMOJI_MAP = {
  announcement: ['🚀', '🎊', '📢', '✨', '🔥'],
  idea: ['💡', '🧠', '🌟', '🔍', '🎯'],
  growth: ['📈', '🌱', '🚀', '⬆️', '💹'],
  challenge: ['💪', '🏋️', '🧗', '⛰️', '🦾'],
  question: ['🤔', '❓', '⁉️', '🔎', '🧐'],
  gratitude: ['🙏', '❤️', '😊', '🤗', '🎁'],
  team: ['👥', '🤝', '👫', '👨‍👩‍👧‍👦', '🫂'],
  future: ['🔮', '⌛', '⏳', '🔭', '🧭'],
  important: ['🔑', '❗', '‼️', '⚠️', '⭐'],
  celebration: ['🎉', '🥳', '🎊', '👏', '🏆'],
  default: ['👋', '💬', '📝', '🖊️', '✍️']
};

const SuggestionTooltips = {
  hook: {
    title: "Attention-Grabbing Hook",
    description: "The first 2-3 lines determine whether people keep reading. A strong hook should spark curiosity or emotion.",
    examples: [
      "🚀 Just launched our biggest update yet!",
      "💡 Here's a counterintuitive leadership lesson...",
      "😮 I never expected this to happen when I...",
      "📣 Breaking: Our team just achieved something incredible!",
      "🤯 What if I told you everything you know about [topic] is wrong?"
    ],
    benefits: "Posts with strong hooks get 3-5x more engagement in the first few lines."
  },
  question: {
    title: "Engagement Question",
    description: "Questions invite comments and discussions, which boosts your post's visibility in the algorithm.",
    examples: [
      "What's been your experience with this?",
      "How would you handle this situation?",
      "Which of these resonates most with you and why?",
      "What would you add to this list?",
      "Has anyone else faced this challenge?"
    ],
    benefits: "Posts with questions receive 2-3x more comments on average."
  },
  cta: {
    title: "Call-to-Action (CTA)",
    description: "A clear CTA tells readers exactly what you want them to do next, increasing engagement.",
    examples: [
      "Drop a 💙 if you agree or comment with your thoughts!",
      "Share with someone who needs to see this ➡️",
      "Save this for later and try it out!",
      "Tag a colleague who would appreciate this",
      "Let's discuss in the comments 👇"
    ],
    benefits: "Posts with CTAs have 30-50% higher engagement rates."
  },
  hashtags: {
    title: "Relevant Hashtags",
    description: "Hashtags help your post get discovered by people interested in those topics beyond your network.",
    examples: [
      "#Leadership #CareerGrowth #ProfessionalDevelopment",
      "#TechInnovation #DigitalTransformation #FutureOfWork",
      "#MarketingTips #ContentStrategy #SocialMediaMarketing"
    ],
    benefits: "Posts with 3-5 hashtags get 2x more reach than those without."
  },
  whitespace: {
    title: "Proper Spacing",
    description: "Good spacing makes your post easier to read, especially on mobile devices where screen space is limited.",
    examples: [
      "Short paragraphs\n\nSeparated by blank lines",
      "Bullet points with\n\nClear separation between ideas",
      "Section breaks\n\nBetween different topics\n\nFor better readability"
    ],
    benefits: "Well-spaced posts get 25% more read-through to the end."
  },
  emojis: {
    title: "Strategic Emojis",
    description: "Emojis break up text, add visual interest, and help convey tone in your professional communication.",
    examples: [
      "🚀 Use for announcements and launches",
      "💡 Great for insights and ideas",
      "🎯 Perfect for key takeaways",
      "🤝 Ideal for collaboration topics",
      "📊 Works well for data and metrics"
    ],
    benefits: "Posts with emojis get 15-20% more engagement than text-only posts."
  }
};

const getRelevantHashtags = (content: string, maxHashtags: number = 4) => {
  const text = content.toLowerCase();
  let relevantTags = new Set<string>();
  
  const keywordMap = {
    'lead': 'leadership',
    'team': 'leadership',
    'manage': 'leadership',
    'motivat': 'leadership',
    'career': 'career',
    'job': 'career',
    'hiring': 'career',
    'interview': 'career',
    'business': 'business',
    'startup': 'business',
    'entrepreneur': 'business',
    'company': 'business',
    'tech': 'technology',
    'ai': 'technology',
    'digital': 'technology',
    'software': 'technology',
    'market': 'marketing',
    'brand': 'marketing',
    'content': 'marketing',
    'social media': 'marketing',
    'productiv': 'productivity',
    'goal': 'productivity',
    'success': 'productivity',
    'achieve': 'productivity',
    'network': 'networking',
    'connect': 'networking',
    'communit': 'networking',
    'learn': 'learning',
    'develop': 'learning',
    'grow': 'learning',
    'skill': 'learning'
  };

  const matchedCategories = new Set<string>();
  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (text.includes(keyword)) {
      matchedCategories.add(category);
    }
  }
  
  if (matchedCategories.size === 0) {
    matchedCategories.add('networking');
    matchedCategories.add('professional');
  }
  
  for (const category of matchedCategories) {
    const categoryTags = HASHTAG_CATEGORIES[category];
    if (categoryTags) {
      const numToAdd = Math.min(2, Math.ceil(maxHashtags / matchedCategories.size));
      const shuffled = [...categoryTags].sort(() => 0.5 - Math.random());
      shuffled.slice(0, numToAdd).forEach(tag => relevantTags.add(tag));
    }
  }
  
  relevantTags.add('#linkedin');
  
  return Array.from(relevantTags).slice(0, maxHashtags);
};

const analyzeContent = (content: string): ContentAnalysis => {
  const analysis: ContentAnalysis = {
    missingElements: {
      hook: true,
      question: true,
      cta: true,
      hashtags: true,
      whitespace: true,
      emojis: true,
    },
    suggestedImprovements: [],
    recommendedCta: '',
  };

  if (!content.trim()) {
    return analysis;
  }

  // Check for hooks/attention grabbers
  const hookPatterns = [
    /^[👋🎯💡🔑✨🚀📈💪🤔🙏👥🔮🎉🔥]/,
    /(excited|proud|happy|thrilled) to announce/i,
    /(introducing|launching|releasing) our/i,
    /(breaking news|big news|important update)/i,
    /(just in|hot off the press)/i,
    /(never expected|surprising|shocking)/i
  ];
  analysis.missingElements.hook = !hookPatterns.some(pattern => pattern.test(content));

  // Check for questions
  analysis.missingElements.question = !/(\?|what do you think|your thoughts|comment below|let me know)/i.test(content);

  // Check for CTAs
  const ctaPatterns = [
    /(share your thoughts|let me know|comment below|join the conversation)/i,
    /(click the link|learn more|read more|check it out)/i,
    /(save this post|bookmark this|share with your network)/i,
    /(what's your take|how would you handle|have you experienced)/i,
    /(tag a colleague|who needs to see this)/i
  ];
  analysis.missingElements.cta = !ctaPatterns.some(pattern => pattern.test(content));

  // Check for hashtags
  analysis.missingElements.hashtags = !/#\w+/i.test(content);

  // Check for whitespace issues
  analysis.missingElements.whitespace = /\n{3,}|^\s*$/.test(content);

  // Check for emojis
  analysis.missingElements.emojis = !/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(content);

  // Generate suggested improvements
  if (analysis.missingElements.hook) {
    analysis.suggestedImprovements.push("attention-grabbing hook");
  }
  if (analysis.missingElements.question) {
    analysis.suggestedImprovements.push("engagement question");
  }
  if (analysis.missingElements.cta) {
    analysis.suggestedImprovements.push("clear call-to-action");
  }
  if (analysis.missingElements.hashtags) {
    analysis.suggestedImprovements.push("relevant hashtags");
  }
  if (analysis.missingElements.whitespace) {
    analysis.suggestedImprovements.push("better spacing");
  }
  if (analysis.missingElements.emojis) {
    analysis.suggestedImprovements.push("strategic emojis");
  }

  // Determine best CTA based on content
  if (content.match(/announce|launch|introduce/i)) {
    analysis.recommendedCta = "What features would you like to see in future updates? Let us know in the comments! 💬";
  } else if (content.match(/lesson|learn|experience/i)) {
    analysis.recommendedCta = "What's your experience with this? Share in the comments below! 👇";
  } else if (content.match(/question|problem|challenge/i)) {
    analysis.recommendedCta = "How would you solve this? Let's discuss in the comments! 💡";
  } else if (content.match(/milestone|achievement|anniversary/i)) {
    analysis.recommendedCta = "What milestones are you celebrating this year? Share your wins below! 🎉";
  } else if (content.match(/data|statistic|number/i)) {
    analysis.recommendedCta = "How does this compare to your experience? Drop a comment with your thoughts! 📊";
  } else {
    analysis.recommendedCta = "What are your thoughts on this? Let me know in the comments! 💭";
  }

  return analysis;
};

const getBestEmojiForLine = (line: string): string => {
  const emojiCategories = {
    announcement: ['🚀', '🎊', '📢', '✨', '🔥'],
    idea: ['💡', '🧠', '🌟', '🔍', '🎯'],
    growth: ['📈', '🌱', '🚀', '⬆️', '💹'],
    challenge: ['💪', '🏋️', '🧗', '⛰️', '🦾'],
    question: ['🤔', '❓', '⁉️', '🔎', '🧐'],
    gratitude: ['🙏', '❤️', '😊', '🤗', '🎁'],
    team: ['👥', '🤝', '👫', '👨‍👩‍👧‍👦', '🫂'],
    future: ['🔮', '⌛', '⏳', '🔭', '🧭'],
    important: ['🔑', '❗', '‼️', '⚠️', '⭐'],
    celebration: ['🎉', '🥳', '🎊', '👏', '🏆'],
    default: ['👋', '💬', '📝', '🖊️', '✍️']
  };

  if (/launch|announce|new|introduce/i.test(line)) {
    return emojiCategories.announcement[Math.floor(Math.random() * emojiCategories.announcement.length)];
  }
  if (/lesson|learn|knowledge|experience/i.test(line)) {
    return emojiCategories.idea[Math.floor(Math.random() * emojiCategories.idea.length)];
  }
  if (/success|achievement|milestone|growth/i.test(line)) {
    return emojiCategories.growth[Math.floor(Math.random() * emojiCategories.growth.length)];
  }
  if (/challenge|problem|difficult|hard/i.test(line)) {
    return emojiCategories.challenge[Math.floor(Math.random() * emojiCategories.challenge.length)];
  }
  if (/question|ask|opinion|thoughts/i.test(line)) {
    return emojiCategories.question[Math.floor(Math.random() * emojiCategories.question.length)];
  }
  if (/thank|grateful|appreciate/i.test(line)) {
    return emojiCategories.gratitude[Math.floor(Math.random() * emojiCategories.gratitude.length)];
  }
  if (/team|together|collaborate/i.test(line)) {
    return emojiCategories.team[Math.floor(Math.random() * emojiCategories.team.length)];
  }
  if (/future|next|coming/i.test(line)) {
    return emojiCategories.future[Math.floor(Math.random() * emojiCategories.future.length)];
  }
  if (/important|key|critical/i.test(line)) {
    return emojiCategories.important[Math.floor(Math.random() * emojiCategories.important.length)];
  }
  if (/happy|excited|thrilled/i.test(line)) {
    return emojiCategories.celebration[Math.floor(Math.random() * emojiCategories.celebration.length)];
  }
  return emojiCategories.default[Math.floor(Math.random() * emojiCategories.default.length)];
};

export function PostEditor({ postNumber, content, onChange, metrics, isWinner }: PostEditorProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(!content);
  const analysis = analyzeContent(content);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setShowPlaceholder(e.target.value.length === 0);
  };

  const insertSample = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * samplePosts.length);
    } while (content === samplePosts[randomIndex] && samplePosts.length > 1);
    
    onChange(samplePosts[randomIndex]);
    setShowPlaceholder(false);
  };

  const cleanupText = () => {
    if (!content.trim()) {
      toast("No content to clean up", {
        description: "Please add some text first"
      });
      return;
    }

    // Process each line intelligently
    let cleanedText = content
      .split('\n')
      .filter(line => line.trim())
      .map((line, i, arr) => {
        // Skip if line already starts with an emoji
        if (!line.match(/^[👋🎯💡🔑✨🚀📈💪🤔🙏👥🔮🎉🔥]/)) {
          const emoji = getBestEmojiForLine(line);
          return `${emoji} ${line.trim()}`;
        }
        return line.trim();
      })
      .join('\n\n');

    // Fix bullet points and lists
    cleanedText = cleanedText.replace(/^[-•*]\s*/gm, '• ');

    // Remove existing hashtags but preserve the text
    cleanedText = cleanedText.replace(/#\w+/g, '').trim();

    // Get relevant hashtags (max 4)
    const relevantHashtags = getRelevantHashtags(cleanedText, 4);
    
    // Add hashtags only if we have content
    if (cleanedText && relevantHashtags.length > 0) {
      cleanedText += '\n\n' + relevantHashtags.join(' ');
    }

    // Add missing elements based on analysis
    if (analysis.missingElements.question) {
      cleanedText += `\n\n${analysis.recommendedCta}`;
    }

    // Remove any excessive empty lines
    cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n').trim();

    onChange(cleanedText);
    
    // Show detailed toast with improvements
    if (analysis.suggestedImprovements.length > 0) {
      toast.success("Post enhanced!", {
        description: `Added: ${analysis.suggestedImprovements.join(', ')}`,
        action: {
          label: "Undo",
          onClick: () => onChange(content),
        },
      });
    } else {
      toast("Post already looks great!", {
        description: "Only minor formatting improvements were made",
      });
    }
  };

  const addRecommendedHashtags = () => {
    if (!metrics?.recommendedHashtags?.length) {
      toast("No AI-recommended hashtags available", {
        description: "Enable AI analysis to get hashtag recommendations"
      });
      return;
    }

    let updatedContent = content.replace(/#\w+/g, '').trim();
    updatedContent += '\n\n' + metrics.recommendedHashtags.join(' ');
    onChange(updatedContent);
    
    toast("Hashtags added!", {
      description: "Added AI-recommended hashtags to your post"
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-green-400';
    if (score >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <Card className={`w-full ${isWinner ? 'border-2 border-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            Post {postNumber} {isWinner && <Badge className="ml-2 bg-green-500">Winner</Badge>}
            {metrics?.isAIEnhanced && (
              <Badge variant="outline" className="ml-2 flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
                AI Enhanced
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={insertSample} 
              className="h-8 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Sample
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={cleanupText} 
              className="h-8 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Enhance
            </Button>
          </div>
        </div>
        {metrics && (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Engagement: <span className={`ml-1 px-1.5 rounded-sm text-white ${getScoreColor(metrics.engagementScore)}`}>{metrics.engagementScore}</span>
            </Badge>
            <Badge variant="outline" className="text-xs">
              Reach: <span className={`ml-1 px-1.5 rounded-sm text-white ${getScoreColor(metrics.reachScore)}`}>{metrics.reachScore}</span>
            </Badge>
            <Badge variant="outline" className="text-xs">
              Virality: <span className={`ml-1 px-1.5 rounded-sm text-white ${getScoreColor(metrics.viralityScore)}`}>{metrics.viralityScore}</span>
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Textarea
            value={content}
            onChange={handleChange}
            placeholder=""
            className="min-h-[240px] resize-y font-sans text-base leading-relaxed p-4"
          />
          {showPlaceholder && (
            <div className="absolute top-0 left-0 p-4 text-gray-400 pointer-events-none">
              Type your LinkedIn post here...
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start pt-0 gap-2">
        {analysis.suggestedImprovements.length > 0 && (
          <div className="w-full">
            <h4 className="text-xs font-semibold mb-1">Suggested Improvements</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <TooltipProvider>
                {analysis.missingElements.hook && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-start w-full">
                        <Megaphone className="h-3 w-3 mr-1" /> missing hook
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[300px]">
                      <h4 className="font-bold mb-1">{SuggestionTooltips.hook.title}</h4>
                      <p className="mb-2">{SuggestionTooltips.hook.description}</p>
                      <p className="font-semibold text-sm mb-1">Examples:</p>
                      <ul className="list-disc pl-4 mb-2 space-y-1">
                        {SuggestionTooltips.hook.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                      <p className="text-green-500 text-sm">{SuggestionTooltips.hook.benefits}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {analysis.missingElements.question && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-start w-full">
                        <HelpCircle className="h-3 w-3 mr-1" /> missing engaging question
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[300px]">
                      <h4 className="font-bold mb-1">{SuggestionTooltips.question.title}</h4>
                      <p className="mb-2">{SuggestionTooltips.question.description}</p>
                      <p className="font-semibold text-sm mb-1">Examples:</p>
                      <ul className="list-disc pl-4 mb-2 space-y-1">
                        {SuggestionTooltips.question.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                      <p className="text-green-500 text-sm">{SuggestionTooltips.question.benefits}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {analysis.missingElements.cta && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-start w-full">
                        <Megaphone className="h-3 w-3 mr-1" /> missing Call to Action
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[300px]">
                      <h4 className="font-bold mb-1">{SuggestionTooltips.cta.title}</h4>
                      <p className="mb-2">{SuggestionTooltips.cta.description}</p>
                      <p className="font-semibold text-sm mb-1">Examples:</p>
                      <ul className="list-disc pl-4 mb-2 space-y-1">
                        {SuggestionTooltips.cta.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                      <p className="text-green-500 text-sm">{SuggestionTooltips.cta.benefits}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {analysis.missingElements.hashtags && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-start w-full">
                        <Tags className="h-3 w-3 mr-1" /> missing proper hashtags
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[300px]">
                      <h4 className="font-bold mb-1">{SuggestionTooltips.hashtags.title}</h4>
                      <p className="mb-2">{SuggestionTooltips.hashtags.description}</p>
                      <p className="font-semibold text-sm mb-1">Examples:</p>
                      <ul className="list-disc pl-4 mb-2 space-y-1">
                        {SuggestionTooltips.hashtags.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                      <p className="text-green-500 text-sm">{SuggestionTooltips.hashtags.benefits}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {analysis.missingElements.whitespace && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-start w-full">
                        <Type className="h-3 w-3 mr-1" /> Fix spacing
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[300px]">
                      <h4 className="font-bold mb-1">{SuggestionTooltips.whitespace.title}</h4>
                      <p className="mb-2">{SuggestionTooltips.whitespace.description}</p>
                      <p className="font-semibold text-sm mb-1">Examples:</p>
                      <ul className="list-disc pl-4 mb-2 space-y-1">
                        {SuggestionTooltips.whitespace.examples.map((ex, i) => (
                          <li key={i} className="whitespace-pre-wrap">{ex}</li>
                        ))}
                      </ul>
                      <p className="text-green-500 text-sm">{SuggestionTooltips.whitespace.benefits}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {analysis.missingElements.emojis && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="justify-start w-full">
                        <Smile className="h-3 w-3 mr-1" /> missing proper emojis
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[300px]">
                      <h4 className="font-bold mb-1">{SuggestionTooltips.emojis.title}</h4>
                      <p className="mb-2">{SuggestionTooltips.emojis.description}</p>
                      <p className="font-semibold text-sm mb-1">Examples:</p>
                      <ul className="list-disc pl-4 mb-2 space-y-1">
                        {SuggestionTooltips.emojis.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                      <p className="text-green-500 text-sm">{SuggestionTooltips.emojis.benefits}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </div>
        )}

        {metrics?.recommendedHashtags?.length > 0 && (
          <div className="w-full">
            <div className="flex items-center mb-1">
              <Hash className="h-4 w-4 mr-1" />
              <span className="text-xs font-semibold">Suggested Hashtags</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={addRecommendedHashtags}
            >
              Add AI Hashtags
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}