
import React from 'react';
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
import { PostMetrics } from '@/utils/improvedPostAnalyzer';

interface PerformanceLineChartProps {
  metrics1: PostMetrics | null;
  metrics2: PostMetrics | null;
  title?: string;
}

export function PerformanceLineChart({ 
  metrics1, 
  metrics2, 
  title = "Performance Metrics Over Time" 
}: PerformanceLineChartProps) {
  // If no metrics, show placeholder
  if (!metrics1 && !metrics2) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center bg-muted/30">
          <p className="text-muted-foreground">Enter post content to see performance comparison</p>
        </CardContent>
      </Card>
    );
  }

  // Create time-series data for the line chart
  const timePoints = ['0h', '2h', '6h', '12h', '18h', '24h'];
  
  const data = timePoints.map((time, index) => {
    // Calculate cumulative engagement over time with realistic curves
    const timeMultiplier = index === 0 ? 0.1 : 
                          index === 1 ? 0.3 : 
                          index === 2 ? 0.7 : 
                          index === 3 ? 1.0 : 
                          index === 4 ? 0.8 : 0.6;

    return {
      time,
      'Post 1 Engagement': metrics1 ? Math.round(metrics1.engagementScore * timeMultiplier) : 0,
      'Post 2 Engagement': metrics2 ? Math.round(metrics2.engagementScore * timeMultiplier) : 0,
      'Post 1 Reach': metrics1 ? Math.round(metrics1.reachScore * timeMultiplier * 0.9) : 0,
      'Post 2 Reach': metrics2 ? Math.round(metrics2.reachScore * timeMultiplier * 0.9) : 0,
      'Post 1 Virality': metrics1 ? Math.round(metrics1.viralityScore * timeMultiplier * 0.7) : 0,
      'Post 2 Virality': metrics2 ? Math.round(metrics2.viralityScore * timeMultiplier * 0.7) : 0,
    };
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Dynamic performance tracking - updates as you type
        </p>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="h-[280px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="time" 
                stroke="#888" 
                fontSize={11}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis 
                stroke="#888" 
                fontSize={10}
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                iconSize={12}
              />
              
              {/* Post 1 Lines */}
              <Line
                type="monotone"
                dataKey="Post 1 Engagement"
                stroke="#0077B5"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: '#0077B5', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="Post 1 Reach"
                stroke="#4A90B8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Post 1 Virality"
                stroke="#7DAAC2"
                strokeWidth={2}
                strokeDasharray="2 2"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              
              {/* Post 2 Lines */}
              <Line
                type="monotone"
                dataKey="Post 2 Engagement"
                stroke="#E74C3C"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: '#E74C3C', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="Post 2 Reach"
                stroke="#F39C12"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Post 2 Virality"
                stroke="#F7DC6F"
                strokeWidth={2}
                strokeDasharray="2 2"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
