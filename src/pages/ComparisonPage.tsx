
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
import { AIPostMetrics } from '@/utils/aiAnalyzer';

export default function ComparisonPage() {
  const { postA, postB, setPostA, setPostB, analysisA, analysisB, suggestions1, suggestions2, comparison, advancedParams, updateAdvancedParams } = usePostComparison();
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

  // Convert PostMetrics to AIPostMetrics for compatibility
  const convertToAIMetrics = (metrics: any): AIPostMetrics | null => {
    if (!metrics) return null;
    return {
      ...metrics,
      recommendedHashtags: metrics.recommendedHashtags || [],
      isAIEnhanced: metrics.isAIEnhanced || false,
    };
  };

  const aiMetrics1 = convertToAIMetrics(analysisA);
  const aiMetrics2 = convertToAIMetrics(analysisB);

  // Generate comparison using improved analyzer if we have both posts
  const localComparison = postA && postB ? comparePostsPerformance(postA, postB, advancedParams) : null;

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
              onChange={updateAdvancedParams}
              onAnalyze={() => {}}
              isVisible={isAdvancedVisible}
              onToggle={() => setIsAdvancedVisible(!isAdvancedVisible)}
            />

            {/* Post Editors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PostEditor
                postNumber={1}
                content={postA}
                onChange={setPostA}
                metrics={aiMetrics1}
                isWinner={localComparison?.winner === 1}
              />
              <PostEditor
                postNumber={2}
                content={postB}
                onChange={setPostB}
                metrics={aiMetrics2}
                isWinner={localComparison?.winner === 2}
              />
            </div>

            {/* Comparison Summary */}
            {localComparison && (
              <ComparisonSummary 
                comparison={localComparison}
                metrics1={aiMetrics1}
                metrics2={aiMetrics2}
                onSave={async () => {}}
              />
            )}

            {/* Metrics Comparison Chart */}
            <MetricsBarChart 
              metrics1={aiMetrics1} 
              metrics2={aiMetrics2}
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
