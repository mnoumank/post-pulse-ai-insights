import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Smile,
  Star,
  Target,
  Lightbulb
} from 'lucide-react';

interface ContentCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  viralityTips: string[];
  examples: string[];
}

interface ContentCategorySelectorProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  userIdea: string;
  onGenerateForCategory: (categoryId: string) => void;
}

const contentCategories: ContentCategory[] = [
  {
    id: 'personal-story',
    name: 'Personal Story',
    description: 'Share personal experiences, lessons learned, and vulnerable moments',
    icon: <User className="h-4 w-4" />,
    viralityTips: [
      'Include a clear challenge-resolution arc',
      'Share specific failures and what you learned',
      'Use vulnerable language and be authentic',
      'End with a universal lesson others can apply'
    ],
    examples: [
      'I got fired from my dream job and here\'s what it taught me...',
      'My biggest failure led to my greatest success...',
      'The mistake that changed my career forever...'
    ]
  },
  {
    id: 'knowledge-sharing',
    name: 'Knowledge Sharing',
    description: 'Provide actionable insights, tips, and professional expertise',
    icon: <BookOpen className="h-4 w-4" />,
    viralityTips: [
      'Include specific, actionable steps',
      'Use numbers and data when possible',
      'Create a simple framework others can follow',
      'Share insider knowledge or unique perspectives'
    ],
    examples: [
      '5 productivity hacks that doubled my output...',
      'The framework I use to manage any project...',
      'What 10 years in consulting taught me about...'
    ]
  },
  {
    id: 'hot-takes',
    name: 'Musings & Hot Takes',
    description: 'Share contrarian views and thought-provoking opinions',
    icon: <MessageSquare className="h-4 w-4" />,
    viralityTips: [
      'Take a contrarian but defensible position',
      'Challenge conventional wisdom respectfully',
      'Back up opinions with evidence or experience',
      'Ask provocative questions to spark debate'
    ],
    examples: [
      'Unpopular opinion: Remote work is actually killing creativity...',
      'Everyone talks about work-life balance, but here\'s why it\'s wrong...',
      'The advice that\'s ruining your career (and what to do instead)...'
    ]
  },
  {
    id: 'motivational',
    name: 'Motivational',
    description: 'Inspire and encourage professional growth and resilience',
    icon: <TrendingUp className="h-4 w-4" />,
    viralityTips: [
      'Use empowering language and positive framing',
      'Include a clear call to action for self-improvement',
      'Share transformation stories with specific outcomes',
      'Address common professional struggles'
    ],
    examples: [
      'You\'re not behind in your career, you\'re exactly where you need to be...',
      'Stop waiting for permission to do great work...',
      'Your biggest career breakthrough is one conversation away...'
    ]
  },
  {
    id: 'industry-insights',
    name: 'Industry Insights',
    description: 'Share trends, predictions, and deep industry knowledge',
    icon: <Lightbulb className="h-4 w-4" />,
    viralityTips: [
      'Share exclusive insights or early trend observations',
      'Connect dots between seemingly unrelated events',
      'Predict future implications of current trends',
      'Use data and specific examples to support points'
    ],
    examples: [
      'The AI trend everyone\'s missing that will change everything...',
      'Why the future of work isn\'t what you think...',
      '3 industry shifts happening right now that will impact your career...'
    ]
  },
  {
    id: 'behind-scenes',
    name: 'Behind the Scenes',
    description: 'Show the reality behind success, failures, and daily work',
    icon: <Target className="h-4 w-4" />,
    viralityTips: [
      'Show the messy reality behind polished success',
      'Include specific details and numbers',
      'Share unexpected challenges and how you solved them',
      'Be transparent about costs, time, and effort'
    ],
    examples: [
      'What it really took to land my dream job (spoiler: it wasn\'t pretty)...',
      'The unsexy work behind every "overnight success"...',
      'Here\'s what my actual daily schedule looks like...'
    ]
  }
];

export const ContentCategorySelector: React.FC<ContentCategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  userIdea,
  onGenerateForCategory
}) => {
  const getRecommendedCategory = (idea: string): string => {
    const lowerIdea = idea.toLowerCase();
    
    if (lowerIdea.includes('story') || lowerIdea.includes('experience') || lowerIdea.includes('learned')) {
      return 'personal-story';
    }
    if (lowerIdea.includes('tip') || lowerIdea.includes('how to') || lowerIdea.includes('framework')) {
      return 'knowledge-sharing';
    }
    if (lowerIdea.includes('unpopular') || lowerIdea.includes('opinion') || lowerIdea.includes('controversial')) {
      return 'hot-takes';
    }
    if (lowerIdea.includes('motivat') || lowerIdea.includes('inspir') || lowerIdea.includes('encourage')) {
      return 'motivational';
    }
    if (lowerIdea.includes('trend') || lowerIdea.includes('industry') || lowerIdea.includes('future')) {
      return 'industry-insights';
    }
    if (lowerIdea.includes('behind') || lowerIdea.includes('reality') || lowerIdea.includes('actually')) {
      return 'behind-scenes';
    }
    
    return 'personal-story'; // Default recommendation
  };

  const recommendedCategory = userIdea ? getRecommendedCategory(userIdea) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Category</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose the type of content that best fits your idea for optimized virality
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contentCategories.map((category) => (
            <div
              key={category.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedCategory === category.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                {recommendedCategory === category.id && (
                  <Badge variant="default" className="text-xs">
                    Recommended
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {category.description}
              </p>
              
              {selectedCategory === category.id && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium mb-2">Virality Tips:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {category.viralityTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium mb-2">Example hooks:</h4>
                    <div className="space-y-1">
                      {category.examples.map((example, index) => (
                        <p key={index} className="text-xs text-muted-foreground italic">
                          "{example}"
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onGenerateForCategory(category.id)}
                    disabled={!userIdea.trim()}
                  >
                    Generate {category.name} Post
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};