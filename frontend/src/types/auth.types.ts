import { Role } from '@/config/routes.config'

export type { Role }

export type CustomLoginRole   = Exclude<Role, 'ADMIN'>
export type OtpRole           = 'MANAGER' | 'TEACHER' | 'STUDENT'
export type ForgotPasswordRole = 'MANAGER' | 'TEACHER'

export interface AuthUser {
  userId:    string
  email:     string
  role:      Role
  sessionId: string
}

export interface LoginInput {
  email:    string
  password: string
  role:     CustomLoginRole
}

export interface LoginResponse {
  success: boolean
  message: string
  otpSent: boolean
  sessionId?: string
  csrfToken?: string
}

export interface VerifyOtpInput {
  email: string
  otp:   string
  role:  OtpRole
}

export interface VerifyOtpResponse {
  success:   boolean
  message:   string
  sessionId: string
  csrfToken: string
}

export interface MeData {
  user: AuthUser
}