
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
import { MongooseDepartmentRepository } from 'src/infrastructure/repositories/department.repository';
import { MongooseSubjectRepository } from 'src/infrastructure/repositories/subject.repository';
import { GetTeachersBySubjectUseCase } from 'src/application/use-cases/teacher/teacher-get-by-subject.use-case';
import { ListTeacherClassesUseCase } from 'src/application/use-cases/teacher/list-teacher-classes.use-case';
import { GetTeachersByLevelUseCase } from 'src/application/use-cases/teacher/get-teachers-by-level.use-case';

export function buildTeacherModule(
  passwordHasher: BcryptPasswordHasher,
  logger: WinstonLogger,
  authMW: any
) {
  const teacherRepo = new MongooseTeacherRepository();
  const classRepo= new MongooseClassRepository()
  const deptRepo=new MongooseDepartmentRepository()
  const subjectRepo=new MongooseSubjectRepository()
  
  const useCases = {
    register: new RegisterTeacherUseCase(teacherRepo,deptRepo,subjectRepo ,passwordHasher, logger),
    get: new GetTeacherUseCase(teacherRepo),
    list: new ListTeachersUseCase(teacherRepo),
    update: new UpdateTeacherUseCase(teacherRepo, logger),
    assignDept: new AssignTeacherDeptUseCase(teacherRepo, logger),
    delete: new DeleteTeacherUseCase(teacherRepo, logger),
    getBySubject: new GetTeachersBySubjectUseCase(teacherRepo,subjectRepo),
    listTeacherClasses : new ListTeacherClassesUseCase(classRepo),
    getByLevel: new GetTeachersByLevelUseCase(teacherRepo)
  };

  const controller = new TeacherController(
    useCases.register,
    useCases.get,
    useCases.list,
    useCases.update,
    useCases.assignDept,
    useCases.delete,
    useCases.getBySubject,
    useCases.listTeacherClasses,
    useCases.getByLevel
  );

  const router = createTeacherRouter(controller, authMW);

  return { repo:teacherRepo, router };
}