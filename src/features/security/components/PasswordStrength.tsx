import React, { useMemo } from 'react';

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const checkPasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 6) score++;
  else feedback.push('At least 6 characters');

  if (password.length >= 10) score++;

  // Uppercase check
  if (/[A-Z]/.test(password)) score++;
  else feedback.push('One uppercase letter');

  // Lowercase check
  if (/[a-z]/.test(password)) score++;
  else feedback.push('One lowercase letter');

  // Number check
  if (/[0-9]/.test(password)) score++;
  else feedback.push('One number');

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('One special character (!@#$%^&*)');

  // Common patterns to avoid
  const commonPatterns = [
    /^123/,
    /password/i,
    /qwerty/i,
    /abc/i,
    /111/,
    /000/,
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns');
  }

  // Normalize score to 0-4 range
  const normalizedScore = Math.min(4, Math.max(0, Math.floor(score / 1.5)));

  return {
    score: normalizedScore,
    feedback,
    isStrong: normalizedScore >= 3,
  };
};

interface PasswordStrengthMeterProps {
  password: string;
  show: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  show,
}) => {
  const strength = useMemo(() => checkPasswordStrength(password), [password]);

  if (!show || !password) return null;

  const colors = [
    { bg: 'bg-red-500', text: 'text-red-400', label: 'Very Weak' },
    { bg: 'bg-orange-500', text: 'text-orange-400', label: 'Weak' },
    { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Fair' },
    { bg: 'bg-lime-500', text: 'text-lime-400', label: 'Good' },
    { bg: 'bg-green-500', text: 'text-green-400', label: 'Strong' },
  ];

  const currentColor = colors[strength.score];

  return (
    <div className="mt-3 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${currentColor.bg} transition-all duration-300`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${currentColor.text}`}>
          {currentColor.label}
        </span>
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="text-xs text-gray-400 space-y-1">
          <p className="font-medium">Required:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {strength.feedback.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {strength.isStrong && (
        <div className="flex items-center gap-2 text-xs text-green-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Strong password!
        </div>
      )}
    </div>
  );
};