
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { AIPostMetrics } from '@/utils/aiAnalyzer';
import { toast } from '@/hooks/use-toast';

interface ComparisonSummaryProps {
  comparison: {
    winner: number;
    margin: number;
  } | null;
  metrics1: AIPostMetrics | null;
  metrics2: AIPostMetrics | null;
  onSave: () => Promise<void>;
  isSaving?: boolean;
}

export function ComparisonSummary({ 
  comparison, 
  metrics1, 
  metrics2, 
  onSave,
  isSaving = false
}: ComparisonSummaryProps) {
  
  // If no comparison available yet, show waiting state
  if (!comparison || !metrics1 || !metrics2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparison Summary</CardTitle>
          <CardDescription>Enter content in both posts to see results</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">Waiting for content to analyze...</p>
        </CardContent>
      </Card>
    );
  }

  // Get the winner metrics
  const winnerMetrics = comparison.winner === 1 ? metrics1 : metrics2;
  const loserMetrics = comparison.winner === 1 ? metrics2 : metrics1;

  // Calculate which aspects make the winner better
  const strengths = [];

  if (winnerMetrics.engagementScore > loserMetrics.engagementScore) {
    strengths.push('higher engagement potential');
  }

  if (winnerMetrics.reachScore > loserMetrics.reachScore) {
    strengths.push('better reach');
  }

  if (winnerMetrics.viralityScore > loserMetrics.viralityScore) {
    strengths.push('stronger virality');
  }

  if (winnerMetrics.likes > loserMetrics.likes) {
    strengths.push('more likes');
  }

  if (winnerMetrics.comments > loserMetrics.comments) {
    strengths.push('more comments');
  }

  if (winnerMetrics.shares > loserMetrics.shares) {
    strengths.push('more shares');
  }

  // Format the strengths list
  let strengthsText = '';
  if (strengths.length === 1) {
    strengthsText = strengths[0];
  } else if (strengths.length === 2) {
    strengthsText = `${strengths[0]} and ${strengths[1]}`;
  } else if (strengths.length > 2) {
    const lastStrength = strengths.pop();
    strengthsText = `${strengths.join(', ')}, and ${lastStrength}`;
  }
  
  const handleSave = async () => {
    try {
      await onSave();
      toast({
        title: "Comparison Saved",
        description: "Your post comparison has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your comparison",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Summary</CardTitle>
        <CardDescription>
          Analysis based on LinkedIn post engagement patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {comparison.winner === 0 ? "Posts are performing similarly" : `Post ${comparison.winner} is predicted to perform better`}
          </h3>
          {comparison.winner > 0 && (
            <p className="text-muted-foreground">
              Expected to outperform by approximately {Math.round(comparison.margin)}%{strengthsText ? `, with ${strengthsText}` : ''}.
            </p>
          )}
          {comparison.winner === 0 && (
            <p className="text-muted-foreground">
              Both posts have very similar performance potential.
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={handleSave} 
            className="w-full max-w-xs"
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Comparison'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
