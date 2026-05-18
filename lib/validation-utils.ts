/**
 * Shared validation utilities for auth forms
 *
 * Centralized password strength rules and email validation
 * so that ChangePasswordForm, ResetPasswordForm, and RegisterForm
 * all enforce the same constraints.
 */

// ─── Password Validation ────────────────────────────────────────────────────

export interface PasswordRule {
  key: string;
  label: string;
  test: (password: string) => boolean;
}

/**
 * Password strength rules — each rule is independently testable
 * so we can show a real-time checklist in the UI.
 */
export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: 'minLength',
    label: 'At least 8 characters',
    test: (pw) => pw.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'At least 1 uppercase letter (A-Z)',
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    key: 'number',
    label: 'At least 1 number (0-9)',
    test: (pw) => /\d/.test(pw),
  },
  {
    key: 'symbol',
    label: 'At least 1 symbol (!@#$%^&*…)',
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

/**
 * Validate a password against all rules.
 * Returns an array of rule keys that **failed**.
 */
export function getFailedPasswordRules(password: string): string[] {
  return PASSWORD_RULES
    .filter((rule) => !rule.test(password))
    .map((rule) => rule.key);
}

/**
 * Quick boolean helper — true when every rule passes.
 */
export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

// ─── Email Validation ───────────────────────────────────────────────────────

/**
 * Well-known email domains that are guaranteed to receive mail.
 * Used for a soft warning — we do NOT block unknown domains.
 */
const KNOWN_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.id',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'aol.com',
  'yandex.com',
  'gmx.com',
  'gmx.net',
]);

/**
 * Stricter email regex that goes beyond HTML `type="email"`.
 *
 * Checks for:
 * - Non-empty local part (letters, digits, dots, hyphens, underscores, plus)
 * - An @ sign
 * - A domain with at least two labels separated by a dot
 * - TLD of at least 2 chars
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface EmailValidationResult {
  /** Whether the format is valid */
  isValid: boolean;
  /** Whether the domain is in our known-safe list */
  isKnownDomain: boolean;
  /** Human-readable error (only when isValid = false) */
  error?: string;
}

/**
 * Validate an email address.
 *
 * Returns format validity + whether the domain is known.
 * The UI can show a *warning* for unknown domains without blocking submission.
 */
export function validateEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { isValid: false, isKnownDomain: false, error: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, isKnownDomain: false, error: 'Please enter a valid email address' };
  }

  const domain = trimmed.split('@')[1];
  const isKnownDomain = KNOWN_EMAIL_DOMAINS.has(domain);

  return { isValid: true, isKnownDomain };
}
