
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageTransition } from '@/components/PageTransition';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';

export default function HistoryPage() {
  // Mock data for demonstration
  const mockComparisons = [
    {
      id: 1,
      date: '2024-01-15',
      postA: 'Just finished a project...',
      postB: '🚀 Just shipped a game-changing project...',
      winnerScore: 8.7,
      winner: 'B'
    },
    {
      id: 2,
      date: '2024-01-10',
      postA: 'Thoughts on remote work...',
      postB: 'Remote work has transformed my productivity...',
      winnerScore: 7.2,
      winner: 'B'
    }
  ];

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
            <p className="text-muted-foreground mt-2">
              Review your past post comparisons and insights
            </p>
          </div>

          <div className="space-y-6">
            {mockComparisons.map((comparison) => (
              <Card key={comparison.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{comparison.date}</span>
                    </div>
                    <Badge variant={comparison.winner === 'A' ? 'secondary' : 'default'}>
                      Winner: Post {comparison.winner}
                    </Badge>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Post Comparison #{comparison.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Post A</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {comparison.postA}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Post B</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {comparison.postB}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Winning Score: <strong>{comparison.winnerScore}/10</strong>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {mockComparisons.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No comparisons yet</CardTitle>
                  <CardDescription>
                    Start analyzing your posts to see your comparison history here.
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
