'use client';

import { validateEmail } from '@/lib/validation-utils';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

interface EmailValidationHintProps {
  email: string;
  /** Only show when the field has been blurred at least once */
  touched: boolean;
}

/**
 * Inline email validation feedback.
 *
 * - Shows an error if the format is invalid.
 * - Shows a soft warning if the domain is not in our known-safe list.
 * - Shows a green check if everything looks good.
 *
 * The warning for unknown domains does NOT block submission — it's
 * informational only (the user might have a university or company email).
 */
export function EmailValidationHint({ email, touched }: EmailValidationHintProps) {
  if (!touched || !email) return null;

  const result = validateEmail(email);

  if (!result.isValid) {
    return (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
        <FiAlertTriangle className="h-3.5 w-3.5 shrink-0" />
        {result.error}
      </p>
    );
  }

  if (!result.isKnownDomain) {
    const domain = email.trim().split('@')[1];
    return (
      <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
        <FiAlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span>
          <strong>{domain}</strong> is not a common email provider. Make sure you can receive emails at this address.
        </span>
      </p>
    );
  }

  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
      <FiCheckCircle className="h-3.5 w-3.5 shrink-0" />
      Email looks good
    </p>
  );
}
