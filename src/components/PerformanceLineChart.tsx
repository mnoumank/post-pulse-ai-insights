
import React, { useState, useRef, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

interface PerformanceLineChartProps {
  metrics1: PostMetrics | null;
  metrics2: PostMetrics | null;
  title?: string;
}

interface LineVisibility {
  post1Engagement: boolean;
  post1Reach: boolean;
  post1Virality: boolean;
  post2Engagement: boolean;
  post2Reach: boolean;
  post2Virality: boolean;
}

export function PerformanceLineChart({ 
  metrics1, 
  metrics2, 
  title = "Real-time Performance Comparison" 
}: PerformanceLineChartProps) {
  const [lineVisibility, setLineVisibility] = useState<LineVisibility>({
    post1Engagement: true,
    post1Reach: true,
    post1Virality: true,
    post2Engagement: true,
    post2Reach: true,
    post2Virality: true,
  });
  
  const [highlightWinner, setHighlightWinner] = useState(true);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  // Trigger confetti animation at 24h for winning post
  useEffect(() => {
    if (metrics1 && metrics2) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      }, 3000); // Show confetti after chart loads
      return () => clearTimeout(timer);
    }
  }, [metrics1, metrics2]);

  // If no metrics, show placeholder
  if (!metrics1 && !metrics2) {
    return (
      <Card className="w-full premium-chart-container">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-gray-400">Enter post content to see performance comparison</p>
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
      // Track which post is winning at this time point
      post1Total: post1Engagement + post1Reach + post1Virality,
      post2Total: post2Engagement + post2Reach + post2Virality,
    };
  });

  // Premium gradient definitions for lines
  const gradients = {
    post1: {
      engagement: `url(#post1EngagementGradient)`,
      reach: `url(#post1ReachGradient)`,
      virality: `url(#post1ViralityGradient)`,
    },
    post2: {
      engagement: `url(#post2EngagementGradient)`,
      reach: `url(#post2ReachGradient)`,
      virality: `url(#post2ViralityGradient)`,
    },
  };

  // Toggle line visibility
  const toggleLine = (lineKey: keyof LineVisibility) => {
    setLineVisibility(prev => ({ ...prev, [lineKey]: !prev[lineKey] }));
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="premium-tooltip p-4 text-white">
          <p className="font-semibold mb-2 text-blue-300">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {entry.name}: <span className="font-bold">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom dot component with glow effects
  const CustomDot = (props: any) => {
    const { cx, cy, dataKey, index } = props;
    const isKeyTime = index === 2 || index === 3 || index === 4 || index === 5; // 6h, 12h, 18h, 24h
    
    if (!isKeyTime) return null;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={props.stroke}
        className="data-point-glow"
        style={{ filter: `drop-shadow(0 0 6px ${props.stroke})` }}
      />
    );
  };

  return (
    <Card className="w-full premium-chart-container border-0 overflow-hidden">
      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl text-white font-bold">{title}</CardTitle>
            <p className="text-sm text-gray-300">
              Live performance tracking with AI predictions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightWinner(!highlightWinner)}
              className={cn(
                "legend-pill text-xs",
                highlightWinner && "active"
              )}
            >
              ✨ Highlight Winner
            </button>
            {showConfetti && (
              <div className="animate-confetti text-yellow-400 text-lg">🎉</div>
            )}
          </div>
        </div>
        
        {/* Custom Legend Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => toggleLine('post1Engagement')}
            className={cn("legend-pill", lineVisibility.post1Engagement && "active")}
            style={{ borderColor: '#00D4FF' }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 mr-2" />
            Post 1 Engagement
          </button>
          <button
            onClick={() => toggleLine('post1Reach')}
            className={cn("legend-pill", lineVisibility.post1Reach && "active")}
            style={{ borderColor: '#4FC3F7' }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-300 to-cyan-400 mr-2" />
            Post 1 Reach
          </button>
          <button
            onClick={() => toggleLine('post1Virality')}
            className={cn("legend-pill", lineVisibility.post1Virality && "active")}
            style={{ borderColor: '#81D4FA' }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-200 to-cyan-300 mr-2" />
            Post 1 Virality
          </button>
          
          <button
            onClick={() => toggleLine('post2Engagement')}
            className={cn("legend-pill", lineVisibility.post2Engagement && "active")}
            style={{ borderColor: '#FF6B6B' }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 mr-2" />
            Post 2 Engagement
          </button>
          <button
            onClick={() => toggleLine('post2Reach')}
            className={cn("legend-pill", lineVisibility.post2Reach && "active")}
            style={{ borderColor: '#FFB74D' }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 mr-2" />
            Post 2 Reach
          </button>
          <button
            onClick={() => toggleLine('post2Virality')}
            className={cn("legend-pill", lineVisibility.post2Virality && "active")}
            style={{ borderColor: '#FFEB3B' }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mr-2" />
            Post 2 Virality
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6 relative z-10">
        <div className="h-[280px] sm:h-[350px]" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              onMouseMove={(e) => {
                if (e && e.activeLabel) {
                  // Determine winning post at this time point
                  const point = data.find(d => d.time === e.activeLabel);
                  if (point && highlightWinner) {
                    setHoveredLine(point.post1Total > point.post2Total ? 'post1' : 'post2');
                  }
                }
              }}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <defs>
                {/* Gradient definitions */}
                <linearGradient id="post1EngagementGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#0099CC" />
                </linearGradient>
                <linearGradient id="post1ReachGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4FC3F7" />
                  <stop offset="100%" stopColor="#29B6F6" />
                </linearGradient>
                <linearGradient id="post1ViralityGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#81D4FA" />
                  <stop offset="100%" stopColor="#4FC3F7" />
                </linearGradient>
                
                <linearGradient id="post2EngagementGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="100%" stopColor="#FF5252" />
                </linearGradient>
                <linearGradient id="post2ReachGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFB74D" />
                  <stop offset="100%" stopColor="#FF9800" />
                </linearGradient>
                <linearGradient id="post2ViralityGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFEB3B" />
                  <stop offset="100%" stopColor="#FFC107" />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 2" 
                stroke="rgba(255,255,255,0.1)" 
                className="chart-grid-glow"
              />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.6)" 
                fontSize={11}
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.8)' }}
                interval={0}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)" 
                fontSize={10}
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.8)' }}
                domain={[0, 100]}
                width={30}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Post 1 Lines */}
              {lineVisibility.post1Engagement && (
                <Line
                  type="monotone"
                  dataKey="Post 1 Engagement"
                  stroke={gradients.post1.engagement}
                  strokeWidth={hoveredLine === 'post1' ? 5 : 3}
                  dot={<CustomDot />}
                  activeDot={{ r: 8, stroke: '#00D4FF', strokeWidth: 3, fill: '#00D4FF' }}
                  className={cn(
                    "transition-all duration-300",
                    hoveredLine === 'post1' && "winning-line",
                    hoveredLine === 'post2' && "opacity-50"
                  )}
                  strokeDasharray="0"
                  onMouseEnter={() => setHoveredLine('post1')}
                />
              )}
              
              {lineVisibility.post1Reach && (
                <Line
                  type="monotone"
                  dataKey="Post 1 Reach"
                  stroke={gradients.post1.reach}
                  strokeWidth={hoveredLine === 'post1' ? 4 : 2}
                  strokeDasharray="8 4"
                  dot={<CustomDot />}
                  activeDot={{ r: 6, stroke: '#4FC3F7', strokeWidth: 2 }}
                  className={cn(
                    "transition-all duration-300",
                    hoveredLine === 'post2' && "opacity-50"
                  )}
                />
              )}
              
              {lineVisibility.post1Virality && (
                <Line
                  type="monotone"
                  dataKey="Post 1 Virality"
                  stroke={gradients.post1.virality}
                  strokeWidth={hoveredLine === 'post1' ? 4 : 2}
                  strokeDasharray="4 4"
                  dot={<CustomDot />}
                  activeDot={{ r: 6, stroke: '#81D4FA', strokeWidth: 2 }}
                  className={cn(
                    "transition-all duration-300",
                    hoveredLine === 'post2' && "opacity-50"
                  )}
                />
              )}
              
              {/* Post 2 Lines */}
              {lineVisibility.post2Engagement && (
                <Line
                  type="monotone"
                  dataKey="Post 2 Engagement"
                  stroke={gradients.post2.engagement}
                  strokeWidth={hoveredLine === 'post2' ? 5 : 3}
                  dot={<CustomDot />}
                  activeDot={{ r: 8, stroke: '#FF6B6B', strokeWidth: 3, fill: '#FF6B6B' }}
                  className={cn(
                    "transition-all duration-300",
                    hoveredLine === 'post2' && "winning-line",
                    hoveredLine === 'post1' && "opacity-50"
                  )}
                  onMouseEnter={() => setHoveredLine('post2')}
                />
              )}
              
              {lineVisibility.post2Reach && (
                <Line
                  type="monotone"
                  dataKey="Post 2 Reach"
                  stroke={gradients.post2.reach}
                  strokeWidth={hoveredLine === 'post2' ? 4 : 2}
                  strokeDasharray="8 4"
                  dot={<CustomDot />}
                  activeDot={{ r: 6, stroke: '#FFB74D', strokeWidth: 2 }}
                  className={cn(
                    "transition-all duration-300",
                    hoveredLine === 'post1' && "opacity-50"
                  )}
                />
              )}
              
              {lineVisibility.post2Virality && (
                <Line
                  type="monotone"
                  dataKey="Post 2 Virality"
                  stroke={gradients.post2.virality}
                  strokeWidth={hoveredLine === 'post2' ? 4 : 2}
                  strokeDasharray="4 4"
                  dot={<CustomDot />}
                  activeDot={{ r: 6, stroke: '#FFEB3B', strokeWidth: 2 }}
                  className={cn(
                    "transition-all duration-300",
                    hoveredLine === 'post1' && "opacity-50"
                  )}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
