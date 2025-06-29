import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { AIPostMetrics } from '@/utils/aiAnalyzer';

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

export function PostEditor({ postNumber, content, onChange, metrics, isWinner }: PostEditorProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(!content);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setShowPlaceholder(e.target.value.length === 0);
  };

  const cleanupText = () => {
    if (!content.trim()) {
      toast("No content to clean up", {
        description: "Please add some text first"
      });
      return;
    }

    let cleanedText = content.split('\n').map((line, i) => {
      if (line.trim() && !line.match(/^[👋🎯💡🔑✨🚀📈💪]/)) {
        const emojis = ['👋', '🎯', '💡', '🔑', '✨', '🚀', '📈', '💪'];
        return `${emojis[i % emojis.length]} ${line}`;
      }
      return line;
    }).join('\n');

    cleanedText = cleanedText.replace(/^- /gm, '• ');

    cleanedText = cleanedText.replace(/#\w+/g, '').trim();

    const relevantHashtags = getRelevantHashtags(cleanedText);
    cleanedText += '\n\n' + relevantHashtags.join(' ');

    if (!cleanedText.toLowerCase().includes('thoughts?') && 
        !cleanedText.toLowerCase().includes('agree?') &&
        !cleanedText.includes('?')) {
      cleanedText += '\n\nWhat are your thoughts? 🤔';
    }

    cleanedText = cleanedText.replace(/([.!?])\s+/g, '$1\n\n');

    onChange(cleanedText);
    toast("Text cleaned up!", {
      description: "Added structure, emojis, and relevant hashtags"
    });
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
              onClick={cleanupText} 
              className="h-8 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
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
      {metrics?.recommendedHashtags?.length > 0 && (
        <CardFooter className="flex-col items-start pt-0">
          <div className="flex items-center mb-2">
            <Hash className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-sm font-medium">AI Recommended Hashtags:</span>
            <Button 
              variant="link" 
              size="sm" 
              onClick={addRecommendedHashtags} 
              className="text-xs ml-2 h-6 p-0"
            >
              Add to post
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {metrics.recommendedHashtags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
