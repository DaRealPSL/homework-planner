import { useState, useCallback } from 'react';

// Simple in-memory rate limiter (client-side)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  check(key: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    const allowed = recentAttempts.length < this.maxAttempts;
    const remaining = Math.max(0, this.maxAttempts - recentAttempts.length);
    const oldestAttempt = recentAttempts[0] || now;
    const resetIn = Math.max(0, this.windowMs - (now - oldestAttempt));

    if (allowed) {
      recentAttempts.push(now);
      this.attempts.set(key, recentAttempts);
    }

    return { allowed, remaining, resetIn };
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

// Simple math CAPTCHA
export interface CaptchaChallenge {
  question: string;
  answer: number;
}

export const generateCaptcha = (): CaptchaChallenge => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ['+', '-', '×'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let answer: number;
  let question: string;

  switch (operation) {
    case '+':
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
      break;
    case '-':
      answer = Math.max(num1, num2) - Math.min(num1, num2);
      question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
      break;
    case '×':
      answer = num1 * num2;
      question = `${num1} × ${num2}`;
      break;
    default:
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
  }

  return { question, answer };
};

interface SimpleCaptchaProps {
  onVerify: (success: boolean) => void;
  show: boolean;
}

export const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ onVerify, show }) => {
  const [challenge, setChallenge] = useState<CaptchaChallenge>(() => generateCaptcha());
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(() => {
    const answer = parseInt(userAnswer, 10);
    
    if (isNaN(answer)) {
      setError('Please enter a number');
      return;
    }

    if (answer === challenge.answer) {
      onVerify(true);
      setError('');
    } else {
      onVerify(false);
      setError('Incorrect answer. Try again.');
      setChallenge(generateCaptcha());
      setUserAnswer('');
    }
  }, [userAnswer, challenge, onVerify]);

  const handleRefresh = () => {
    setChallenge(generateCaptcha());
    setUserAnswer('');
    setError('');
  };

  if (!show) return null;

  return (
    <div className="mt-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-sm font-medium text-gray-300">Verify you're human</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-800 px-4 py-3 rounded-lg text-center">
            <span className="text-2xl font-mono text-white">{challenge.question} = ?</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
            title="New question"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Your answer"
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Verify
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};

// Hook for rate limiting
export const useRateLimit = (key: string) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [resetIn, setResetIn] = useState(0);

  const checkLimit = useCallback(() => {
    const result = rateLimiter.check(key);
    
    if (!result.allowed) {
      setIsBlocked(true);
      setResetIn(Math.ceil(result.resetIn / 1000));
      
      // Start countdown
      const interval = setInterval(() => {
        setResetIn(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBlocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return result.allowed;
  }, [key]);

  const reset = useCallback(() => {
    rateLimiter.reset(key);
    setIsBlocked(false);
    setResetIn(0);
  }, [key]);

  return { isBlocked, resetIn, checkLimit, reset };
};

// Rate limit warning component
export const RateLimitWarning: React.FC<{ resetIn: number }> = ({ resetIn }) => {
  if (resetIn <= 0) return null;

  return (
    <div className="bg-orange-900/30 border border-orange-500 text-orange-400 px-4 py-3 rounded-lg flex items-start gap-3">
      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div className="text-sm">
        <p className="font-medium">Too many attempts</p>
        <p className="text-orange-400/80">Please wait {resetIn} seconds before trying again.</p>
      </div>
    </div>
  );
};