// src/interfaces/adapters/di/index.ts
import { WinstonLogger, BcryptPasswordHasher, JwtTokenService } from 'src/infrastructure/services'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { createErrorHandler } from 'src/interfaces/middlewares/error-handler.middleware'
import { buildAdminModule } from './admin'
import { buildManagerModule } from './manager'
import { buildTeacherModule } from './teacher'
import { buildStudentModule } from './student'
import { buildAuthModule } from './auth'
import { Router } from 'express'
import { buildAcademicModule } from './academic'
import { buildExamModule } from './exam'

export interface AppDependencies {
  authRouter: Router
  adminRouter: Router
  managerRouter: Router
  teacherRouter: Router
  studentRouter: Router
  departmentRouter:  Router    
  subjectRouter:     Router    
  classRouter:       Router    
  examRouter:        Router 
  errorHandler: ReturnType<typeof createErrorHandler>
  logger: WinstonLogger
}

export function buildDependencies(): AppDependencies {
  // 1. Core singletons
  const logger = new WinstonLogger()
  const passwordHasher = new BcryptPasswordHasher()
  const tokenService = new JwtTokenService()
  const authMW = createAuthMiddleware(tokenService)

  // 2. Domain modules — each returns { repo, router }
  const manager = buildManagerModule( passwordHasher, logger, authMW)
  const teacher = buildTeacherModule(passwordHasher, logger, authMW)
  const student = buildStudentModule(passwordHasher, logger, authMW)
  const academic = buildAcademicModule(logger, authMW)
  const admin = buildAdminModule(tokenService, logger, authMW, manager.repo)
  const exam = buildExamModule(logger, authMW)
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
    authRouter: auth.router,
    adminRouter: admin.router,
    managerRouter: manager.router,
    teacherRouter: teacher.router,
    studentRouter: student.router,
    errorHandler: createErrorHandler(logger),
    departmentRouter: academic.departmentRouter,
    subjectRouter: academic.subjectRouter,
    classRouter: academic.classRouter,
    examRouter: exam.router,
    logger,
  }
}