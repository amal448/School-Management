// src/interfaces/adapters/di/auth.ts
import { BcryptPasswordHasher, JwtTokenService, WinstonLogger } from '../../../infrastructure/services';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/refresh-token.use-case';
import { ChangePasswordUseCase } from '../../../application/use-cases/auth/change-password.use-case';
import { AuthController } from '../../controllers/auth.controller';
import { createAuthRouter } from '../../routes/auth.routes';
import { MongooseManagerRepository } from 'src/infrastructure/repositories/manager.repository';
import { MongooseTeacherRepository } from 'src/infrastructure/repositories/teacher.repository';
import { MongooseStudentRepository } from 'src/infrastructure/repositories/student.repository';

export function buildAuthModule(
  
  managerRepo: MongooseManagerRepository,
  teacherRepo: MongooseTeacherRepository,
  studentRepo: MongooseStudentRepository,
  tokenService: JwtTokenService,
  passwordHasher: BcryptPasswordHasher,
  logger: WinstonLogger,
  authMW: any
) {
  const loginUseCase = new LoginUseCase(
    managerRepo, teacherRepo, studentRepo,
    passwordHasher, tokenService, logger
  );

  const refreshTokenUseCase = new RefreshTokenUseCase(
    managerRepo, teacherRepo, studentRepo,
    tokenService, logger
  );

  const changePasswordUseCase = new ChangePasswordUseCase(
    managerRepo, teacherRepo, studentRepo,
    passwordHasher, logger
  );

  const controller = new AuthController(
    loginUseCase,
    refreshTokenUseCase,
    changePasswordUseCase
  );

  const router = createAuthRouter(controller, authMW);

  return { router };
}