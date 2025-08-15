
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { PostSuggestion } from '@/utils/postAnalyzer';

interface SuggestionCardsProps {
  suggestions: PostSuggestion[];
  title: string;
}

export function SuggestionCards({ suggestions, title }: SuggestionCardsProps) {
  // If no suggestions, show a placeholder
  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Enter post content to receive AI-powered improvement suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'tip':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="overflow-hidden bg-muted/50">
            <div className="flex p-3 sm:p-4">
              <div className="mr-2 sm:mr-3 flex-shrink-0">{getIcon(suggestion.type)}</div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <h4 className="font-medium text-sm sm:text-base">{suggestion.title}</h4>
                  <Badge className={`self-start sm:ml-2 text-xs ${getBadgeColor(suggestion.type)}`}>
                    {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
