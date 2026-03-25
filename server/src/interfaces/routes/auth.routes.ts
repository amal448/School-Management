// src/interfaces/routes/auth.routes.ts
import { Router, Request, Response } from 'express'
import { AuthController } from 'src/interfaces/controllers/auth.controller'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate } from 'src/interfaces/middlewares/validate.middleware'
import {
  LoginSchema,
  VerifyOtpSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  FirstTimeSetupSchema,
} from 'src/interfaces/validators'
import passport from 'passport'
import { Role } from 'src/domain/enums'
import { GoogleAuthResult } from 'src/application/use-cases/auth/google-auth.use-case'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createAuthRouter = (
  ctrl: AuthController,
  { authenticate, authorize, verifyCsrf }: AuthMW,
): Router => {
  const router = Router()

  // ── Google OAuth (Admin only) ──────────────────────

  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false, }))

  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/admin/login?error=oauth_failed` }),
    (req: Request, res: Response) => {
      const result = req.user as unknown as GoogleAuthResult
      // ✅ Redirect to /auth/callback — NOT /admin/dashboard
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?sessionId=${result.sessionId}`)
    }
  )

  router.post('/login', validate(LoginSchema), ctrl.login)
  router.post('/verify-otp', validate(VerifyOtpSchema), ctrl.verifyOtp)
  router.post('/refresh', ctrl.refresh)
  router.post('/logout', authenticate, verifyCsrf, ctrl.logout)
  router.get('/me', authenticate, ctrl.me)
  router.post('/change-password', authenticate, verifyCsrf, validate(ChangePasswordSchema), ctrl.changePassword)
  router.post('/forgot-password', validate(ForgotPasswordSchema), ctrl.forgotPassword,)
  router.post('/reset-password', validate(ResetPasswordSchema), ctrl.resetPassword)
  router.post('/first-time-setup', validate(FirstTimeSetupSchema), ctrl.firstTimeSetup)
  router.post('/students/:studentId/reset-password', authenticate, authorize(Role.MANAGER, Role.TEACHER), verifyCsrf, ctrl.studentResetPassword,
  )

  return router
}