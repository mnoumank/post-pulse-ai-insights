
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart3, Lightbulb } from 'lucide-react';
import { HybridAnalysisResult } from '@/utils/hybridAnalyzer';

interface EnhancedAnalysisPanelProps {
  result: HybridAnalysisResult | null;
  title?: string;
}

export function EnhancedAnalysisPanel({ result, title = "Enhanced Analysis" }: EnhancedAnalysisPanelProps) {
  if (!result) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Enter post content to see enhanced analysis
        </CardContent>
      </Card>
    );
  }

  const { enhanced, confidence, analysisMethod, aiContribution } = result;
  
  const getInterpretationColor = (interpretation: string) => {
    switch (interpretation) {
      case 'High': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFactorIcon = (score: number) => {
    if (score >= 7) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (score >= 4) return <BarChart3 className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {analysisMethod}
            </Badge>
            <Badge 
              className={`${getInterpretationColor(enhanced.interpretation)} text-white text-xs`}
            >
              {enhanced.interpretation} Potential
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Overall Score */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {enhanced.viralityScore.toFixed(1)}/10
          </div>
          <Progress 
            value={enhanced.viralityScore * 10} 
            className="w-full h-3 mb-2"
          />
          <div className="text-sm text-muted-foreground">
            Virality Score • {(confidence * 100).toFixed(0)}% confidence
            {aiContribution > 0 && (
              <span className="ml-2">• {(aiContribution * 100).toFixed(0)}% AI contribution</span>
            )}
          </div>
        </div>

        {/* 8-Factor Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            8-Factor Analysis
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(enhanced.factors).map(([key, score]) => {
              const factorName = key.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
              
              const weight = getFactorWeight(key);
              
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {getFactorIcon(score)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{factorName}</span>
                        <Badge variant="outline" className="text-xs">
                          {weight}% weight
                        </Badge>
                      </div>
                      <Progress value={score * 10} className="h-2 mt-1" />
                    </div>
                  </div>
                  <div className="text-sm font-mono ml-2">
                    {score.toFixed(1)}/10
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Strengths */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-green-600">Top Strengths</h4>
          <div className="space-y-1">
            {enhanced.topStrengths.map((strength, index) => (
              <div key={index} className="text-sm bg-green-50 p-2 rounded border-l-2 border-green-200">
                {strength}
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-amber-600">Priority Improvements</h4>
          <div className="space-y-1">
            {enhanced.improvementAreas.map((area, index) => (
              <div key={index} className="text-sm bg-amber-50 p-2 rounded border-l-2 border-amber-200">
                {area}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Recommendations */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Key Recommendations</h4>
          <div className="space-y-2">
            {Object.entries(enhanced.detailedAnalysis)
              .filter(([_, analysis]) => analysis.score < 7)
              .slice(0, 3)
              .map(([key, analysis]) => (
                <div key={key} className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-200">
                  <div className="font-medium text-sm mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {analysis.description}
                  </div>
                  <div className="text-sm">
                    <strong>Suggestion:</strong> {analysis.suggestions[0]}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

// Helper function to get factor weights
function getFactorWeight(factorKey: string): number {
  const weights: { [key: string]: number } = {
    hookStrength: 20,
    readabilityFormatting: 15,
    valueRelevance: 15,
    authorCredibility: 15,
    storytellingRelatability: 10,
    visualAppeal: 10,
    callToActionEngagement: 10,
    timingFrequency: 5,
  };
  
  return weights[factorKey] || 0;
}
