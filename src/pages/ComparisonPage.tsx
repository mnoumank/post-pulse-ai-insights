
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { PostEditor } from '@/components/PostEditor';
import { MetricsBarChart } from '@/components/MetricsBarChart';
import { SuggestionCards } from '@/components/SuggestionCards';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { AdvancedAnalysisPanel } from '@/components/AdvancedAnalysisPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePostComparison } from '@/context/PostComparisonContext';
import { 
  analyzePost, 
  generateSuggestions, 
  comparePostsPerformance,
  type AdvancedAnalysisParams 
} from '@/utils/improvedPostAnalyzer';

export default function ComparisonPage() {
  const { post1, post2, setPost1, setPost2 } = usePostComparison();
  const [advancedParams, setAdvancedParams] = useState<AdvancedAnalysisParams>({
    followerRange: '1K-5K',
    industry: 'Technology',
    engagementLevel: 'Medium',
  });

  // Generate metrics using improved analyzer
  const metrics1 = post1 ? analyzePost(post1, advancedParams) : null;
  const metrics2 = post2 ? analyzePost(post2, advancedParams) : null;
  
  // Generate suggestions using improved analyzer
  const suggestions1 = post1 ? generateSuggestions(post1) : [];
  const suggestions2 = post2 ? generateSuggestions(post2) : [];
  
  // Compare posts using improved analyzer
  const comparison = post1 && post2 ? comparePostsPerformance(post1, post2, advancedParams) : null;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Compare LinkedIn Posts</h1>
            <p className="text-muted-foreground mt-2">
              Compare two LinkedIn posts side-by-side with improved AI analysis
            </p>
          </div>

          <div className="space-y-8">
            {/* Advanced Analysis Panel */}
            <AdvancedAnalysisPanel
              params={advancedParams}
              onParamsChange={setAdvancedParams}
            />

            {/* Post Editors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PostEditor
                title="Post A"
                content={post1}
                onChange={setPost1}
                metrics={metrics1}
                placeholder="Enter your first LinkedIn post here..."
              />
              <PostEditor
                title="Post B"
                content={post2}
                onChange={setPost2}
                metrics={metrics2}
                placeholder="Enter your second LinkedIn post here..."
              />
            </div>

            {/* Comparison Summary */}
            {comparison && (
              <ComparisonSummary comparison={comparison} />
            )}

            {/* Metrics Comparison Chart */}
            <MetricsBarChart 
              metrics1={metrics1} 
              metrics2={metrics2}
              title="Performance Metrics Comparison (Improved Scoring)"
            />

            {/* Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SuggestionCards 
                suggestions={suggestions1} 
                title="Suggestions for Post A" 
              />
              <SuggestionCards 
                suggestions={suggestions2} 
                title="Suggestions for Post B" 
              />
            </div>

            {/* Scoring Information */}
            <Card>
              <CardHeader>
                <CardTitle>About the Improved Scoring System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Realistic Scoring:</strong> Scores above 70 are excellent, above 80 are exceptional. Most good posts score 40-60.</p>
                  <p><strong>Weighted Factors:</strong> Engagement triggers and storytelling have the highest impact on scores.</p>
                  <p><strong>Diminishing Returns:</strong> Adding more of the same factor (hashtags, emojis) has decreasing benefits.</p>
                  <p><strong>Follower Impact:</strong> Account size moderately affects reach but doesn't dominate the scoring.</p>
                  <p><strong>Industry Calibrated:</strong> Different industries have different baseline performance expectations.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
