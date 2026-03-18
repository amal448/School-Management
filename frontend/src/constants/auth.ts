import { ROLES } from '@/constants'

// ── Auth error types ───────────────────────────────────
export type AuthError =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_NOT_VERIFIED'
  | 'ACCOUNT_BLOCKED'
  | 'NOT_WHITELISTED'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | null

export const ERROR_MESSAGES: Record<NonNullable<AuthError>, string> = {
  INVALID_CREDENTIALS:  'Invalid email or password. Please try again.',
  ACCOUNT_NOT_VERIFIED: 'Your account is not verified. Check your email for the verification link.',
  ACCOUNT_BLOCKED:      'Your account has been suspended. Contact the administrator.',
  NOT_WHITELISTED:      'Your Google account is not authorized. Contact the administrator.',
  OTP_INVALID:          'Invalid OTP. Please try again.',
  OTP_EXPIRED:          'OTP has expired. Please login again to receive a new one.',
}

// ── Role types ─────────────────────────────────────────
export type AdminManagerRole = typeof ROLES.ADMIN | typeof ROLES.MANAGER

export const ADMIN_ROLE_OPTIONS = [
  { value: ROLES.ADMIN,   label: 'Admin'   },
  { value: ROLES.MANAGER, label: 'Manager' },
] as const

// ── Auth user type (from backend response) ─────────────
export interface AuthUser {
  id:           string
  email:        string
  role:         AdminManagerRole
  first_name:   string
  last_name:    string
  avatar?:      string
  is_verified:  boolean
  is_blocked:   boolean
  is_first_time: boolean
}

export interface LoginResponse {
  token:         string
  user:          AuthUser
  is_first_time: boolean
  requires_otp:  boolean
}
