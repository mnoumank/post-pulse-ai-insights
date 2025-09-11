import React from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share, Target, BarChart3 } from 'lucide-react';


const mockAnalyticsData = [
  { date: '2024-01-01', engagement: 15, reach: 1200, clicks: 45 },
  { date: '2024-01-02', engagement: 23, reach: 1800, clicks: 67 },
  { date: '2024-01-03', engagement: 31, reach: 2100, clicks: 89 },
  { date: '2024-01-04', engagement: 18, reach: 1500, clicks: 52 },
  { date: '2024-01-05', engagement: 42, reach: 2800, clicks: 124 },
  { date: '2024-01-06', engagement: 28, reach: 2200, clicks: 78 },
  { date: '2024-01-07', engagement: 35, reach: 2400, clicks: 95 }
];

const industryBenchmarks = {
  engagement: 3.5,
  reach: 5200,
  clicks: 180
};

export function AnalyticsPage() {
  const currentStats = {
    engagement: 28.9,
    reach: 2100,
    clicks: 78,
    impressions: 15600
  };

  const calculateTrend = (current: number, benchmark: number) => {
    const diff = ((current - benchmark) / benchmark) * 100;
    return {
      percentage: Math.abs(diff).toFixed(1),
      isPositive: diff > 0
    };
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your LinkedIn performance and benchmark against industry standards
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Impressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStats.impressions.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+12.5%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Engagement Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStats.engagement}%</div>
                <div className="flex items-center gap-1 mt-1">
                  {calculateTrend(currentStats.engagement, industryBenchmarks.engagement).isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${calculateTrend(currentStats.engagement, industryBenchmarks.engagement).isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateTrend(currentStats.engagement, industryBenchmarks.engagement).percentage}% vs industry
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStats.reach.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1">
                  {calculateTrend(currentStats.reach, industryBenchmarks.reach).isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${calculateTrend(currentStats.reach, industryBenchmarks.reach).isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateTrend(currentStats.reach, industryBenchmarks.reach).percentage}% vs industry
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStats.clicks}</div>
                <div className="flex items-center gap-1 mt-1">
                  {calculateTrend(currentStats.clicks, industryBenchmarks.clicks).isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${calculateTrend(currentStats.clicks, industryBenchmarks.clicks).isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateTrend(currentStats.clicks, industryBenchmarks.clicks).percentage}% vs industry
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Performance chart will show your LinkedIn analytics trends</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Benchmarks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Engagement Rate</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={currentStats.engagement > industryBenchmarks.engagement ? "default" : "secondary"}>
                        {industryBenchmarks.engagement}% avg
                      </Badge>
                      <span className="text-sm font-bold">{currentStats.engagement}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Reach</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={currentStats.reach > industryBenchmarks.reach ? "default" : "secondary"}>
                        {industryBenchmarks.reach.toLocaleString()} avg
                      </Badge>
                      <span className="text-sm font-bold">{currentStats.reach.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Click Rate</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={currentStats.clicks > industryBenchmarks.clicks ? "default" : "secondary"}>
                        {industryBenchmarks.clicks} avg
                      </Badge>
                      <span className="text-sm font-bold">{currentStats.clicks}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm mb-2 line-clamp-2">
                      "Just shipped our biggest feature yet! Here's what I learned about leading a distributed team..."
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Jan 5</span>
                      <span>42 engagements</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm mb-2 line-clamp-2">
                      "The biggest mistake I made in my first startup (and how you can avoid it)"
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Jan 7</span>
                      <span>35 engagements</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm mb-2 line-clamp-2">
                      "Why I stopped chasing 'viral' content and focused on value instead"
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Jan 2</span>
                      <span>31 engagements</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}