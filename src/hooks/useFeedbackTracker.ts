import { useState, useEffect } from 'react';
import { shouldShowFeedback, incrementFeedbackCount } from '@/utils/auth/feedback';

export function useFeedbackTracker() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [operationCount, setOperationCount] = useState(0);

  const trackOperation = async () => {
    const newCount = operationCount + 1;
    setOperationCount(newCount);

    // Check if we should show feedback after 3 operations
    if (newCount >= 3) {
      const shouldShow = await shouldShowFeedback();
      if (shouldShow) {
        setShowFeedback(true);
        await incrementFeedbackCount();
        setOperationCount(0); // Reset counter
      }
    }
  };

  const closeFeedback = () => {
    setShowFeedback(false);
  };

  return {
    showFeedback,
    closeFeedback,
    trackOperation,
  };
}