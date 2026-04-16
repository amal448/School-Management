import { WinstonLogger, BcryptPasswordHasher, JwtTokenService } from 'src/infrastructure/services'
import { createAuthMiddleware }  from 'src/interfaces/middlewares/auth.middleware'
import { errorHandler }          from 'src/interfaces/middlewares/error-handler.middleware'  // ← direct import
import { buildAdminModule }      from './admin'
import { buildManagerModule }    from './manager'
import { buildTeacherModule }    from './teacher'
import { buildStudentModule }    from './student'
import { buildAuthModule }       from './auth'
import { buildAcademicModule }   from './academic'
import { buildExamModule }       from './exam'

import { Router, RequestHandler, ErrorRequestHandler } from 'express'
import { buildAnnouncementModule } from './announcement'

export interface AppDependencies {
  authRouter:       Router
  adminRouter:      Router
  managerRouter:    Router
  teacherRouter:    Router
  studentRouter:    Router
  departmentRouter: Router
  subjectRouter:    Router
  classRouter:      Router
  examRouter:       Router
  announcementRouter: Router
  errorHandler:     ErrorRequestHandler   // ← correct type
  logger:           WinstonLogger
}

export function buildDependencies(): AppDependencies {
  const logger        = new WinstonLogger()
  const passwordHasher = new BcryptPasswordHasher()
  const tokenService  = new JwtTokenService()
  const authMW        = createAuthMiddleware(tokenService)

  const manager = buildManagerModule(passwordHasher, logger, authMW)
  const teacher = buildTeacherModule(passwordHasher, logger, authMW)
  const student = buildStudentModule(passwordHasher, logger, authMW)
  const academic = buildAcademicModule(logger, authMW)
  const admin   = buildAdminModule(tokenService, logger, authMW, manager.repo)
  const exam    = buildExamModule(logger, authMW)
  const auth    = buildAuthModule(
    admin.repo,
    manager.repo,
    teacher.repo,
    student.repo,
    tokenService,
    passwordHasher,
    logger,
    authMW,
  )
const announcement = buildAnnouncementModule(logger, authMW)
  return {
    authRouter:       auth.router,
    adminRouter:      admin.router,
    managerRouter:    manager.router,
    teacherRouter:    teacher.router,
    studentRouter:    student.router,
    departmentRouter: academic.departmentRouter,
    subjectRouter:    academic.subjectRouter,
    classRouter:      academic.classRouter,
    announcementRouter: announcement.router,
    examRouter:       exam.router,
    errorHandler,     // ← pass directly, no factory call
    logger,
  }
}