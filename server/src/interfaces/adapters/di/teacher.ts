
import { MongooseTeacherRepository } from 'src/infrastructure/repositories/teacher.repository';
import {AssignTeacherDeptUseCase} from '../../../application/use-cases/teacher/teacher-assign.use-case';
import {DeleteTeacherUseCase} from '../../../application/use-cases/teacher/teacher-delete.use-case';
import {GetTeacherUseCase} from '../../../application/use-cases/teacher/teacher-get.use-case';
import {ListTeachersUseCase} from '../../../application/use-cases/teacher/teacher-list.use-case';
import {RegisterTeacherUseCase} from '../../../application/use-cases/teacher/teacher-register.use-case';
import {UpdateTeacherUseCase} from '../../../application/use-cases/teacher/teacher-update.use-case';

import { createTeacherRouter } from '../../routes/teacher.routes';
import { TeacherController } from 'src/interfaces/controllers/teacher.controller';
import { BcryptPasswordHasher, JwtTokenService, WinstonLogger } from 'src/infrastructure/services';

export function buildTeacherModule(
  passwordHasher: BcryptPasswordHasher,
  logger: WinstonLogger,
  authMW: any
) {
  const repo = new MongooseTeacherRepository();

  const useCases = {
    register: new RegisterTeacherUseCase(repo, passwordHasher, logger),
    get: new GetTeacherUseCase(repo),
    list: new ListTeachersUseCase(repo),
    update: new UpdateTeacherUseCase(repo, logger),
    assignDept: new AssignTeacherDeptUseCase(repo, logger),
    delete: new DeleteTeacherUseCase(repo, logger),
  };

  const controller = new TeacherController(
    useCases.register, useCases.get, useCases.list,
    useCases.update, useCases.assignDept, useCases.delete
  );

  const router = createTeacherRouter(controller, authMW);

  return { repo, router };
}