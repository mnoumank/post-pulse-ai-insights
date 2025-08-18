
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, TrendingUp, Crown } from 'lucide-react';
import { PostMetrics } from '@/utils/improvedPostAnalyzer';

interface PerformanceLineChartProps {
  metrics1: PostMetrics | null;
  metrics2: PostMetrics | null;
  title?: string;
}

interface VisibilityState {
  post1Engagement: boolean;
  post1Reach: boolean;
  post1Virality: boolean;
  post2Engagement: boolean;
  post2Reach: boolean;
  post2Virality: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const winningPost = payload.reduce((winner: any, current: any) => 
      current.value > (winner?.value || 0) ? current : winner
    );

    return (
      <div className="bg-chart-tooltip border border-border rounded-lg shadow-lg p-3 animate-fade-in-scale">
        <p className="font-semibold text-foreground mb-2">{`Time: ${label}`}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-foreground">
                {entry.name}: <span className="font-medium">{entry.value}</span>
              </span>
              {entry === winningPost && (
                <Crown className="w-3 h-3 text-yellow-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomDot = ({ cx, cy, fill, payload, dataKey }: any) => {
  const isWinning = payload && Object.values(payload).some((value: any) => 
    typeof value === 'number' && value > 70
  );
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isWinning ? 5 : 4}
      fill={fill}
      className={isWinning ? "animate-pulse-dot" : ""}
      style={{
        filter: isWinning ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))' : 'none'
      }}
    />
  );
};

