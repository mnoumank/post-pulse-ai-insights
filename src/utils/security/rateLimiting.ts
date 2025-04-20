
import { toast } from "sonner";

const RATE_LIMIT_MINUTES = 15;
const MAX_ATTEMPTS = 5;

interface AttemptRecord {
  attempts: number;
  timestamp: number;
}

export const loginRateLimit = {
  checkRateLimit: (email: string): boolean => {
    const attempts = localStorage.getItem(`login_attempts_${email}`);
    if (!attempts) return true;

    const record: AttemptRecord = JSON.parse(attempts);
    const now = Date.now();
    const minutesSinceLastAttempt = (now - record.timestamp) / (1000 * 60);

    if (minutesSinceLastAttempt > RATE_LIMIT_MINUTES) {
      localStorage.removeItem(`login_attempts_${email}`);
      return true;
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      const minutesLeft = Math.ceil(RATE_LIMIT_MINUTES - minutesSinceLastAttempt);
      toast.error(`Too many login attempts. Please try again in ${minutesLeft} minutes.`);
      return false;
    }

    return true;
  },

  recordAttempt: (email: string) => {
    const attempts = localStorage.getItem(`login_attempts_${email}`);
    const now = Date.now();
    
    if (!attempts) {
      localStorage.setItem(`login_attempts_${email}`, JSON.stringify({ attempts: 1, timestamp: now }));
      return;
    }

    const record: AttemptRecord = JSON.parse(attempts);
    const minutesSinceLastAttempt = (now - record.timestamp) / (1000 * 60);

    if (minutesSinceLastAttempt > RATE_LIMIT_MINUTES) {
      localStorage.setItem(`login_attempts_${email}`, JSON.stringify({ attempts: 1, timestamp: now }));
    } else {
      localStorage.setItem(`login_attempts_${email}`, JSON.stringify({
        attempts: record.attempts + 1,
        timestamp: record.timestamp
      }));
    }
  }
};
