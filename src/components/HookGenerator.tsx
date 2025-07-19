import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HookOption {
  id: string;
  text: string;
  type: string;
  description: string;
}

interface HookGeneratorProps {
  userIdea: string;
  onHookSelect: (hook: string) => void;
  selectedHook?: string;
}

export const HookGenerator: React.FC<HookGeneratorProps> = ({
  userIdea,
  onHookSelect,
  selectedHook
}) => {
  const [hooks, setHooks] = useState<HookOption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHooks = async () => {
    if (!userIdea.trim()) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-hooks', {
        body: { idea: userIdea },
      });

      if (error) throw error;
      setHooks(data.hooks);
    } catch (error) {
      console.error('Error generating hooks:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (userIdea.trim() && hooks.length === 0) {
      generateHooks();
    }
  }, [userIdea]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Hook Generator</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Choose an attention-grabbing opening line (20% of virality score)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateHooks}
          disabled={isGenerating || !userIdea.trim()}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Regenerate'}
        </Button>
      </CardHeader>
      <CardContent>
        {hooks.length > 0 ? (
          <div className="space-y-3">
            {hooks.map((hook) => (
              <div
                key={hook.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedHook === hook.text
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onHookSelect(hook.text)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {hook.type}
                  </Badge>
                  {selectedHook === hook.text && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm font-medium mb-1">{hook.text}</p>
                <p className="text-xs text-muted-foreground">{hook.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {userIdea.trim() ? (
              isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating viral hooks...
                </div>
              ) : (
                'Enter your idea above to generate hook options'
              )
            ) : (
              'Enter your idea above to generate hook options'
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};