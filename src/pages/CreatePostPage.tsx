
import React, { useState, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HookGenerator } from '@/components/HookGenerator';
import { ViralityDashboard } from '@/components/ViralityDashboard';
import { PostOptimizer } from '@/components/PostOptimizer';
import { ContentCategorySelector } from '@/components/ContentCategorySelector';
import { analyzePostVirality } from '@/utils/enhancedViralityAnalyzer';

export default function CreatePostPage() {
  const [userIdea, setUserIdea] = useState('');
  const [selectedHook, setSelectedHook] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viralityData, setViralityData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('idea');

  const analyzeContent = useCallback(async (content: string) => {
    if (!content.trim()) {
      setViralityData(null);
      return;
    }

    try {
      const analysis = await analyzePostVirality(content);
      setViralityData({
        factors: analysis.factors,
        score: analysis.viralityScore,
        metrics: {
          likes: Math.round(analysis.viralityScore * 50),
          comments: Math.round(analysis.viralityScore * 12),
          shares: Math.round(analysis.viralityScore * 8),
          reach: Math.round(analysis.viralityScore * 200)
        }
      });
      
    } catch (error) {
      console.error('Error analyzing content:', error);
    }
  }, []);

  const handleGenerate = async (categoryId?: string) => {
    if (!userIdea.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your idea to generate a LinkedIn post.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-enhanced-post', {
        body: { 
          idea: userIdea,
          selectedHook,
          category: categoryId || selectedCategory,
          includeViralityOptimization: true
        },
      });

      if (error) throw error;

      setGeneratedPost(data.post);
      await analyzeContent(data.post);
      setActiveTab('optimize');
      
      toast({
        title: 'Success',
        description: 'Virality-optimized LinkedIn post generated!',
      });
    } catch (error) {
      console.error('Error generating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate LinkedIn post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentChange = (content: string) => {
    setGeneratedPost(content);
    analyzeContent(content);
  };

  React.useEffect(() => {
    if (generatedPost.trim()) {
      analyzeContent(generatedPost);
    }
  }, [generatedPost, analyzeContent]);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create Viral LinkedIn Post</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered content creation with real-time virality optimization
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="idea">1. Your Idea</TabsTrigger>
                <TabsTrigger value="category">2. Category</TabsTrigger>
                <TabsTrigger value="hooks">3. Hook</TabsTrigger>
                <TabsTrigger value="optimize">4. Optimize</TabsTrigger>
              </TabsList>

              <TabsContent value="idea" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What's your idea?</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Share your story, insight, or topic. The more specific, the better.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Examples:&#10;• I made a huge mistake in my first leadership role that taught me...&#10;• Here's what 5 years of remote work taught me about productivity...&#10;• The unconventional advice that doubled my network in 6 months..."
                      value={userIdea}
                      onChange={(e) => setUserIdea(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <Button 
                      onClick={() => setActiveTab('category')}
                      disabled={!userIdea.trim()}
                      className="w-full"
                    >
                      Continue to Category Selection
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="category" className="space-y-6">
                <ContentCategorySelector
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  userIdea={userIdea}
                  onGenerateForCategory={(categoryId) => {
                    setSelectedCategory(categoryId);
                    setActiveTab('hooks');
                  }}
                />
                {selectedCategory && (
                  <div className="flex justify-center">
                    <Button onClick={() => setActiveTab('hooks')}>
                      Continue to Hook Selection
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="hooks" className="space-y-6">
                <HookGenerator
                  userIdea={userIdea}
                  onHookSelect={setSelectedHook}
                  selectedHook={selectedHook}
                />
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('category')}
                  >
                    Back to Category
                  </Button>
                  <Button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !userIdea.trim()}
                  >
                    {isGenerating ? 'Generating Post...' : 'Generate Optimized Post'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="optimize">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <PostOptimizer
                      content={generatedPost}
                      onContentChange={handleContentChange}
                      onAnalyze={() => analyzeContent(generatedPost)}
                    />
                  </div>
                  <div>
                    {viralityData && (
                      <ViralityDashboard
                        factors={viralityData.factors}
                        overallScore={viralityData.score}
                        predictedMetrics={viralityData.metrics}
                      />
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
