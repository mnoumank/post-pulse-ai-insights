
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AdvancedAnalysisParams } from '@/utils/postAnalyzer';

interface AdvancedAnalysisPanelProps {
  params: AdvancedAnalysisParams;
  onChange: (params: Partial<AdvancedAnalysisParams>) => void;
  onAnalyze: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

const followerRanges = [
  { value: '0-500', label: '0-500' },
  { value: '500-1K', label: '500-1K' },
  { value: '1K-5K', label: '1K-5K' },
  { value: '5K-10K', label: '5K-10K' },
  { value: '10K+', label: '10K+' },
];

const industries = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Legal', label: 'Legal' },
];

const engagementLevels = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export function AdvancedAnalysisPanel({ 
  params, 
  onChange,
  onAnalyze,
  isVisible,
  onToggle 
}: AdvancedAnalysisPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Advanced Analysis Options</CardTitle>
          <CardDescription>
            Customize parameters to get more accurate predictions
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onToggle}
        >
          {isVisible ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      
      {isVisible && (
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="follower-range">Follower Range</Label>
            <Select
              value={params.followerRange}
              onValueChange={(value) => onChange({ followerRange: value })}
            >
              <SelectTrigger id="follower-range">
                <SelectValue placeholder="Select follower range" />
              </SelectTrigger>
              <SelectContent>
                {followerRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={params.industry}
              onValueChange={(value) => onChange({ industry: value })}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="engagement-level">Typical Engagement Level</Label>
            <Select
              value={params.engagementLevel}
              onValueChange={(value) => onChange({ engagementLevel: value })}
            >
              <SelectTrigger id="engagement-level">
                <SelectValue placeholder="Select engagement level" />
              </SelectTrigger>
              <SelectContent>
                {engagementLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full mt-4"
            onClick={onAnalyze}
          >
            Analyze with Current Parameters
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
