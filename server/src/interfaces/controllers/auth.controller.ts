// src/interfaces/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express'
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case'
import { VerifyOtpUseCase } from 'src/application/use-cases/auth/verify-otp.use-case'
import { LogoutUseCase } from 'src/application/use-cases/auth/logout.use-case'
import { ChangePasswordUseCase } from 'src/application/use-cases/auth/change-password.use-case'
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/refresh-token.use-case'
import { ForgotPasswordUseCase } from 'src/application/use-cases/auth/forgot-password.use-case'
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/reset-password.use-case'
import { FirstTimeSetupUseCase } from 'src/application/use-cases/auth/first-time-setup.use-case'
import { StudentResetPasswordUseCase } from 'src/application/use-cases/auth/student-reset-password.use-case'
import { Role } from 'src/domain/enums'

export class AuthController {
  constructor(
    private readonly loginUseCase:               LoginUseCase,
    private readonly verifyOtpUseCase:           VerifyOtpUseCase,
    private readonly logoutUseCase:              LogoutUseCase,
    private readonly changePasswordUseCase:      ChangePasswordUseCase,
    private readonly refreshTokenUseCase:        RefreshTokenUseCase,
    private readonly forgotPasswordUseCase:      ForgotPasswordUseCase,
    private readonly resetPasswordUseCase:       ResetPasswordUseCase,
    private readonly firstTimeSetupUseCase:      FirstTimeSetupUseCase,
    private readonly studentResetPasswordUseCase: StudentResetPasswordUseCase,
  ) {}

  // POST /api/auth/login
  // Manager → cookies set immediately
  // Teacher/Student → OTP sent, no cookies yet
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute({
        email:    req.body.email,
        password: req.body.password,
        role:     req.body.role,
        req,
        res,
      })
      res.status(200).json({ success: true, ...result })
    } catch (err) { next(err) }
  }

  // POST /api/auth/verify-otp
  // Teacher/Student only — after this, cookies are set
  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.verifyOtpUseCase.execute({
        email: req.body.email,
        otp:   req.body.otp,
        role:  req.body.role as Role.TEACHER | Role.STUDENT,
        res,
      })
      res.status(200).json({ success: true, ...result })
    } catch (err) { next(err) }
  }

  // POST /api/auth/refresh
  // Reads refreshToken cookie, issues new accessToken cookie silently
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.refreshTokenUseCase.execute(req, res)
      res.status(200).json({ success: true, message: 'Token refreshed' })
    } catch (err) { next(err) }
  }

  // POST /api/auth/logout  — requires authenticate + verifyCsrf
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.logoutUseCase.execute(req.user!.userId, res)
      res.status(200).json({ success: true, message: 'Logged out successfully' })
    } catch (err) { next(err) }
  }

  // POST /api/auth/change-password  — requires authenticate + verifyCsrf
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.changePasswordUseCase.execute({
        userId:          req.user!.userId,
        role:            req.user!.role as Role,
        currentPassword: req.body.currentPassword,
        newPassword:     req.body.newPassword,
      })
      res.status(200).json({ success: true, message: 'Password changed successfully' })
    } catch (err) { next(err) }
  }

  // POST /api/auth/forgot-password  — public
  // Admin and Manager only — students go through manager
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.forgotPasswordUseCase.execute({
        email: req.body.email,
        role:  req.body.role as Role.ADMIN | Role.MANAGER,
      })
      // Always return same message (prevent email enumeration)
      res.status(200).json({
        success: true,
        message: 'If your email is registered, a reset link has been sent. Valid for 15 minutes.',
      })
    } catch (err) { next(err) }
  }

  // POST /api/auth/reset-password  — public (token from email)
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.resetPasswordUseCase.execute({
        token:       req.body.token,
        role:        req.body.role as Role.ADMIN | Role.MANAGER,
        newPassword: req.body.newPassword,
      })
      res.status(200).json({ success: true, message: 'Password reset successfully. Please login.' })
    } catch (err) { next(err) }
  }

  // POST /api/auth/first-time-setup  — public (token from email)
  // Teacher/Student sets password for first time using token sent by manager
  firstTimeSetup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.firstTimeSetupUseCase.execute({
        token:       req.body.token,
        role:        req.body.role as Role.TEACHER | Role.STUDENT,
        newPassword: req.body.newPassword,
      })
      res.status(200).json({
        success: true,
        message: 'Password set successfully. You can now login.',
      })
    } catch (err) { next(err) }
  }

  // POST /api/auth/student-reset-password  — requires authenticate + verifyCsrf
  // Manager or Teacher resets a student's password
  studentResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.studentResetPasswordUseCase.execute({
        studentId:     req.params.studentId,
        requesterId:   req.user!.userId,
        requesterRole: req.user!.role as Role.MANAGER | Role.TEACHER,
      })
      res.status(200).json({
        success: true,
        message: 'Student password reset. Send them the setup link.',
        data: result,
      })
    } catch (err) { next(err) }
  }

  // GET /api/auth/me  — requires authenticate
  me = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ success: true, data: { user: req.user } })
  }
}