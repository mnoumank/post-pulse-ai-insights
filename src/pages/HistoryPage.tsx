import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageTransition } from '@/components/PageTransition';
import { BarChart3, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import { getUserComparisons } from '@/utils/auth/comparisons';
import RealityCheckDialog from '@/components/RealityCheckDialog';
import { getComparisonActuals } from '@/utils/auth/comparisonActuals';

interface HistoryItem {
  id: string;
  date: string;
  post1: string;
  post2: string;
  winnerId: string | null;
  winningPost: number;
  metrics: any;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpenFor, setDialogOpenFor] = useState<string | null>(null);
  const [hasActuals, setHasActuals] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserComparisons();
        setItems(data as HistoryItem[]);
        // Optionally probe for existing actuals (shallow, sequential to keep it simple)
        const presence: Record<string, boolean> = {};
        for (const comp of data) {
          const actual = await getComparisonActuals(comp.id).catch(() => null);
          presence[comp.id] = !!actual;
        }
        setHasActuals(presence);
      } catch (e) {
        console.error('Failed to load history:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSavedActuals = (comparisonId: string) => {
    setHasActuals(prev => ({ ...prev, [comparisonId]: true }));
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
            <p className="text-muted-foreground mt-2">
              Review your past post comparisons and add real-world results
            </p>
          </div>

          <div className="space-y-6">
            {loading && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">Loading comparisons...</CardTitle>
                  <CardDescription>
                    Fetching your saved comparisons.
                  </CardDescription>
                </CardContent>
              </Card>
            )}

            {!loading && items.map((comparison) => (
              <Card key={comparison.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(comparison.date).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasActuals[comparison.id] && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Reality check added
                        </Badge>
                      )}
                      <Badge variant={comparison.winningPost === 1 ? 'secondary' : comparison.winningPost === 2 ? 'default' : 'outline'}>
                        Winner: {comparison.winningPost === 0 ? 'Tie' : `Post ${comparison.winningPost === 1 ? 'A' : 'B'}`}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Post Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Post A</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {comparison.post1}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Post B</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {comparison.post2}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Predicted winner: <strong>{comparison.winningPost === 0 ? 'Tie' : `Post ${comparison.winningPost === 1 ? 'A' : 'B'}`}</strong>
                      </span>
                    </div>
                    <button
                      className="text-sm px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90"
                      onClick={() => setDialogOpenFor(comparison.id)}
                    >
                      Add Reality Check
                    </button>
                  </div>
                </CardContent>

                <RealityCheckDialog
                  open={dialogOpenFor === comparison.id}
                  onOpenChange={(open) => setDialogOpenFor(open ? comparison.id : null)}
                  comparisonId={comparison.id}
                  onSaved={() => onSavedActuals(comparison.id)}
                />
              </Card>
            ))}

            {!loading && items.length === 0 && (
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
