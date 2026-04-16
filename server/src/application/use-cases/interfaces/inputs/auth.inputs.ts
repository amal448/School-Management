import { AdminMapper } from "src/application/mappers"
import { Role } from "src/domain/enums"
import { Response } from 'express'

// export interface LoginInput {
//   email:    string
//   password: string
// }


export interface VerifyOtpInput {
  email: string
  otp:   string
  role:  Role.MANAGER | Role.TEACHER | Role.STUDENT
  res:   Response
}

export interface VerifyOtpResult {
  message:   string
  sessionId: string
  csrfToken: string
}

export interface ForgotPasswordInput {
  email: string
  role:string
}

export interface ResetPasswordInput {
  token:       string
  newPassword: string
  role:string
}

export interface ChangePasswordInput {
  userId:         string
  currentPassword: string
  newPassword:    string
  role:            Role
}

export interface FirstTimeSetupInput {
  userId:      string
  newPassword: string
  role:string
   token:       string
}

export interface ResetStudentPasswordInput {
  studentId:    string
  newPassword:  string
  requesterId:  string
  requesterRole: string
}

export interface GoogleOAuthInput {
  googleId:  string
  email:     string
  firstName: string
  lastName:  string
  avatar?:   string
}

export interface RefreshTokenInput {
  refreshToken: string
}

export interface GoogleProfile {
  googleId:  string
  email:     string
  firstName: string
  lastName:  string
  avatar?:   string
}

export interface GoogleAuthResult {
  sessionId: string
  csrfToken: string
  user:      ReturnType<typeof AdminMapper.toDto>
}

export interface LoginInput {
  email:    string
  password: string
  role:     Role
  req:      Request
  res:      Response
}

export interface LoginResult {
  message:   string
  otpSent:   boolean
  sessionId?: string
  csrfToken?: string
}

export interface VerifyOtpInput {
  email: string
  otp:   string
  role:  Role.MANAGER | Role.TEACHER | Role.STUDENT
  res:   Response
}

export interface VerifyOtpResult {
  message:   string
  sessionId: string
  csrfToken: string
}

export interface SendOtpEmailInput {
  to:        string
  firstName: string
  otp:       string
  role:      string
  expiresIn: number   // minutes
}

export interface SendFirstTimeSetupEmailInput {
  to:        string
  firstName: string
  setupLink: string
  role:      string
}

export interface SendResetPasswordEmailInput {
  to:        string
  firstName: string
  resetLink: string
  role:      string
}
