import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2, Copy, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface OptimizationSuggestion {
  type: string;
  title: string;
  description: string;
  action: string;
}

interface PostOptimizerProps {
  content: string;
  onContentChange: (content: string) => void;
  onAnalyze: () => void;
}

export const PostOptimizer: React.FC<PostOptimizerProps> = ({
  content,
  onContentChange,
  onAnalyze
}) => {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizePost = async (optimizationType: string) => {
    if (!content.trim()) return;

    setIsOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-post', {
        body: { 
          content, 
          optimizationType 
        },
      });

      if (error) throw error;
      
      onContentChange(data.optimizedContent);
      onAnalyze(); // Re-analyze after optimization
      
      toast({
        title: 'Post Optimized',
        description: `Applied ${optimizationType} optimization successfully`,
      });
    } catch (error) {
      console.error('Error optimizing post:', error);
      toast({
        title: 'Error',
        description: 'Failed to optimize post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const generateSuggestions = async () => {
    if (!content.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('analyze-post-suggestions', {
        body: { content },
      });

      if (error) throw error;
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  React.useEffect(() => {
    if (content.trim()) {
      const debounceTimer = setTimeout(generateSuggestions, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [content]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied!',
        description: 'Post copied to clipboard successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const optimizationActions = [
    { type: 'hook', label: 'Improve Hook', description: 'Make the opening more engaging' },
    { type: 'readability', label: 'Enhance Readability', description: 'Improve formatting and flow' },
    { type: 'storytelling', label: 'Add Storytelling', description: 'Include more narrative elements' },
    { type: 'vulnerability', label: 'Increase Vulnerability', description: 'Make it more personal and relatable' },
    { type: 'cta', label: 'Strengthen CTA', description: 'Improve the call-to-action' },
    { type: 'value', label: 'Add Value', description: 'Include more actionable insights' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Post Content</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={onAnalyze}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Your LinkedIn post content will appear here. You can edit it directly to see real-time virality updates."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Quick Optimization Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Optimizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {optimizationActions.map((action) => (
              <Button
                key={action.type}
                variant="outline"
                size="sm"
                onClick={() => optimizePost(action.type)}
                disabled={isOptimizing || !content.trim()}
                className="justify-start text-left p-3 h-auto"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-3 w-3" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.type}
                    </Badge>
                    <span className="text-sm font-medium">{suggestion.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {suggestion.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => optimizePost(suggestion.type)}
                    disabled={isOptimizing}
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    {suggestion.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};