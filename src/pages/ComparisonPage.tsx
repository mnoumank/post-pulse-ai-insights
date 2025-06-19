
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { PostEditor } from '@/components/PostEditor';
import { MetricsBarChart } from '@/components/MetricsBarChart';
import { SuggestionCards } from '@/components/SuggestionCards';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { AdvancedAnalysisPanel } from '@/components/AdvancedAnalysisPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePostComparison } from '@/context/PostComparisonContext';

export default function ComparisonPage() {
  const { 
    postA, 
    postB, 
    setPostA, 
    setPostB, 
    analysisA, 
    analysisB, 
    suggestions1, 
    suggestions2, 
    comparison, 
    advancedParams, 
    updateAdvancedParams,
    analyzePost,
    isAnalyzing
  } = usePostComparison();
  
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

  // Auto-analyze posts when content changes
  useEffect(() => {
    if (postA.trim() && postB.trim()) {
      console.log('Auto-analyzing posts:', { postA: postA.substring(0, 50), postB: postB.substring(0, 50) });
      analyzePost(postA, postB);
    }
  }, [postA, postB, advancedParams, analyzePost]);

  // Log current state for debugging
  useEffect(() => {
    console.log('ComparisonPage state:', { 
      hasPostA: !!postA, 
      hasPostB: !!postB, 
      hasAnalysisA: !!analysisA, 
      hasAnalysisB: !!analysisB,
      hasComparison: !!comparison,
      isAnalyzing
    });
  }, [postA, postB, analysisA, analysisB, comparison, isAnalyzing]);

  // Extract simple comparison data for ComparisonSummary
  const simpleComparison = comparison ? {
    winner: comparison.winner,
    margin: comparison.margin
  } : null;

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
              onAnalyze={() => {
                if (postA.trim() && postB.trim()) {
                  analyzePost(postA, postB);
                }
              }}
              isVisible={isAdvancedVisible}
              onToggle={() => setIsAdvancedVisible(!isAdvancedVisible)}
            />

            {/* Post Editors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PostEditor
                postNumber={1}
                content={postA}
                onChange={setPostA}
                metrics={analysisA}
                isWinner={comparison?.winner === 1}
              />
              <PostEditor
                postNumber={2}
                content={postB}
                onChange={setPostB}
                metrics={analysisB}
                isWinner={comparison?.winner === 2}
              />
            </div>

            {/* Loading State */}
            {isAnalyzing && (
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-muted-foreground">Analyzing posts...</p>
                </CardContent>
              </Card>
            )}

            {/* Comparison Summary */}
            {simpleComparison && analysisA && analysisB && (
              <ComparisonSummary 
                comparison={simpleComparison}
                metrics1={analysisA}
                metrics2={analysisB}
                onSave={async () => {}}
              />
            )}

            {/* Metrics Comparison Chart */}
            <MetricsBarChart 
              metrics1={analysisA} 
              metrics2={analysisB}
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
