
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PostEditor } from '@/components/PostEditor';
import { EngagementChart } from '@/components/EngagementChart';
import { MetricsBarChart } from '@/components/MetricsBarChart';
import { SuggestionCards } from '@/components/SuggestionCards';
import { AdvancedAnalysisPanel } from '@/components/AdvancedAnalysisPanel';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { usePostComparison } from '@/context/PostComparisonContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ComparisonPage() {
  const { 
    post1, 
    post2, 
    setPost1, 
    setPost2,
    metrics1,
    metrics2,
    timeSeries1,
    timeSeries2,
    suggestions1,
    suggestions2,
    comparison,
    isAdvancedMode,
    toggleAdvancedMode,
    advancedParams,
    updateAdvancedParams,
    saveComparison
  } = usePostComparison();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Post Comparison</h1>
                <p className="text-muted-foreground">
                  Compare two LinkedIn posts and see which one will perform better
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="advanced-mode" className="text-sm font-medium">
                  Advanced Mode
                </Label>
                <Switch
                  id="advanced-mode"
                  checked={isAdvancedMode}
                  onCheckedChange={toggleAdvancedMode}
                />
              </div>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main content area - takes up 2/3 of the screen on large displays */}
              <div className="lg:col-span-2 space-y-6">
                {/* Post editors */}
                <div className="grid gap-6 md:grid-cols-2">
                  <PostEditor
                    postNumber={1}
                    content={post1}
                    onChange={setPost1}
                    metrics={metrics1}
                    isWinner={comparison?.winner === 1}
                  />
                  <PostEditor
                    postNumber={2}
                    content={post2}
                    onChange={setPost2}
                    metrics={metrics2}
                    isWinner={comparison?.winner === 2}
                  />
                </div>
                
                {/* Charts */}
                <div className="space-y-6">
                  <EngagementChart 
                    data1={timeSeries1} 
                    data2={timeSeries2} 
                  />
                  <MetricsBarChart 
                    metrics1={metrics1} 
                    metrics2={metrics2} 
                  />
                </div>
                
                {/* Suggestions */}
                <div className="grid gap-6 md:grid-cols-2">
                  <SuggestionCards 
                    suggestions={suggestions1} 
                    title="Post 1 Improvement Suggestions" 
                  />
                  <SuggestionCards 
                    suggestions={suggestions2} 
                    title="Post 2 Improvement Suggestions" 
                  />
                </div>
              </div>
              
              {/* Sidebar - takes up 1/3 of the screen on large displays */}
              <div className="space-y-6">
                <ComparisonSummary 
                  comparison={comparison} 
                  metrics1={metrics1} 
                  metrics2={metrics2}
                  onSave={saveComparison}
                />
                
                {isAdvancedMode && (
                  <AdvancedAnalysisPanel 
                    params={advancedParams} 
                    onChange={updateAdvancedParams} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 PostPulse AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
