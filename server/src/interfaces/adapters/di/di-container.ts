// src/interfaces/adapters/di/index.ts
import { WinstonLogger, BcryptPasswordHasher, JwtTokenService } from '../../../infrastructure/services';
import { createAuthMiddleware } from '../../middlewares/auth.middleware';
import { createErrorHandler } from '../../middlewares/error-handler.middleware';

import { buildTeacherModule } from './teacher';
import { buildStudentModule } from './student';
import { buildManagerModule } from './manager';
import { buildAuthModule } from './auth'; // Import the new auth module
import { Router } from 'express';

export interface AppDependencies {
  authRouter: Router;
  managerRouter: Router;
  teacherRouter: Router;
  studentRouter: Router;
  errorHandler: ReturnType<typeof createErrorHandler>;
  logger: WinstonLogger;
}

export function buildDependencies(): AppDependencies {
  // 1. Core Services (Singletons)
  const logger = new WinstonLogger();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();
  const authMW = createAuthMiddleware(tokenService);

  // 2. Initialize Domain Modules
  // It calls buildManagerModule(...). It gives that module the tools it needs and receives back two things:
  // The Router: To be used by Express.
  // The Repo: To be shared with the Auth Module.
  const manager = buildManagerModule(tokenService, passwordHasher, logger, authMW);
  const teacher = buildTeacherModule(tokenService, passwordHasher, logger, authMW);
  const student = buildStudentModule(tokenService, passwordHasher, logger, authMW);

  // 3. Initialize Auth (Orchestrates all 3 repos)
  const auth = buildAuthModule(
    manager.repo,
    teacher.repo,
    student.repo,
    tokenService,
    passwordHasher,
    logger,
    authMW
  );

  return {
    authRouter: auth.router,
    managerRouter: manager.router,
    teacherRouter: teacher.router,
    studentRouter: student.router,
    errorHandler: createErrorHandler(logger),
    logger
  };
}