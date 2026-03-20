// src/interfaces/adapters/di/auth.ts
import { WinstonLogger, BcryptPasswordHasher, JwtTokenService, NodemailerService } from 'src/infrastructure/services'
import { OtpService } from 'src/infrastructure/services/otp.service'
import { MongooseManagerRepository } from 'src/infrastructure/repositories/manager.repository'
import { MongooseTeacherRepository } from 'src/infrastructure/repositories/teacher.repository'
import { MongooseStudentRepository } from 'src/infrastructure/repositories/student.repository'
import { MongooseAdminRepository } from 'src/infrastructure/repositories/admin.repository'

import { LoginUseCase }               from 'src/application/use-cases/auth/login.use-case'
import { VerifyOtpUseCase }           from 'src/application/use-cases/auth/verify-otp.use-case'
import { LogoutUseCase }              from 'src/application/use-cases/auth/logout.use-case'
import { ChangePasswordUseCase }      from 'src/application/use-cases/auth/change-password.use-case'
import { RefreshTokenUseCase }        from 'src/application/use-cases/auth/refresh-token.use-case'
import { ForgotPasswordUseCase }      from 'src/application/use-cases/auth/forgot-password.use-case'
import { ResetPasswordUseCase }       from 'src/application/use-cases/auth/reset-password.use-case'
import { FirstTimeSetupUseCase }      from 'src/application/use-cases/auth/first-time-setup.use-case'
import { StudentResetPasswordUseCase } from 'src/application/use-cases/auth/student-reset-password.use-case'

import { AuthController } from 'src/interfaces/controllers/auth.controller'
import { createAuthRouter } from 'src/interfaces/routes/auth.routes'
import { Router } from 'express'

export function buildAuthModule(
  adminRepo:      MongooseAdminRepository,
  managerRepo:    MongooseManagerRepository,
  teacherRepo:    MongooseTeacherRepository,
  studentRepo:    MongooseStudentRepository,
  tokenService:   JwtTokenService,
  passwordHasher: BcryptPasswordHasher,
  logger:         WinstonLogger,
  authMW:         any,
): { router: Router } {

  const otpService = new OtpService()
  const emailService=new NodemailerService()

  // ── Use cases ────────────────────────────────────
  const loginUseCase          = new LoginUseCase(managerRepo, teacherRepo, studentRepo, passwordHasher, tokenService, otpService,emailService, logger)
  const verifyOtpUseCase      = new VerifyOtpUseCase( managerRepo,teacherRepo, tokenService, otpService, logger)
  const logoutUseCase         = new LogoutUseCase(tokenService, logger)
  const changePasswordUseCase = new ChangePasswordUseCase(managerRepo, teacherRepo, studentRepo, passwordHasher, logger)
  const refreshTokenUseCase   = new RefreshTokenUseCase(tokenService, logger)
  const forgotPasswordUseCase = new ForgotPasswordUseCase( managerRepo,teacherRepo,otpService,emailService, logger)
  const resetPasswordUseCase  = new ResetPasswordUseCase( managerRepo, passwordHasher, otpService, logger)
  const firstTimeSetupUseCase = new FirstTimeSetupUseCase(teacherRepo, studentRepo, passwordHasher, otpService, logger)
  const studentResetUseCase   = new StudentResetPasswordUseCase(studentRepo, passwordHasher, otpService, logger)

  // ── Controller ───────────────────────────────────
  const controller = new AuthController(
    loginUseCase,
    verifyOtpUseCase,
    logoutUseCase,
    changePasswordUseCase,
    refreshTokenUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
    firstTimeSetupUseCase,
    studentResetUseCase,
  )

  const router = createAuthRouter(controller, authMW)
  return { router }
}