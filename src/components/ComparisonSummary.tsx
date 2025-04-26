import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { PostMetrics } from '@/utils/postAnalyzer';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { saveComparison } from '@/integrations/firebase/firebase'; //// keep only saveComparison import
//// import { firestore } from '@/integrations/firebase/firebase'; //// removed wrong firestore import

interface ComparisonSummaryProps {
  comparison: {
    winner: number;
    margin: number;
  } | null;
  metrics1: PostMetrics | null;
  metrics2: PostMetrics | null;
  onSave: () => Promise<void>;
  isSaving?: boolean;
}

export function ComparisonSummary({
  comparison,
  metrics1,
  metrics2,
  onSave,
  isSaving = false,
}: ComparisonSummaryProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const winnerMetrics = comparison.winner === 1 ? metrics1 : metrics2;
  const loserMetrics = comparison.winner === 1 ? metrics2 : metrics1;

  const metricLabels: [keyof PostMetrics, string][] = [
    ['engagementScore', 'higher engagement potential'],
    ['reachScore', 'better reach'],
    ['viralityScore', 'stronger virality'],
    ['likes', 'more likes'],
    ['comments', 'more comments'],
    ['shares', 'more shares'],
  ];

  const strengths: string[] = [];

  for (const [key, label] of metricLabels) {
    const winnerValue = winnerMetrics[key] ?? 0;
    const loserValue = loserMetrics[key] ?? 0;

    if (winnerValue > loserValue) {
      strengths.push(label);
    } else if (winnerValue === loserValue) {
      strengths.push(`equal ${label}`);
    }
  }

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
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save your comparison',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      const comparisonData = {
        winner: comparison.winner,
        margin: comparison.margin,
        strengths: strengthsText,
        metrics1,
        metrics2,
        createdAt: new Date().toISOString(), //// added createdAt timestamp
      };

      console.log('Saving comparison data:', comparisonData);

      //// call our fixed saveComparison function instead of Firestore here
      await saveComparison(user.uid, comparisonData); //// use correct saving method

      toast({
        title: 'Comparison saved',
        description: 'Your result has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving comparison:', error);
      toast({
        title: 'Save failed',
        description: 'Something went wrong. Try again.',
        variant: 'destructive',
      });
    }
  };

  const formattedMargin = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(comparison.margin);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Summary</CardTitle>
        <CardDescription>
          {comparison.winner === 1 ? 'Post 1' : 'Post 2'} won by {formattedMargin}%!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold">Key Insights</h3>
        <ul className="list-disc pl-5 mt-2">
          {strengthsText && <li>{strengthsText}</li>}
        </ul>
      </CardContent>
      <Button onClick={handleSave} className="w-full mt-4" disabled={isSaving}>
        {isSaving ? 'Saving...' : <><Save className="mr-2" /> Save Comparison</>}
      </Button>
    </Card>
  );
}
