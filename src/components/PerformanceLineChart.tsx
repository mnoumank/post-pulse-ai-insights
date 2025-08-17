import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
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
  title = "Real-time Performance Comparison" 
}: PerformanceLineChartProps) {

  // If no metrics, show placeholder
  if (!metrics1 && !metrics2) {
    return (
      <Card className="w-full bg-white border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-gray-500">Enter post content to see performance comparison</p>
        </CardContent>
      </Card>
    );
  }

  // Create time-series data for the line chart
  const timePoints = [0, 2, 6, 12, 18, 24];
  
  const data = timePoints.map((time) => {
    // Calculate cumulative engagement over time with realistic curves
    const timeMultiplier = time === 0 ? 0.1 : 
                          time === 2 ? 0.3 : 
                          time === 6 ? 0.7 : 
                          time === 12 ? 1.0 : 
                          time === 18 ? 0.8 : 0.6;

    const post1Score = metrics1 ? Math.round(metrics1.engagementScore * timeMultiplier) : 0;
    const post2Score = metrics2 ? Math.round(metrics2.engagementScore * timeMultiplier) : 0;

    return {
      time: `${time}h`,
      'Post A': post1Score,
      'Post B': post2Score,
    };
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-3">
          <p className="font-medium text-gray-900 mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">
                {entry.name}: <span className="font-semibold">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom dot component
  const CustomDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={props.stroke}
        stroke={props.stroke}
        strokeWidth={2}
      />
    );
  };

  // Custom legend component
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex items-center justify-end gap-6 mb-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-0.5"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Engagement Score Over Time
        </p>
      </CardHeader>
      
      <CardContent>
        <CustomLegend payload={[
          { value: 'Post A', color: '#0A66C2' },
          { value: 'Post B', color: '#6E6E6E' }
        ]} />
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="0" 
                stroke="#E0E0E0" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                stroke="#333333" 
                fontSize={12}
                tick={{ fontSize: 12, fill: '#333333' }}
                axisLine={{ stroke: '#E0E0E0' }}
                tickLine={{ stroke: '#E0E0E0' }}
                label={{ value: 'Time (hours)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#333333', fontSize: '12px' } }}
              />
              <YAxis 
                stroke="#333333" 
                fontSize={12}
                tick={{ fontSize: 12, fill: '#333333' }}
                domain={[0, 100]}
                axisLine={{ stroke: '#E0E0E0' }}
                tickLine={{ stroke: '#E0E0E0' }}
                label={{ value: 'Engagement Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#333333', fontSize: '12px' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="Post A"
                stroke="#0A66C2"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#0A66C2', strokeWidth: 2, fill: '#0A66C2' }}
              />
              
              <Line
                type="monotone"
                dataKey="Post B"
                stroke="#6E6E6E"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#6E6E6E', strokeWidth: 2, fill: '#6E6E6E' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}