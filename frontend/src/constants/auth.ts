import { ROLES } from "@/config/routes.config";

export type AuthError =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_NOT_VERIFIED'
  | 'ACCOUNT_BLOCKED'
  | 'NOT_WHITELISTED'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'UNKNOWN'

export const ERROR_MESSAGES: Record<NonNullable<AuthError>, string> = {
  INVALID_CREDENTIALS:  'Invalid email or password. Please try again.',
  ACCOUNT_NOT_VERIFIED: 'Your account is not verified. Check your email for the verification link.',
  ACCOUNT_BLOCKED:      'Your account has been suspended. Contact the administrator.',
  NOT_WHITELISTED:      'Your Google account is not authorized. Contact the administrator.',
  OTP_INVALID:          'Invalid OTP. Please try again.',
  OTP_EXPIRED:          'OTP has expired. Please login again to receive a new one.',
  UNKNOWN:              'An unknown error occurred. Please try again later.',
};

// 2. Define the source of truth for Admin/Manager roles
export const ADMIN_ROLE_OPTIONS = [
  { value: ROLES.ADMIN,   label: 'Admin'   },
  { value: ROLES.MANAGER, label: 'Manager' },
] as const;

// 3. Derive the types from the array to keep things DRY
export type AdminManagerRole = (typeof ADMIN_ROLE_OPTIONS)[number]['value'];
export type AdminRoleOption = AdminManagerRole;