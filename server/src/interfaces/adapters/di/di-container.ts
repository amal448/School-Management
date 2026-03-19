// src/interfaces/adapters/di/index.ts
import { WinstonLogger, BcryptPasswordHasher, JwtTokenService } from 'src/infrastructure/services'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { createErrorHandler } from 'src/interfaces/middlewares/error-handler.middleware'
import { buildAdminModule }   from './admin'
import { buildManagerModule } from './manager'
import { buildTeacherModule } from './teacher'
import { buildStudentModule } from './student'
import { buildAuthModule }    from './auth'
import { Router } from 'express'

export interface AppDependencies {
  authRouter:    Router
  adminRouter:   Router
  managerRouter: Router
  teacherRouter: Router
  studentRouter: Router
  errorHandler:  ReturnType<typeof createErrorHandler>
  logger:        WinstonLogger
}

export function buildDependencies(): AppDependencies {
  // 1. Core singletons
  const logger         = new WinstonLogger()
  const passwordHasher = new BcryptPasswordHasher()
  const tokenService   = new JwtTokenService()
  const authMW         = createAuthMiddleware(tokenService)

  // 2. Domain modules — each returns { repo, router }
  const manager = buildManagerModule(tokenService, passwordHasher, logger, authMW)
  const teacher = buildTeacherModule(tokenService, passwordHasher, logger, authMW)
  const student = buildStudentModule(tokenService, passwordHasher, logger, authMW)

  // 3. Admin module — must come after manager (needs managerRepo for block/unblock)
  //    Also registers passport Google strategy as a side effect
  const admin = buildAdminModule(tokenService, logger, authMW, manager.repo)

  // 4. Auth module — needs all repos + all services
  const auth = buildAuthModule(
    admin.repo,
    manager.repo,
    teacher.repo,
    student.repo,
    tokenService,
    passwordHasher,
    logger,
    authMW,
  )

  return {
    authRouter:    auth.router,
    adminRouter:   admin.router,
    managerRouter: manager.router,
    teacherRouter: teacher.router,
    studentRouter: student.router,
    errorHandler:  createErrorHandler(logger),
    logger,
  }
}
// ```

// ---

// ## Complete Auth Flow Summary
// ```
// ADMIN
// ─────
// Login:    GET /api/auth/google → Google → callback → cookies set → redirect dashboard
// Logout:   POST /api/auth/logout (authenticate + verifyCsrf)
// Password: POST /api/auth/forgot-password → email link
//           POST /api/auth/reset-password  (token from email)
// Change:   POST /api/auth/change-password (authenticate + verifyCsrf)

// MANAGER
// ───────
// Login:    POST /api/auth/login { role: MANAGER } → cookies set immediately
// Logout:   POST /api/auth/logout
// Password: POST /api/auth/forgot-password → email link
//           POST /api/auth/reset-password  (token from email)
// Change:   POST /api/auth/change-password

// TEACHER
// ───────
// Created by manager → firsttime token emailed
// First:    POST /api/auth/first-time-setup { token, role: TEACHER, newPassword }
// Login:    POST /api/auth/login → OTP sent
//           POST /api/auth/verify-otp → cookies set
// Logout:   POST /api/auth/logout
// Password: Cannot self-reset → manager must reset
// Change:   POST /api/auth/change-password (after login)

// STUDENT
// ───────
// Created by manager → firsttime token emailed
// First:    POST /api/auth/first-time-setup { token, role: STUDENT, newPassword }
// Login:    POST /api/auth/login → OTP sent
//           POST /api/auth/verify-otp → cookies set
// Logout:   POST /api/auth/logout
// Password: Manager or Teacher resets via:
//           POST /api/auth/students/:id/reset-password
//           → new firsttime token returned → sent to student
//           Student uses: POST /api/auth/first-time-setup again