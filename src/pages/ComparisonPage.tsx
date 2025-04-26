import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PostEditor } from '@/components/PostEditor';
import { EngagementChart } from '@/components/EngagementChart';
import { SuggestionCards } from '@/components/SuggestionCards';
import { MetricsBarChart } from '@/components/MetricsBarChart';
import { ComparisonSummary } from '@/components/ComparisonSummary';
import { usePostComparison } from '@/context/PostComparisonContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { db } from '@/integrations/firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function ComparisonPage() {
  const { 
    post1, post2, setPost1, setPost2, 
    metrics1, metrics2, 
    timeSeries1, timeSeries2,
    suggestions1, suggestions2,
    comparison,
    saveComparison, 
    isLoading,
    isAIEnabled,
    toggleAIAnalysis
  } = usePostComparison();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const saveToHistory = async () => {
    if (!user) return;
    try {
      const userHistoryRef = doc(db, 'history', user.uid);
      await setDoc(userHistoryRef, {
        post1,
        post2,
        metrics1,
        metrics2,
        comparison,
        createdAt: new Date().toISOString()
      });
      console.log('Comparison saved successfully.');
    } catch (error) {
      console.error('Error saving comparison:', error);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const userHistoryRef = doc(db, 'history', user.uid);
      const docSnap = await getDoc(userHistoryRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPost1(data.post1);
        setPost2(data.post2);
        console.log('History fetched.');
      } else {
        console.log('No previous history found.');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    } else {
      fetchHistory();
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compare LinkedIn Posts</h1>
            <p className="text-muted-foreground mt-2">
              Write two versions of your post to see which one is predicted to perform better
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="ai-mode" 
                checked={isAIEnabled}
                onCheckedChange={toggleAIAnalysis}
              />
              <Label htmlFor="ai-mode" className="flex items-center cursor-pointer">
                <Sparkles className="h-4 w-4 mr-1 text-blue-500" />
                AI Analysis
              </Label>
            </div>
          </div>
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
              onSave={saveToHistory} 
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
