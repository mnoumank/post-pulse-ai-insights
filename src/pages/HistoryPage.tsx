
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { usePostComparison } from '@/context/PostComparisonContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, BarChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
  const { savedComparisons } = usePostComparison();
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

  // Function to format the date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Function to truncate post content for display
  const truncatePost = (content: string, maxLength = 70) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Comparison History</h1>
              <p className="text-muted-foreground">
                View and analyze your saved post comparisons
              </p>
            </div>
            
            {savedComparisons.length === 0 ? (
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <BarChart className="mx-auto h-12 w-12 text-muted opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No comparisons saved yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start comparing posts and save your results to see them here.
                  </p>
                  <Button 
                    onClick={() => navigate('/compare')} 
                    className="mt-6"
                  >
                    Create New Comparison
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedComparisons.map((comparison) => (
                  <Card key={comparison.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Post Comparison</CardTitle>
                        <Badge className={comparison.winningPost === 1 ? 'bg-blue-500' : 'bg-teal-500'}>
                          Post {comparison.winningPost} Won
                        </Badge>
                      </div>
                      <CardDescription>{formatDate(comparison.date)}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-1">Post 1</div>
                          <p className="text-sm text-muted-foreground">
                            {truncatePost(comparison.post1)}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-sm font-medium mb-1">Post 2</div>
                          <p className="text-sm text-muted-foreground">
                            {truncatePost(comparison.post2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
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
