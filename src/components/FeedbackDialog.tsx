import React, { useState } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { submitFeedback, updateUserPreferences } from '@/utils/auth/feedback';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: string;
}

export function FeedbackDialog({ open, onOpenChange, page }: FeedbackDialogProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [neverShowAgain, setNeverShowAgain] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Please provide a rating",
        description: "Your rating helps us improve the app.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit feedback
      await submitFeedback({
        message,
        rating,
        page,
      });

      // Update preferences if user chose "never show again"
      if (neverShowAgain) {
        await updateUserPreferences({
          never_show_feedback: true,
        });
      }

      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us make the app better.",
      });

      onOpenChange(false);
      // Reset form
      setRating(0);
      setMessage('');
      setNeverShowAgain(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    setRating(0);
    setMessage('');
    setNeverShowAgain(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How are we doing?</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve the app. Rate your experience and let us know your thoughts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message (optional)</label>
            <Textarea
              placeholder="Tell us what you think..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Never show again checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="never-show"
              checked={neverShowAgain}
              onCheckedChange={(checked) => setNeverShowAgain(checked as boolean)}
            />
            <label
              htmlFor="never-show"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don't show this again
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Skip
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}