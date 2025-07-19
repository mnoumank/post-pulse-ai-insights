import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';

interface ViralityFactors {
  hookStrength: number;
  readability: number;
  storytelling: number;
  valueRelevance: number;
  callToAction: number;
  visualAppeal: number;
  engagementBait: number;
  personalTouch: number;
}

interface ViralityDashboardProps {
  factors: ViralityFactors;
  overallScore: number;
  predictedMetrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
}

export const ViralityDashboard: React.FC<ViralityDashboardProps> = ({
  factors,
  overallScore,
  predictedMetrics
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Work';
  };

  const factorDetails = [
    { key: 'hookStrength', label: 'Hook Strength', weight: 20, icon: TrendingUp },
    { key: 'readability', label: 'Readability', weight: 15, icon: Eye },
    { key: 'storytelling', label: 'Storytelling', weight: 15, icon: MessageCircle },
    { key: 'valueRelevance', label: 'Value & Relevance', weight: 15, icon: Heart },
    { key: 'callToAction', label: 'Call to Action', weight: 10, icon: MessageCircle },
    { key: 'visualAppeal', label: 'Visual Appeal', weight: 10, icon: Eye },
    { key: 'engagementBait', label: 'Engagement Bait', weight: 10, icon: TrendingUp },
    { key: 'personalTouch', label: 'Personal Touch', weight: 5, icon: Heart },
  ];

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Virality Score
            <Badge 
              variant={overallScore >= 7 ? 'default' : overallScore >= 5 ? 'secondary' : 'destructive'}
              className="text-lg px-3 py-1"
            >
              {overallScore.toFixed(1)}/10
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore * 10} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {getScoreLabel(overallScore)} - {overallScore >= 7 ? 'High viral potential' : overallScore >= 5 ? 'Moderate viral potential' : 'Low viral potential'}
          </p>
        </CardContent>
      </Card>

      {/* Factor Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Factor Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {factorDetails.map((factor) => {
              const Icon = factor.icon;
              const score = factors[factor.key as keyof ViralityFactors];
              return (
                <div key={factor.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{factor.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {factor.weight}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={score * 10} className="w-16 h-2" />
                    <span className={`text-sm font-medium w-8 ${getScoreColor(score)}`}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Predicted Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Predicted Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">{predictedMetrics.likes.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{predictedMetrics.comments.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Comments</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">{predictedMetrics.shares.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Shares</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{predictedMetrics.reach.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Reach</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};