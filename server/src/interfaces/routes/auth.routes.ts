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

  /** GET /api/auth/google
   *  Redirects browser to Google consent screen
   */
  router.get('/google',
    passport.authenticate('google', {
      scope:   ['profile', 'email'],
      session: false,
    })
  )

  /** GET /api/auth/google/callback
   *  Google redirects here after consent
   *  passport runs GoogleStrategy verify → GoogleAuthUseCase
   *  cookies are set inside use case
   *  redirect frontend to dashboard
   */
  router.get('/google/callback',
    passport.authenticate('google', {
      session:          false,
      failureRedirect:  `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    }),
    (req: Request, res: Response) => {
      // req.user contains GoogleAuthResult set by passport strategy
      const result = req.user as unknown as GoogleAuthResult
      // Cookies already set in GoogleAuthUseCase.execute()
      // Redirect to admin dashboard
      res.redirect(
        `${process.env.FRONTEND_URL}/admin/dashboard?sessionId=${result.sessionId}`
      )
    }
  )

  // ── Standard Login ─────────────────────────────────

  /** POST /api/auth/login
   *  Manager   → session + cookies immediately
   *  Teacher   → OTP sent to email, no cookies yet
   *  Student   → OTP sent to email, no cookies yet
   *  Admin     → 400 (use Google OAuth)
   */
  router.post('/login',
    validate(LoginSchema),
    ctrl.login,
  )

  /** POST /api/auth/verify-otp
   *  Teacher / Student only
   *  On success: session + cookies set
   */
  router.post('/verify-otp',
    validate(VerifyOtpSchema),
    ctrl.verifyOtp,
  )

  // ── Token Management ───────────────────────────────

  /** POST /api/auth/refresh
   *  Reads refreshToken cookie silently
   *  Issues new accessToken cookie
   *  Frontend calls this when it gets a 401
   */
  router.post('/refresh', ctrl.refresh)

  /** POST /api/auth/logout
   *  Clears Redis session + all cookies
   */
  router.post('/logout',
    authenticate,
    verifyCsrf,
    ctrl.logout,
  )

  /** GET /api/auth/me
   *  Returns current user from req.user (populated by authenticate)
   */
  router.get('/me', authenticate, ctrl.me)

  // ── Password Management ────────────────────────────

  /** POST /api/auth/change-password
   *  Any authenticated role — changes own password
   */
  router.post('/change-password',
    authenticate,
    verifyCsrf,
    validate(ChangePasswordSchema),
    ctrl.changePassword,
  )

  /** POST /api/auth/forgot-password
   *  Admin + Manager only (students go through manager)
   *  Sends reset link to email
   */
  router.post('/forgot-password',
    validate(ForgotPasswordSchema),
    ctrl.forgotPassword,
  )

  /** POST /api/auth/reset-password
   *  Admin + Manager only
   *  Uses token from email to set new password
   */
  router.post('/reset-password',
    validate(ResetPasswordSchema),
    ctrl.resetPassword,
  )

  /** POST /api/auth/first-time-setup
   *  Teacher + Student only
   *  Uses firsttime token (sent by manager) to set initial password
   */
  router.post('/first-time-setup',
    validate(FirstTimeSetupSchema),
    ctrl.firstTimeSetup,
  )

  /** POST /api/auth/students/:studentId/reset-password
   *  Manager + Teacher only
   *  Resets student password and generates new firsttime token
   */
  router.post('/students/:studentId/reset-password',
    authenticate,
    authorize(Role.MANAGER, Role.TEACHER),
    verifyCsrf,
    ctrl.studentResetPassword,
  )

  return router
}