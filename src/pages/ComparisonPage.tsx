
import React from 'react';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PostEditor } from '@/components/PostEditor';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { EngagementChart } from '@/components/EngagementChart';
import { SuggestionCards } from '@/components/SuggestionCards';
import { AdvancedAnalysisPanel } from '@/components/AdvancedAnalysisPanel';
import { usePostComparison } from '@/context/PostComparisonContext';
import { PageTransition } from '@/components/PageTransition';

export default function ComparisonPage() {
  const { 
    postA, 
    postB, 
    setPostA, 
    setPostB, 
    analysisA, 
    analysisB, 
    timeSeries1,
    timeSeries2,
    suggestions1,
    suggestions2,
    comparison,
    isAnalyzing, 
    analyzePost,
    saveComparison,
    isAdvancedMode,
    toggleAdvancedMode,
    advancedParams,
    updateAdvancedParams
  } = usePostComparison();

  const [activeTab, setActiveTab] = useState<'editor' | 'analysis'>('editor');

  const handleAnalyze = async () => {
    if (postA.trim() && postB.trim()) {
      await analyzePost(postA, postB);
      setActiveTab('analysis');
    }
  };

  const handleSave = async () => {
    if (analysisA && analysisB) {
      await saveComparison(postA, postB, analysisA, analysisB);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Compare LinkedIn Posts</h1>
            <p className="text-muted-foreground mt-2">
              Compare two versions of your post to see which performs better
            </p>
          </div>

          <div className="space-y-8">
            {/* Post Editors */}
            <div className="grid lg:grid-cols-2 gap-6">
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

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAnalyze}
                disabled={!postA.trim() || !postB.trim() || isAnalyzing}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Posts'}
              </button>
              
              {analysisA && analysisB && (
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                >
                  Save Comparison
                </button>
              )}
            </div>

            {/* Analysis Results */}
            {(analysisA && analysisB) && (
              <div className="space-y-8">
                <ComparisonSummary 
                  comparison={comparison}
                  metrics1={analysisA}
                  metrics2={analysisB}
                  onSave={handleSave}
                  isSaving={false}
                />
                <EngagementChart 
                  data1={timeSeries1}
                  data2={timeSeries2}
                />
                <div className="grid lg:grid-cols-2 gap-6">
                  <SuggestionCards 
                    suggestions={suggestions1}
                    title="Post 1 Suggestions"
                  />
                  <SuggestionCards 
                    suggestions={suggestions2}
                    title="Post 2 Suggestions"
                  />
                </div>
                <AdvancedAnalysisPanel 
                  params={advancedParams}
                  onChange={updateAdvancedParams}
                  onAnalyze={handleAnalyze}
                  isVisible={isAdvancedMode}
                  onToggle={toggleAdvancedMode}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