export function PerformanceLineChart({ 
  metrics1, 
  metrics2, 
  title = "Real-time Performance Comparison" 
}: PerformanceLineChartProps) {
  const [visibility, setVisibility] = useState<VisibilityState>({
    post1Engagement: true,
    post1Reach: true,
    post1Virality: true,
    post2Engagement: true,
    post2Reach: true,
    post2Virality: true,
  });

  const [highlightWinner, setHighlightWinner] = useState(false);

  // If no metrics, show placeholder
  if (!metrics1 && !metrics2) {
    return (
      <Card className="w-full bg-chart-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="text-center space-y-2">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Enter post content to see performance comparison</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create time-series data for the line chart
  const timePoints = ['0h', '2h', '6h', '12h', '18h', '24h'];
  
  const data = useMemo(() => timePoints.map((time, index) => {
    // Calculate cumulative engagement over time with realistic curves
    const timeMultiplier = index === 0 ? 0.1 : 
                          index === 1 ? 0.35 : 
                          index === 2 ? 0.75 : 
                          index === 3 ? 1.0 : 
                          index === 4 ? 0.85 : 0.65;

    const post1Engagement = metrics1 ? Math.round(metrics1.engagementScore * timeMultiplier) : 0;
    const post2Engagement = metrics2 ? Math.round(metrics2.engagementScore * timeMultiplier) : 0;
    const post1Reach = metrics1 ? Math.round(metrics1.reachScore * timeMultiplier * 0.9) : 0;
    const post2Reach = metrics2 ? Math.round(metrics2.reachScore * timeMultiplier * 0.9) : 0;
    const post1Virality = metrics1 ? Math.round(metrics1.viralityScore * timeMultiplier * 0.7) : 0;
    const post2Virality = metrics2 ? Math.round(metrics2.viralityScore * timeMultiplier * 0.7) : 0;

    return {
      time,
      'Post 1 Engagement': post1Engagement,
      'Post 2 Engagement': post2Engagement,
      'Post 1 Reach': post1Reach,
      'Post 2 Reach': post2Reach,
      'Post 1 Virality': post1Virality,
      'Post 2 Virality': post2Virality,
      // Helper for winner detection
      winner: Math.max(post1Engagement, post2Engagement, post1Reach, post2Reach, post1Virality, post2Virality)
    };
  }), [metrics1, metrics2]);

  const toggleVisibility = (key: keyof VisibilityState) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const legendData = [
    { key: 'post1Engagement', label: 'Post 1 Engagement', color: 'hsl(var(--chart-primary))', visible: visibility.post1Engagement },
    { key: 'post1Reach', label: 'Post 1 Reach', color: 'hsl(var(--chart-primary))', visible: visibility.post1Reach, opacity: 0.7 },
    { key: 'post1Virality', label: 'Post 1 Virality', color: 'hsl(var(--chart-primary))', visible: visibility.post1Virality, opacity: 0.5 },
    { key: 'post2Engagement', label: 'Post 2 Engagement', color: 'hsl(var(--chart-secondary))', visible: visibility.post2Engagement },
    { key: 'post2Reach', label: 'Post 2 Reach', color: 'hsl(var(--chart-secondary))', visible: visibility.post2Reach, opacity: 0.7 },
    { key: 'post2Virality', label: 'Post 2 Virality', color: 'hsl(var(--chart-secondary))', visible: visibility.post2Virality, opacity: 0.5 },
  ];

  return (
    <Card className="w-full bg-chart-background border-chart-grid">
      <CardHeader className="pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Dynamic performance tracking - updates as you type
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHighlightWinner(!highlightWinner)}
              className={highlightWinner ? "bg-primary text-primary-foreground" : ""}
            >
              <Crown className="w-4 h-4 mr-1" />
              Highlight Winner
            </Button>
          </div>
        </div>
        
        {/* Interactive Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {legendData.map((item) => (
            <Button
              key={item.key}
              variant="outline"
              size="sm"
              onClick={() => toggleVisibility(item.key as keyof VisibilityState)}
              className={`h-7 px-2 text-xs transition-all ${
                item.visible 
                  ? "bg-background text-foreground border-border" 
                  : "bg-muted text-muted-foreground border-muted"
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ 
                  backgroundColor: item.visible ? item.color : 'transparent',
                  opacity: item.opacity || 1,
                  border: !item.visible ? `2px solid ${item.color}` : 'none'
                }}
              />
              {item.visible ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              {item.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6">
        <div className="h-[280px] sm:h-[380px] bg-chart-background rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 15, left: 15, bottom: 10 }}
            >
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-primary))" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="hsl(var(--chart-primary))" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-secondary))" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="hsl(var(--chart-secondary))" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--chart-grid))" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                tick={{ fontSize: 11 }}
                interval={0}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
                width={35}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Post 1 Lines */}
              {visibility.post1Engagement && (
                <Line
                  type="monotone"
                  dataKey="Post 1 Engagement"
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  activeDot={{ r: 7, stroke: 'hsl(var(--chart-hover))', strokeWidth: 2, fill: 'hsl(var(--chart-primary))' }}
                  className="animate-draw-line"
                />
              )}
              {visibility.post1Reach && (
                <Line
                  type="monotone"
                  dataKey="Post 1 Reach"
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={2}
                  strokeOpacity={0.7}
                  strokeDasharray="5 5"
                  dot={<CustomDot />}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibility.post1Virality && (
                <Line
                  type="monotone"
                  dataKey="Post 1 Virality"
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  strokeDasharray="2 2"
                  dot={<CustomDot />}
                  activeDot={{ r: 5 }}
                />
              )}
              
              {/* Post 2 Lines */}
              {visibility.post2Engagement && (
                <Line
                  type="monotone"
                  dataKey="Post 2 Engagement"
                  stroke="hsl(var(--chart-secondary))"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  activeDot={{ r: 7, stroke: 'hsl(var(--chart-secondary))', strokeWidth: 2, fill: 'hsl(var(--chart-secondary))' }}
                  className="animate-draw-line"
                />
              )}
              {visibility.post2Reach && (
                <Line
                  type="monotone"
                  dataKey="Post 2 Reach"
                  stroke="hsl(var(--chart-secondary))"
                  strokeWidth={2}
                  strokeOpacity={0.7}
                  strokeDasharray="5 5"
                  dot={<CustomDot />}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibility.post2Virality && (
                <Line
                  type="monotone"
                  dataKey="Post 2 Virality"
                  stroke="hsl(var(--chart-secondary))"
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  strokeDasharray="2 2"
                  dot={<CustomDot />}
                  activeDot={{ r: 5 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Performance Summary */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics1 && (
            <div className="bg-chart-tooltip border border-chart-grid rounded-lg p-3">
              <h4 className="font-medium text-foreground mb-2">Post 1 Performance</h4>
              <div className="flex gap-2">
                <Badge variant="secondary">Engagement: {metrics1.engagementScore}</Badge>
                <Badge variant="outline">Reach: {metrics1.reachScore}</Badge>
                <Badge variant="outline">Virality: {metrics1.viralityScore}</Badge>
              </div>
            </div>
          )}
          {metrics2 && (
            <div className="bg-chart-tooltip border border-chart-grid rounded-lg p-3">
              <h4 className="font-medium text-foreground mb-2">Post 2 Performance</h4>
              <div className="flex gap-2">
                <Badge variant="secondary">Engagement: {metrics2.engagementScore}</Badge>
                <Badge variant="outline">Reach: {metrics2.reachScore}</Badge>
                <Badge variant="outline">Virality: {metrics2.viralityScore}</Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
