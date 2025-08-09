
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { getComparisonActuals, saveComparisonActuals } from '@/utils/auth/comparisonActuals';

interface RealityCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comparisonId: string;
  postALabel?: string;
  postBLabel?: string;
  onSaved?: () => void;
}

export const RealityCheckDialog: React.FC<RealityCheckDialogProps> = ({
  open,
  onOpenChange,
  comparisonId,
  postALabel = 'Post A',
  postBLabel = 'Post B',
  onSaved
}) => {
  const [loading, setLoading] = useState(false);

  const [postAUrl, setPostAUrl] = useState('');
  const [postBUrl, setPostBUrl] = useState('');
  const [aLikes, setALikes] = useState<number | ''>('');
  const [aComments, setAComments] = useState<number | ''>('');
  const [aShares, setAShares] = useState<number | ''>('');
  const [aImpressions, setAImpressions] = useState<number | ''>('');
  const [bLikes, setBLikes] = useState<number | ''>('');
  const [bComments, setBComments] = useState<number | ''>('');
  const [bShares, setBShares] = useState<number | ''>('');
  const [bImpressions, setBImpressions] = useState<number | ''>('');
  const [actualWinner, setActualWinner] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) return;
    // Load existing actuals (if any)
    (async () => {
      try {
        const existing = await getComparisonActuals(comparisonId);
        if (existing) {
          setPostAUrl(existing.post_a_url || '');
          setPostBUrl(existing.post_b_url || '');
          setALikes(existing.post_a_likes ?? '');
          setAComments(existing.post_a_comments ?? '');
          setAShares(existing.post_a_shares ?? '');
          setAImpressions(existing.post_a_impressions ?? '');
          setBLikes(existing.post_b_likes ?? '');
          setBComments(existing.post_b_comments ?? '');
          setBShares(existing.post_b_shares ?? '');
          setBImpressions(existing.post_b_impressions ?? '');
          setActualWinner(
            typeof existing.actual_winner === 'number' ? existing.actual_winner : ''
          );
          setNotes(existing.notes || '');
        }
      } catch (e: any) {
        console.error('Failed to load reality check:', e);
      }
    })();
  }, [open, comparisonId]);

  const toNumber = (v: number | '' | undefined) => (v === '' || typeof v === 'undefined' ? undefined : Number(v));

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveComparisonActuals({
        comparison_id: comparisonId,
        post_a_url: postAUrl || undefined,
        post_b_url: postBUrl || undefined,
        post_a_likes: toNumber(aLikes),
        post_a_comments: toNumber(aComments),
        post_a_shares: toNumber(aShares),
        post_a_impressions: toNumber(aImpressions),
        post_b_likes: toNumber(bLikes),
        post_b_comments: toNumber(bComments),
        post_b_shares: toNumber(bShares),
        post_b_impressions: toNumber(bImpressions),
        actual_winner: toNumber(actualWinner),
        notes: notes || undefined,
      });
      toast({
        title: 'Reality Check saved',
        description: 'Your actual post performance has been recorded.',
      });
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Failed to save Reality Check',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Reality Check</DialogTitle>
          <DialogDescription>
            Record the actual performance of your posts after publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          <div className="space-y-3">
            <Label className="text-sm">{postALabel} URL</Label>
            <Input placeholder="https://linkedin.com/..." value={postAUrl} onChange={(e) => setPostAUrl(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Likes</Label>
                <Input type="number" value={aLikes} onChange={(e) => setALikes(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Comments</Label>
                <Input type="number" value={aComments} onChange={(e) => setAComments(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Shares</Label>
                <Input type="number" value={aShares} onChange={(e) => setAShares(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Impressions</Label>
                <Input type="number" value={aImpressions} onChange={(e) => setAImpressions(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm">{postBLabel} URL</Label>
            <Input placeholder="https://linkedin.com/..." value={postBUrl} onChange={(e) => setPostBUrl(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Likes</Label>
                <Input type="number" value={bLikes} onChange={(e) => setBLikes(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Comments</Label>
                <Input type="number" value={bComments} onChange={(e) => setBComments(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Shares</Label>
                <Input type="number" value={bShares} onChange={(e) => setBShares(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Impressions</Label>
                <Input type="number" value={bImpressions} onChange={(e) => setBImpressions(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm">Actual Winner</Label>
          <select
            className="w-full border rounded px-3 py-2 bg-background"
            value={actualWinner === '' ? '' : String(actualWinner)}
            onChange={(e) => setActualWinner(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Not set</option>
            <option value="1">Post A</option>
            <option value="2">Post B</option>
            <option value="0">Tie</option>
          </select>

          <Label className="text-sm">Notes</Label>
          <Textarea placeholder="Any observations..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RealityCheckDialog;
