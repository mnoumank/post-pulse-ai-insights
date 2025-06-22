
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { PostEditor } from '@/components/PostEditor';
import { PerformanceLineChart } from '@/components/PerformanceLineChart';
import { SuggestionCards } from '@/components/SuggestionCards';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { AdvancedAnalysisPanel } from '@/components/AdvancedAnalysisPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostComparisonProvider, usePostComparison } from '@/context/PostComparisonContext';

function ComparisonPageContent() {
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
  const [lastAnalyzedA, setLastAnalyzedA] = useState('');
  const [lastAnalyzedB, setLastAnalyzedB] = useState('');

  // Auto-analyze when content changes - this ensures real-time updates
  useEffect(() => {
    const shouldAnalyze = postA.trim() && 
                         postB.trim() && 
                         (postA !== lastAnalyzedA || postB !== lastAnalyzedB) &&
                         !isAnalyzing;

    if (shouldAnalyze) {
      console.log('Auto-analyzing posts - improved scoring system active');
      setLastAnalyzedA(postA);
      setLastAnalyzedB(postB);
      analyzePost(postA, postB);
    }
  }, [postA, postB, analyzePost, lastAnalyzedA, lastAnalyzedB, isAnalyzing]);

  // Debug logging to verify scoring system
  useEffect(() => {
    if (analysisA && analysisB) {
      console.log('=== SCORING SYSTEM VERIFICATION ===');
      console.log('Post A Metrics:', {
        engagement: analysisA.engagementScore,
        reach: analysisA.reachScore,
        virality: analysisA.viralityScore,
        isRealistic: analysisA.engagementScore <= 70 // Most posts should be under 70
      });
      console.log('Post B Metrics:', {
        engagement: analysisB.engagementScore,
        reach: analysisB.reachScore,
        virality: analysisB.viralityScore,
        isRealistic: analysisB.engagementScore <= 70
      });
      console.log('Comparison result:', comparison);
      console.log('=== END VERIFICATION ===');
    }
  }, [analysisA, analysisB, comparison]);

  // Extract simple comparison data for ComparisonSummary
  const simpleComparison = comparison ? {
    winner: comparison.winner,
    margin: comparison.margin
  } : null;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 container py-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Compare LinkedIn Posts</h1>
            <p className="text-muted-foreground mt-2">
              Real-time post comparison with improved realistic scoring
            </p>
            {/* Scoring system status indicator */}
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ✓ Improved Scoring System Active
              </Badge>
              <Badge variant="outline" className="text-xs">
                Realistic scores: 40-60 good, 60-80 excellent, 80+ exceptional
              </Badge>
            </div>
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
              <Card className="w-full">
                <CardContent className="text-center py-8">
                  <div className="animate-pulse">
                    <div className="h-2 bg-muted rounded w-1/3 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing with improved realistic scoring...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section - Real-time updates */}
            {analysisA && analysisB && !isAnalyzing && (
              <div className="space-y-6">
                {/* Comparison Summary */}
                {simpleComparison && (
                  <ComparisonSummary 
                    comparison={simpleComparison}
                    metrics1={analysisA}
                    metrics2={analysisB}
                    onSave={async () => {}}
                  />
                )}

                {/* Dynamic Performance Line Chart - replaces bar chart */}
                <PerformanceLineChart 
                  metrics1={analysisA} 
                  metrics2={analysisB}
                  title="Real-time Performance Comparison"
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

                {/* Scoring System Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Improved Scoring System Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p><strong>✓ Realistic Baseline:</strong> Base scores start low (15-25) instead of inflated values</p>
                      <p><strong>✓ Weighted Scoring:</strong> Engagement triggers and storytelling have highest impact</p>
                      <p><strong>✓ Diminishing Returns:</strong> Multiple hashtags/emojis have decreasing benefits</p>
                      <p><strong>✓ Industry Calibration:</strong> Different industries have realistic performance expectations</p>
                      <p><strong>✓ Length Optimization:</strong> 150-800 characters is the sweet spot</p>
                      <p><strong>✓ Real-time Updates:</strong> Scores update instantly as you type</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Empty State */}
            {!analysisA && !analysisB && !isAnalyzing && (
              <Card className="w-full">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-2">Ready to Compare</p>
                  <p className="text-sm text-muted-foreground">Enter content in both posts to see real-time analysis</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

export default function ComparisonPage() {
  return (
    <PostComparisonProvider>
      <ComparisonPageContent />
    </PostComparisonProvider>
  );
}
