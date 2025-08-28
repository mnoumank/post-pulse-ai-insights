
import React, { useState, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HookGenerator } from '@/components/HookGenerator';
import { ViralityDashboard } from '@/components/ViralityDashboard';
import { PostOptimizer } from '@/components/PostOptimizer';
import { ContentCategorySelector } from '@/components/ContentCategorySelector';
import { analyzePostVirality } from '@/utils/enhancedViralityAnalyzer';
import { useContentPersistence } from '@/context/ContentPersistenceContext';
import { useFeedbackTracker } from '@/hooks/useFeedbackTracker';
import { FeedbackDialog } from '@/components/FeedbackDialog';
import { useDemoLimits } from '@/hooks/useDemoLimits';
import { Trash2, AlertCircle } from 'lucide-react';

export default function CreatePostPage() {
  const { createPostState, updateCreatePostState, clearCreatePostState } = useContentPersistence();
  const { showFeedback, closeFeedback, trackOperation } = useFeedbackTracker();
  const { limits, incrementCreates, isAuthenticated } = useDemoLimits();
  
  const [userIdea, setUserIdea] = useState(createPostState.userIdea);
  const [selectedHook, setSelectedHook] = useState(createPostState.selectedHook);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(createPostState.selectedCategory || null);
  const [generatedPost, setGeneratedPost] = useState(createPostState.generatedPost);
  const [activeTab, setActiveTab] = useState(createPostState.activeTab || 'idea');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viralityData, setViralityData] = useState<any>(null);

  // Update persistent storage when state changes
  React.useEffect(() => {
    updateCreatePostState({
      userIdea,
      selectedHook,
      selectedCategory: selectedCategory || '',
      generatedPost,
      activeTab,
    });
  }, [userIdea, selectedHook, selectedCategory, generatedPost, activeTab, updateCreatePostState]);

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

    // Check demo limits for unauthenticated users
    if (!isAuthenticated) {
      const canProceed = await incrementCreates();
      if (!canProceed) {
        toast({
          title: 'Demo limit reached',
          description: 'Sign up for unlimited access to generate more posts.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-enhanced-post', {
        body: { 
          idea: userIdea,
          selectedHook,
          category: categoryId || selectedCategory,
          includeViralityOptimization: true,
          skipIPCheck: isAuthenticated // Skip IP check for authenticated users
        },
      });

      if (error) throw error;

      setGeneratedPost(data.post);
      await analyzeContent(data.post);
      setActiveTab('optimize');
      
      // Track successful operation for feedback
      await trackOperation();
      
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

  const handleClearAll = () => {
    setUserIdea('');
    setSelectedHook('');
    setSelectedCategory(null);
    setGeneratedPost('');
    setActiveTab('idea');
    setViralityData(null);
    clearCreatePostState();
    toast({
      title: 'Cleared',
      description: 'All content has been cleared.',
    });
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
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Viral LinkedIn Post</h1>
              <p className="text-muted-foreground mt-2">
                AI-powered content creation with real-time virality optimization
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>

          {!isAuthenticated && limits && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Demo Mode: {limits.can_create ? `${1 - limits.creates_used} create remaining` : 'Create limit reached'}. 
                <Button variant="link" className="p-0 h-auto ml-2" onClick={() => window.location.href = '/signup'}>
                  Sign up for unlimited access
                </Button>
              </AlertDescription>
            </Alert>
          )}

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
                    disabled={isGenerating || !userIdea.trim() || (!isAuthenticated && limits && !limits.can_create)}
                  >
                    {isGenerating ? 'Generating Post...' : (!isAuthenticated && limits && !limits.can_create) ? 'Demo Limit Reached' : 'Generate Optimized Post'}
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
        
        <FeedbackDialog 
          open={showFeedback} 
          onOpenChange={closeFeedback}
          page="create-post"
        />
      </div>
    </PageTransition>
  );
}
