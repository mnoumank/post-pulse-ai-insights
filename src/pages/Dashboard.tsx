import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Calendar, BarChart3, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  avgEngagement: number;
  thisMonthPosts: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    scheduledPosts: 0,
    avgEngagement: 0,
    thisMonthPosts: 0
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load posts stats
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Load scheduled posts count
      const { data: scheduled } = await supabase
        .from('scheduled_posts')
        .select('id')
        .eq('user_id', user?.id)
        .eq('status', 'scheduled');

      // Load analytics for engagement rate
      const { data: analytics } = await supabase
        .from('post_analytics')
        .select('engagement_rate')
        .eq('user_id', user?.id);

      const avgEngagement = analytics?.length > 0 
        ? analytics.reduce((sum, a) => sum + (a.engagement_rate || 0), 0) / analytics.length 
        : 0;

      if (error) throw error;

      setRecentPosts(posts || []);
      setStats({
        totalPosts: posts?.length || 0,
        scheduledPosts: scheduled?.length || 0,
        avgEngagement: Math.round(avgEngagement),
        thisMonthPosts: posts?.filter(post => {
          const postDate = new Date(post.created_at);
          const now = new Date();
          return postDate.getMonth() === now.getMonth() && 
                 postDate.getFullYear() === now.getFullYear();
        }).length || 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.email?.split('@')[0]}
            </h1>
            <p className="text-muted-foreground">
              Here's your LinkedIn content overview for today
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link to="/create">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Create New Post</h3>
                  <p className="text-sm text-muted-foreground">
                    Start writing your next LinkedIn post
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/comparison">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Compare Drafts</h3>
                  <p className="text-sm text-muted-foreground">
                    A/B test your post versions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/library">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Post Library</h3>
                  <p className="text-sm text-muted-foreground">
                    View all saved drafts
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisMonthPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Scheduled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.scheduledPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgEngagement}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="border-b pb-4 last:border-b-0">
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-foreground line-clamp-2">
                        {post.content.substring(0, 150)}...
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No posts yet. Create your first post to get started!</p>
                  <Link to="/create">
                    <Button className="mt-4">Create Post</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </PageTransition>
  );
}