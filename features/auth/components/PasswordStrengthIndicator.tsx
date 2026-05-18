'use client';

import { PASSWORD_RULES } from '@/lib/validation-utils';
import { FiCheck, FiX } from 'react-icons/fi';

interface PasswordStrengthIndicatorProps {
  password: string;
}

/**
 * Real-time password strength checklist.
 *
 * Shows each rule with a ✅ or ❌ icon that updates as the user types.
 * Only renders when password field has content (avoids noisy empty-state).
 */
export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const passedCount = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const totalCount = PASSWORD_RULES.length;

  // Color for overall strength bar
  const strengthPercent = (passedCount / totalCount) * 100;
  const barColor =
    strengthPercent <= 25
      ? 'bg-red-500'
      : strengthPercent <= 50
        ? 'bg-orange-500'
        : strengthPercent <= 75
          ? 'bg-yellow-500'
          : 'bg-green-500';

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${strengthPercent}%` }}
        />
      </div>

      {/* Rule checklist */}
      <ul className="space-y-1">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <li
              key={rule.key}
              className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                passed ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {passed ? (
                <FiCheck className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <FiX className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
