
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PostEditor } from '@/components/PostEditor';
import { EngagementChart } from '@/components/EngagementChart';
import { SuggestionCards } from '@/components/SuggestionCards';
import { MetricsBarChart } from '@/components/MetricsBarChart';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { AdvancedAnalysisPanel } from '@/components/AdvancedAnalysisPanel';
import { usePostComparison } from '@/context/PostComparisonContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ComparisonPage() {
  const { 
    post1, post2, setPost1, setPost2, 
    metrics1, metrics2, 
    timeSeries1, timeSeries2,
    suggestions1, suggestions2,
    comparison,
    saveComparison,
    isLoading,
    advancedParams,
    updateAdvancedParams
  } = usePostComparison();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Add forceAnalyze function to trigger new analysis
  const handleForceAnalyze = () => {
    // This will force a new analysis with current parameters
    setPost1(post1);
    setPost2(post2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Compare LinkedIn Posts</h1>
          <p className="text-muted-foreground mt-2">
            Write two versions of your post to see which one is predicted to perform better
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <PostEditor 
              postNumber={1} 
              content={post1} 
              onChange={setPost1} 
              metrics={metrics1} 
              isWinner={comparison?.winner === 1}
            />
          </div>
          <div>
            <PostEditor 
              postNumber={2} 
              content={post2} 
              onChange={setPost2} 
              metrics={metrics2} 
              isWinner={comparison?.winner === 2}
            />
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <EngagementChart data1={timeSeries1} data2={timeSeries2} />
          </div>
          <div>
            <ComparisonSummary 
              comparison={comparison} 
              metrics1={metrics1} 
              metrics2={metrics2} 
              onSave={saveComparison}
              isSaving={isLoading}
            />
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div>
            <MetricsBarChart metrics1={metrics1} metrics2={metrics2} />
          </div>
          <div>
            <SuggestionCards suggestions={suggestions1} title="Post 1 Insights" />
          </div>
          <div>
            <SuggestionCards suggestions={suggestions2} title="Post 2 Insights" />
          </div>
        </div>
        
        <div className="mt-8">
          <AdvancedAnalysisPanel 
            params={advancedParams}
            onChange={updateAdvancedParams}
            onAnalyze={handleForceAnalyze}
            isVisible={showAdvancedOptions}
            onToggle={() => setShowAdvancedOptions(!showAdvancedOptions)}
          />
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
