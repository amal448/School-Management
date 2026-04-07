
import { MongooseTeacherRepository } from 'src/infrastructure/repositories/teacher.repository';
import { AssignTeacherDeptUseCase } from '../../../application/use-cases/teacher/teacher-assign.use-case';
import { DeleteTeacherUseCase } from '../../../application/use-cases/teacher/teacher-delete.use-case';
import { GetTeacherUseCase } from '../../../application/use-cases/teacher/teacher-get.use-case';
import { ListTeachersUseCase } from '../../../application/use-cases/teacher/teacher-list.use-case';
import { RegisterTeacherUseCase } from '../../../application/use-cases/teacher/teacher-register.use-case';
import { UpdateTeacherUseCase } from '../../../application/use-cases/teacher/teacher-update.use-case';

import { createTeacherRouter } from '../../routes/teacher.routes';
import { TeacherController } from 'src/interfaces/controllers/teacher.controller';
import { BcryptPasswordHasher, JwtTokenService, WinstonLogger } from 'src/infrastructure/services';
import { MongooseClassRepository } from 'src/infrastructure/repositories/class.repository';

export function buildTeacherModule(
  passwordHasher: BcryptPasswordHasher,
  logger: WinstonLogger,
  authMW: any
) {
  const teacherRepo = new MongooseTeacherRepository();
  const classRepo= new MongooseClassRepository()

  const useCases = {
    register: new RegisterTeacherUseCase(teacherRepo, passwordHasher, logger),
    get: new GetTeacherUseCase(teacherRepo),
    list: new ListTeachersUseCase(teacherRepo),
    update: new UpdateTeacherUseCase(teacherRepo, logger),
    assignDept: new AssignTeacherDeptUseCase(teacherRepo, logger),
    delete: new DeleteTeacherUseCase(teacherRepo, logger),
    classRepo
  };

  const controller = new TeacherController(
    useCases.register,
    useCases.get,
    useCases.list,
    useCases.update,
    useCases.assignDept,
    useCases.delete,
    useCases.classRepo
  );

  const router = createTeacherRouter(controller, authMW);

  return { repo:teacherRepo, router };
}