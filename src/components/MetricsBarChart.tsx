
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { PostMetrics } from '@/utils/improvedPostAnalyzer';

interface MetricsBarChartProps {
  metrics1: PostMetrics | null;
  metrics2: PostMetrics | null;
  title?: string;
}

export function MetricsBarChart({ 
  metrics1, 
  metrics2, 
  title = "Key Metrics Comparison" 
}: MetricsBarChartProps) {
  // If no metrics, show placeholder
  if (!metrics1 && !metrics2) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center bg-muted/30">
          <p className="text-muted-foreground">Enter post content to see metrics comparison</p>
        </CardContent>
      </Card>
    );
  }

  // Create a common format for both posts' metrics
  const data = [
    {
      name: 'Likes',
      'Post 1': metrics1?.likes || 0,
      'Post 2': metrics2?.likes || 0,
    },
    {
      name: 'Comments',
      'Post 1': metrics1?.comments || 0,
      'Post 2': metrics2?.comments || 0,
    },
    {
      name: 'Shares',
      'Post 1': metrics1?.shares || 0,
      'Post 2': metrics2?.shares || 0,
    },
    {
      name: 'Engagement',
      'Post 1': metrics1?.engagementScore || 0,
      'Post 2': metrics2?.engagementScore || 0,
    },
    {
      name: 'Reach',
      'Post 1': metrics1?.reachScore || 0,
      'Post 2': metrics2?.reachScore || 0,
    },
    {
      name: 'Virality',
      'Post 1': metrics1?.viralityScore || 0,
      'Post 2': metrics2?.viralityScore || 0,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <Legend />
              <Bar dataKey="Post 1" fill="#0077B5" />
              <Bar dataKey="Post 2" fill="#5087A5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
