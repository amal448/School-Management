// src/interfaces/validators/auth.validator.ts  (add these)
import { z } from 'zod'
import { Role } from 'src/domain/enums'

const passwordSchema = z
  .string()
  .min(8)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Password must include uppercase, lowercase, number and special character'
  )

export const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
  role:     z.nativeEnum(Role),
})

export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp:   z.string().length(6, 'OTP must be 6 digits'),
  role:  z.enum([Role.TEACHER, Role.STUDENT]),
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     passwordSchema,
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
  role:  z.enum([Role.MANAGER]),
})

export const ResetPasswordSchema = z.object({
  token:       z.string().min(1),
  role:        z.enum([Role.MANAGER]),
  newPassword: passwordSchema,
})

export const FirstTimeSetupSchema = z.object({
  token:       z.string().min(1),
  role:        z.enum([Role.TEACHER, Role.STUDENT]),
  newPassword: passwordSchema,
})