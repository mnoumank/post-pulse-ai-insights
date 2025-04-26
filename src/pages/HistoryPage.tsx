import React, { useEffect, useState } from 'react'; //// added useState
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ChevronRight, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/integrations/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore'; //// import firestore methods

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedComparisons, setSavedComparisons] = useState<any[]>([]); //// added local state
  const [isLoading, setIsLoading] = useState(true); //// added local loading state

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (user) {
        setIsLoading(true); //// set loading true
        try {
          const historyRef = doc(db, 'history', user.uid); //// point to history/{userId}
          const historySnap = await getDoc(historyRef);

          if (historySnap.exists()) {
            const data = historySnap.data();
            if (Array.isArray(data.savedComparisons)) { //// assume array inside
              setSavedComparisons(data.savedComparisons);
            } else {
              setSavedComparisons([]);
            }
          } else {
            setSavedComparisons([]);
          }
        } catch (error) {
          console.error('Error fetching comparisons:', error);
          setSavedComparisons([]);
        } finally {
          setIsLoading(false); //// loading finished
        }
      }
    };

    fetchComparisons();
  }, [user]);

  const truncatePost = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const viewComparisonDetails = (comparison: any) => { //// updated to accept whole comparison object
    navigate('/compare', { state: { comparison } }); //// pass comparison via navigation state
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Comparison History</h1>
          <p className="text-muted-foreground mt-2">
            View and analyze your past LinkedIn post comparisons
          </p>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : savedComparisons.length === 0 ? (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-medium mb-2">No comparisons yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't saved any LinkedIn post comparisons yet.
              </p>
              <Button onClick={() => navigate('/compare')}>
                Create your first comparison
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedComparisons.map((comparison, idx) => ( //// added idx fallback for key
              <Card 
                key={comparison.id || idx}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => viewComparisonDetails(comparison)} //// pass full comparison object
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Comparison from {format(new Date(comparison.date), 'MMM d, yyyy')}
                    </CardTitle>
                    {comparison.winningPost > 0 && (
                      <div className="flex items-center text-sm text-amber-500 font-medium">
                        <Star className="h-4 w-4 mr-1 fill-amber-500" />
                        Post {comparison.winningPost} won
                      </div>
                    )}
                  </div>
                  <CardDescription className="flex items-center text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(comparison.date), 'h:mm a')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`bg-muted/30 p-4 rounded-md ${comparison.winningPost === 1 ? 'border-l-4 border-green-500' : ''}`}>
                      <h4 className="text-sm font-medium mb-1">Post 1</h4>
                      <p className="text-sm text-muted-foreground">
                        {truncatePost(comparison.post1)}
                      </p>
                    </div>
                    <div className={`bg-muted/30 p-4 rounded-md ${comparison.winningPost === 2 ? 'border-l-4 border-green-500' : ''}`}>
                      <h4 className="text-sm font-medium mb-1">Post 2</h4>
                      <p className="text-sm text-muted-foreground">
                        {truncatePost(comparison.post2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
