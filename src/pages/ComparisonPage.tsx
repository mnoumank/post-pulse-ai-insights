
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { PostEditor } from '@/components/PostEditor';
import { PerformanceLineChart } from '@/components/PerformanceLineChart';
import { SuggestionCards } from '@/components/SuggestionCards';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { AdvancedAnalysisPanel } from '@/components/AdvancedAnalysisPanel';
import { Card, CardContent } from '@/components/ui/card';
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
    isAnalyzing,
    saveComparison
  } = usePostComparison();
  
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);
  const [lastAnalyzedA, setLastAnalyzedA] = useState('');
  const [lastAnalyzedB, setLastAnalyzedB] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    if (!analysisA || !analysisB) return;
    setIsSaving(true);
    try {
      await saveComparison(postA, postB, analysisA, analysisB);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 container py-4 px-4 max-w-7xl mx-auto sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Compare LinkedIn Posts</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Real-time post comparison with AI-powered insights
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                    <p className="text-muted-foreground">Analyzing with AI-powered insights...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            {analysisA && analysisB && !isAnalyzing && (
              <div className="space-y-4 sm:space-y-6">
                {/* Performance Line Chart */}
                <PerformanceLineChart 
                  metrics1={analysisA} 
                  metrics2={analysisB}
                  title="Real-time Performance Comparison"
                />

                {/* Comparison Summary below the chart */}
                {simpleComparison && (
                  <ComparisonSummary 
                    comparison={simpleComparison}
                    metrics1={analysisA}
                    metrics2={analysisB}
                    onSave={handleSave}
                    isSaving={isSaving}
                  />
                )}

                {/* Suggestions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <SuggestionCards 
                    suggestions={suggestions1} 
                    title="Suggestions for Post A" 
                  />
                  <SuggestionCards 
                    suggestions={suggestions2} 
                    title="Suggestions for Post B" 
                  />
                </div>
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

