import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, Hash, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { AIPostMetrics } from '@/utils/aiAnalyzer';
import Typo from 'typo-js';

let cachedTypo: Typo | null = null;

const loadDictionary = async (): Promise<Typo> => {
  if (cachedTypo) return cachedTypo; //// cache for reuse

  const aff = await fetch('/typo/en_US.aff').then(r => r.text());
  const dic = await fetch('/typo/en_US.dic').then(r => r.text());

  cachedTypo = new Typo('en_US', aff, dic);
  return cachedTypo;
};


interface PostEditorProps {
  postNumber: 1 | 2;
  content: string;
  onChange: (content: string) => void;
  metrics: AIPostMetrics | null;
  isWinner?: boolean;
}

const samplePosts = [
  "🚀 Excited to announce our new product launch! After months of hard work, our team has created something truly innovative. #ProductLaunch #Innovation\n\nWhat features would you like to see in our next update?",
  "I've been reflecting on leadership lessons I've learned in my career:\n\n1. Listen more than you speak\n2. Empower your team to make decisions\n3. Celebrate small wins along the way\n4. Be transparent, especially during challenges\n\nWhat's your most valuable leadership lesson? Comment below 👇 #Leadership #CareerAdvice",
  "Today marks 5 years at Company X! 🎉\n\nLooking back, I'm grateful for:\n- The amazing colleagues who became friends\n- Challenging projects that helped me grow\n- The supportive environment that encourages innovation\n\nExcited for what the future holds! #WorkAnniversary #CareerGrowth",
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



export function PostEditor({ postNumber, content, onChange, metrics, isWinner }: PostEditorProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(!content);
  const [isCleaning, setIsCleaning] = useState(false);

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
  const cleanupText = async () => {
    if (!content.trim()) {
      toast("No content to clean up", {
        description: "Please add some text first"
      });
      return;
    }
  
    setIsCleaning(true);
  
    try {
      const typo = await loadDictionary();
      const originalContent = content; 

      // Text correction processing (unchanged)
      const paragraphs = content.split('\n');
      let cleanedText = paragraphs.map(paragraph => {
        if (!paragraph.trim()) return paragraph;
        const correctedParagraph = paragraph.split(/(\s+)/).map(token => {
          if (/\s/.test(token)) return token;
          const matches = token.match(/^([^a-zA-Z]*)(.*?)([^a-zA-Z]*)$/);
          if (!matches) return token;
          const [_, prefix, word, suffix] = matches;
          if (!word) return token;

          const contractions = {
            "dont": "don't", "cant": "can't", "wont": "won't",
            "youre": "you're", "theyre": "they're", "im": "I'm", "ive": "I've",
            "wouldnt": "wouldn't", "shouldnt": "shouldn't", "couldnt": "couldn't"
          };

          if (contractions[word.toLowerCase()]) {
            return prefix + contractions[word.toLowerCase()] + suffix;
          }

          if (!typo.check(word)) {
            const suggestions = typo.suggest(word);
            const bestMatch = suggestions.find(s =>
              s.length >= Math.floor(word.length * 0.7) &&
              s.length <= Math.ceil(word.length * 1.3)
            );
            return prefix + (bestMatch || word) + suffix;
          }

          return token;
        }).join('');
        return correctedParagraph;
      }).join('\n');

      // ===== Emoji Check =====
      const emojiRegex = /\p{Emoji}/gu;
      const existingEmojiCount = (cleanedText.match(emojiRegex) || []).length;
      const maxEmojis = 3; // Maximum emojis allowed

      // Only add emojis if we have less than the max
      if (existingEmojiCount < maxEmojis) {
        const paragraphsWithEmojis = cleanedText.split('\n');
        cleanedText = paragraphsWithEmojis.map(paragraph => {
          if (!paragraph.trim()) return paragraph;
          
          const sentences = paragraph.split(/(?<=[.!?])\s+/g);
          let addedEmojis = 0;
          const remainingEmojis = maxEmojis - existingEmojiCount;
          
          return sentences.map((sentence, i) => {
            // Skip if sentence already has emoji or we've added enough
            if (emojiRegex.test(sentence) || addedEmojis >= remainingEmojis) {
              return sentence;
            }
            
            if (i % 2 === 0) { // Add to every other sentence
              const map = {
                technical: ['💻', '⚙️', '📱'],
                positive: ['🚀', '🎉', '✨'],
                question: ['❓', '💡', '🤔'],
                action: ['👉', '✅', '🔗'],
                success: ['🏆', '🥇', '🎊'],
                team: ['🤝', '👥', '👨‍👩‍👧‍👦'],
                education: ['📚', '🎓' ],
              };
              const ctx =
          sentence.trim().endsWith('?') ? 'question' :
          /\b(great|amazing|success|congrats|wonderful|well done|achievement|bravo|milestone|win|celebrate|proud)\b/i.test(sentence) ? 'success' :
          /\b(team|collaborate|collaboration|partner|group|together|join forces|coworkers|colleagues|synergy|cooperate|unity)\b/i.test(sentence) ? 'team' :
          /\b(career|job|interview|hire|promotion|cv|resume|position|recruit|apply|employment|profession|opportunity)\b/i.test(sentence) ? 'career' :
          /\b(learn|study|university|class|course|education|training|lecture|academic|school|exam|degree|curriculum|tutor|syllabus)\b/i.test(sentence) ? 'education' :
          /\b(tech|code|software|product|technology|engineering|programming|developer|platform|application|system|automation|algorithm|AI|ML|data)\b/i.test(sentence) ? 'technical' :
          sentence.trim().endsWith('!') ? 'positive' :
          'action';
        
              addedEmojis++;
              return `${sentence} ${map[ctx][addedEmojis % map[ctx].length]}`;
            }
            return sentence;
          }).join(' ');
        }).join('\n');
      }

      // ===== Hashtag Check =====
      const existingHashtags = [...new Set(cleanedText.match(/#\w+/g) || [])];
      const maxHashtags = 6;
      
      // Only add hashtags if we have less than max
      if (existingHashtags.length < maxHashtags) {
        const recommended = getEnhancedHashtags(cleanedText)
          .filter(tag => !existingHashtags.some(h => h.toLowerCase() === tag.toLowerCase()))
          .slice(0, maxHashtags - existingHashtags.length);
        
        if (recommended.length > 0) {
          cleanedText = cleanedText.replace(/\n#\w+(?:\s+#\w+)*\s*$/g, '').trimEnd();
          if (!cleanedText.endsWith('\n')) cleanedText += '\n';
          cleanedText += `\n${[...existingHashtags, ...recommended].join(' ')}`;
        }
      }

      // ===== CTA Check =====
        const ctaMatrix = {
                  question: ["What are your thoughts?", "Share your opinion below!", "We'd love to hear from you!"],
                  announcement: ["Stay tuned for more updates!", "Don't miss out!", "Exciting times ahead!"],
                  education: ["Keep learning and growing!", "Knowledge is power!", "What did you learn today?"],
                  career: ["Take the next step in your career!", "Your journey starts here!", "Let's grow together!"],
                  team: ["Teamwork makes the dream work!", "Collaboration is key!", "Together, we achieve more!"],
                  success: ["Celebrate your wins!", "Keep striving for greatness!", "Success is a journey!"],
                  motivation: ["Stay motivated and inspired!", "You can do it!", "Keep pushing forward!"],
                  innovation: ["Think outside the box!", "Innovation drives progress!", "What's your next big idea?"],
                  networking: ["Let's connect and grow!", "Expand your network!", "Opportunities await!"],
                  feedback: ["Your feedback matters!", "Let us know your thoughts!", "We value your input!"],
                  leadership: ["Lead by example!", "Your leadership inspires!", "Step up and shine!"], //////
                  business: ["Grow your business today!", "Unlock new strategies!", "Let's talk business!"], //////
                  marketing: ["Boost your brand visibility!", "Marketing drives impact!", "Engage your audience!"], //////
                  personal: ["Invest in yourself!", "Personal growth matters!", "Take care of your well-being!"], //////
                  productivity: ["Maximize your output!", "Work smarter, not harder!", "Stay focused and efficient!"], //////
                  industry: ["What's trending in your industry?", "Stay ahead of the curve!", "Insights that matter!"], //////
                  political: ["Make your voice heard!", "Get involved in the conversation!", "Your opinion matters!"], //////
                  default: ["Engage with us!", "Join the conversation!", "Let's make an impact together!"]
                };
      
      const hasCTA = Object.values(ctaMatrix).flat().some(cta => 
        cleanedText.toLowerCase().includes(cta.toLowerCase())
      );
      
      // Only add CTA if none exists
      if (!hasCTA) {
        
        const postType =
          cleanedText.includes('?') ? 'question' :
          /\b(launch|new|announce|release|introduce|unveil|rollout|debut|reveal|present)\b/i.test(cleanedText) ? 'announcement' :
          /\b(study|learn|exam|university|education|course|training|degree|lecture|class|academic|school)\b/i.test(cleanedText) ? 'education' :
          /\b(hired|promotion|job|career|intern|employment|recruit|position|role|offer|cv|resume|interview)\b/i.test(cleanedText) ? 'career' :
          /\b(team|collaboration|partner|together|cooperate|join forces|alliance|synergy|group|organization)\b/i.test(cleanedText) ? 'team' :
          /\b(success|congrats|achievement|milestone|win|accomplishment|recognition|award|honor|victory)\b/i.test(cleanedText) ? 'success' :
          /\b(motivate|inspire|drive|ambition|encourage|empower|uplift|energize|stimulate|ignite)\b/i.test(cleanedText) ? 'motivation' :
          /\b(innovate|research|develop|discovery|breakthrough|invention|prototype|explore|advance|experiment)\b/i.test(cleanedText) ? 'innovation' :
          /\b(network|connect|meet|gather|event|conference|webinar|mingle|mixer|community)\b/i.test(cleanedText) ? 'networking' :
          /\b(feedback|review|comment|suggestion|opinion|critique|response|reaction|input|testimonial)\b/i.test(cleanedText) ? 'feedback' :
          'default';
        cleanedText = cleanedText.trimEnd();
        if (!cleanedText.endsWith('\n')) cleanedText += '\n';
        cleanedText += `\n${ctaMatrix[postType][Math.floor(Math.random() * 3)]}`;
      }

      onChange(cleanedText);
      toast("Cleanup applied - only added missing elements");
  
    } catch (error) {
      toast.error("Cleanup failed", {
        description: error instanceof Error ? error.message : "Error processing text"
      });
    } finally {
      setIsCleaning(false);
    }
  };
  
  


  const getEnhancedHashtags = (content: string, maxTags: number = 4) => {
    // Keep original enhanced hashtag logic
    const text = content.toLowerCase();
    const categoryMatches = new Map<string, number>();
    
    const KEYWORD_CATEGORIES = {
      leadership: [
        'lead', 'manage', 'team', 'mentor', 'coach',
        'supervise', 'guide', 'delegate', 'strategy', 'vision',
        'direct', 'authority', 'decision', 'head', 'chair'
      ],
      tech: [
        'ai', 'tech', 'digital', 'software', 'innovation',
        'machine learning', 'data', 'cloud', 'robotics', 'algorithm',
        'automation', 'platform', 'app', 'engineering', 'hardware'
      ],
      career: [
        'job', 'promotion', 'skills', 'interview', 'resume',
        'internship', 'cv', 'position', 'apply', 'career',
        'hire', 'recruit', 'profession', 'company', 'employer'
      ],
      productivity: [
        'efficiency', 'tools', 'hack', 'routine', 'focus',
        'optimize', 'workflow', 'schedule', 'time management',
        'goal', 'discipline', 'plan', 'method', 'habit'
      ]
      ,
      networking: [
        'network', 'connect', 'community', 'event', 'relationship',
        'collaborate', 'partnership', 'engage', 'meet', 'join',
        'association', 'link', 'socialize', 'interact', 'mingle'
      ],
      education: [
        'learn', 'study', 'course', 'degree', 'university',
        'school', 'academic', 'knowledge', 'training', 'certificate',
        'enroll', 'educate', 'instruct', 'teach', 'mentor'
      ],
      business: [
        'business', 'entrepreneur', 'startup', 'company', 'strategy',   
        'market', 'sales', 'profit', 'growth', 'investment',
        'finance', 'customer', 'brand', 'product', 'service'
      ],
      marketing: [
        'marketing', 'advertise', 'campaign', 'brand', 'content',
        'social media', 'strategy', 'target', 'audience', 'engagement',
        'promotion', 'analytics', 'SEO', 'PPC', 'influence'
      ],
      personal: [
        'personal', 'growth', 'development', 'self-improvement', 'mindset',
        'wellness', 'motivation', 'inspiration', 'success', 'goal',
        'achievement', 'resilience', 'confidence', 'attitude', 'balance'
      ],
      industry: [
        'industry', 'sector', 'market', 'trend', 'analysis',
        'report', 'insight', 'news', 'update', 'development',
        'forecast', 'research', 'innovation', 'solution', 'expertise'
      ],
      professional: [
        'professional', 'career', 'expert', 'specialist', 'consultant',
        'practitioner', 'authority', 'leader', 'executive', 'manager',
        'director', 'officer', 'administrator', 'coordinator', 'supervisor'
      ] 
    };
    

    Object.entries(KEYWORD_CATEGORIES).forEach(([category, keywords]) => {
      const score = keywords.filter(kw => text.includes(kw)).length;
      if (score > 0) categoryMatches.set(category, score);
    });

    if (categoryMatches.size === 0) {
      categoryMatches.set('professional', 1);
      categoryMatches.set('networking', 1);
    }

    return Array.from(categoryMatches.entries())
      .sort((a, b) => b[1] - a[1])
      .flatMap(([category]) => 
        HASHTAG_CATEGORIES[category]?.slice(0, Math.ceil(maxTags / categoryMatches.size)) || []
      )
      .slice(0, maxTags);
  };

  

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-green-400';
    if (score >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getMissingElements = (content: string) => {
    const missing = [];
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const firstLine = lines[0] || '';
    const hookKeywords = [
      'excited', 'announce', 'announcing', 'introducing', 'launching', 'released', 'unveiling',
      'happy', 'pleased', 'thrilled', 'grateful', 'honored', 'proud', 'humbled', 'delighted',
      'achievement', 'milestone', 'journey', 'today', 'finally', 'after years', 'can’t wait',
      'moment', 'celebrating', 'level up', 'dream', 'opportunity', 'next step', 'big news',
      'new chapter', 'new beginning', 'new journey', 'new adventure', 'new opportunity',
      'new phase', 'new era', 'new milestone', 'new level', 'new heights', 'new goals',
      'new challenges', 'new experiences', 'new skills', 'new knowledge', 'new insights',
    ];
    
    const hasHook = hookKeywords.some(k => firstLine.toLowerCase().includes(k)) || firstLine.includes('?');
    if (!hasHook) missing.push('hook');

    const hasHashtags = /#\w+/.test(content);
    if (!hasHashtags) missing.push('hashtags');

    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const hasEmojis = emojiRegex.test(content);
    if (!hasEmojis) missing.push('emojis');

    const positiveWords = [
      'great', 'excellent', 'happy', 'awesome', 'success', 'achieve', // original
      'amazing', 'fantastic', 'wonderful', 'brilliant', 'outstanding', 'incredible',
      'proud', 'accomplished', 'celebrate', 'win', 'victory', 'positive',
      'growth', 'improvement', 'progress', 'uplifting', 'inspiring', 'motivated',
      'confident', 'encouraged', 'rewarding', 'productive', 'fulfilled', 'joyful',
      'grateful', 'enthusiastic', 'resilient', 'strong', 'energized', 'cheerful',
      'optimistic', 'thrilled', 'glad', 'delighted', 'smiling', 'bright', 'hopeful'
    ];    
    const hasPositiveTone = positiveWords.some(w => content.toLowerCase().includes(w));
    if (!hasPositiveTone) missing.push('positive tone');

    return missing;
  };

  const missingElements = getMissingElements(content);
 
  
  const [description, setDescription] = useState({ text: '', example: '', stats: '' });
  const [activeElement, setActiveElement] = useState(null); //// track the currently active element
  

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
              disabled={isCleaning}
            >
              {isCleaning ? (
                <Loader className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 mr-1" />
              )}
              Clean up
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
      {missingElements.length > 0 && (
  <CardFooter className="flex-col items-start pt-0 border-t">
    <div className="text-sm text-muted-foreground mb-2 font-semibold">Missing elements:</div>
    <div className="flex flex-wrap gap-2 mb-4">
      {missingElements.map((element) => (
        <Button
          key={element}
          variant="outline"
          size="sm"
          className="h-6 rounded-full px-2.5 text-xs font-normal hover:bg-gray-200 transition-all duration-200"
          onClick={() => {
            if (activeElement === element) {
              setActiveElement(null); //// toggle off
              setDescription({ text: '', example: '', stats: '' }); //// clear description
              return;
            }
          
            setActiveElement(element); //// set active element
          
            switch (element) {
              case 'hook':
                setDescription({
                  text: 'A hook is an attention-grabbing statement or question that piques the audience\'s interest, drawing them into the content.',
                  example: '"Did you know 80% of people fail at keeping their new year resolutions?"',
                  stats: 'Posts with a compelling hook see up to 50% more engagement, as they encourage the audience to keep reading.'
                });
                break;
              case 'hashtags':
                setDescription({
                  text: 'Hashtags categorize content and make it discoverable by users who are interested in specific topics or trends.',
                  example: '"#Technology, #AI, #Innovation"',
                  stats: 'Posts with relevant hashtags increase reach by 30-40%, making content discoverable to a wider audience.'
                });
                break;
              case 'emojis':
                setDescription({
                  text: 'Emojis convey emotions, enhance engagement, and make content more relatable and fun.',
                  example: '"This is awesome! 😄💥🚀"',
                  stats: 'Using emojis in posts can boost engagement by up to 56%, as they add a human touch and emotion.'
                });
                break;
              case 'positive tone':
                setDescription({
                  text: 'A positive tone sets an optimistic and welcoming mood, making the content more engaging and approachable.',
                  example: '"Keep pushing forward and you will achieve your dreams!"',
                  stats: 'Content with a positive tone can increase audience trust and lead to higher retention rates, improving overall interaction.'
                });
                break;
              default:
                setDescription({ text: '', example: '', stats: '' });
            }
          }}
          
        >
          {element}
        </Button>
      ))}

      {/* Only show the description if it has content */}
      {description.text && (
        <div className="mt-4 w-full p-4 border border-gray-200 rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {description.text}
        </p>
        <div className="mt-3 text-sm text-blue-600 italic">
          <strong className="not-italic mr-1">Example:</strong>
          <span>{description.example}</span>
        </div>
        <div className="mt-2 text-sm text-green-600 font-medium">
          <strong className="text-green-700 mr-1">Statistic:</strong>
          <span>{description.stats}</span>
        </div>
      </div>
      )}
    </div>
  </CardFooter>
)}

    </Card>
  );
}