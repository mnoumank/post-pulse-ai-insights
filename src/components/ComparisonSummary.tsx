
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Share2 } from 'lucide-react';
import { PostMetrics } from '@/utils/postAnalyzer';

interface ComparisonSummaryProps {
  comparison: {
    winner: number;
    margin: number;
  } | null;
  metrics1: PostMetrics | null;
  metrics2: PostMetrics | null;
  onSave: () => void;
}

export function ComparisonSummary({ comparison, metrics1, metrics2, onSave }: ComparisonSummaryProps) {
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
            Post {comparison.winner} is predicted to perform better
          </h3>
          <p className="text-muted-foreground">
            Expected to outperform by approximately {Math.round(comparison.margin)}%, with {strengthsText}.
          </p>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button onClick={onSave} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Save Comparison
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
