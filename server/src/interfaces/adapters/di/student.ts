import { StudentController } from 'src/interfaces/controllers/student.controller';
import { createStudentRouter } from 'src/interfaces/routes/student.route';
import {DeleteStudentUseCase} from '../../../application/use-cases/student/student.delete.use-case';
import {GetStudentUseCase} from '../../../application/use-cases/student/student.get.use-case';
import {ListStudentsUseCase} from '../../../application/use-cases/student/student.list.use-case';
import {RegisterStudentUseCase} from '../../../application/use-cases/student/student.register.use-case';
import {UpdateStudentUseCase} from '../../../application/use-cases/student/student.update.use-case';
import { MongooseStudentRepository } from 'src/infrastructure/repositories/student.repository';
import { BcryptPasswordHasher, JwtTokenService, WinstonLogger } from 'src/infrastructure/services';


export function buildStudentModule(
  tokenService: JwtTokenService,
  passwordHasher: BcryptPasswordHasher,
  logger: WinstonLogger,
  authMW: any
) {
  const repo = new MongooseStudentRepository();

  const controller = new StudentController(
    new RegisterStudentUseCase(repo, passwordHasher, logger),
    new GetStudentUseCase(repo),
    new ListStudentsUseCase(repo),
    new UpdateStudentUseCase(repo, logger),
    new DeleteStudentUseCase(repo, logger)
  );

  return { repo, router: createStudentRouter(controller, authMW) };
}