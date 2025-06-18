
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function CreatePostPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt to generate a LinkedIn post.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-linkedin-post', {
        body: { prompt },
      });

      if (error) {
        throw error;
      }

      setGeneratedPost(data.post);
      
      toast({
        title: 'Success',
        description: 'LinkedIn post generated successfully!',
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

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
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

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create LinkedIn Post</h1>
            <p className="text-muted-foreground mt-2">
              Generate engaging LinkedIn posts using AI based on your ideas or stories
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Prompt or Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your idea, story, or topic that you want to turn into a LinkedIn post. For example: 'I learned a valuable lesson about leadership during my first team project...' or 'Share insights about remote work productivity'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating Post...' : 'Generate LinkedIn Post'}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Post Section */}
            {generatedPost && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Generated LinkedIn Post</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={handleCopyToClipboard}
                  >
                    Copy to Clipboard
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {generatedPost}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips Section */}
            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Share personal experiences and lessons learned</li>
                  <li>Include industry insights or professional tips</li>
                  <li>Ask engaging questions to encourage comments</li>
                  <li>Use storytelling to make your content relatable</li>
                  <li>Keep it authentic and professional</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
