import { WinstonLogger } from 'src/infrastructure/services'
import { MongooseDepartmentRepository } from 'src/infrastructure/repositories/department.repository'
import { MongooseSubjectRepository } from 'src/infrastructure/repositories/subject.repository'
import { MongooseClassRepository } from 'src/infrastructure/repositories/class.repository'


import { DepartmentController } from 'src/interfaces/controllers/department.controller'

import { Router } from 'express'
import { CreateDepartmentUseCase } from 'src/application/use-cases/department/createdepartment.use-case'
import { GetDepartmentUseCase } from 'src/application/use-cases/department/getdepartmentId.use-case'
import { ListDepartmentsUseCase } from 'src/application/use-cases/department/listdepartment.usecase'
import { UpdateDepartmentUseCase } from 'src/application/use-cases/department/updatedepartment.use-case'
import { DeleteDepartmentUseCase } from 'src/application/use-cases/department/deletedepartment.use-case'
import { DeleteSubjectUseCase } from 'src/application/use-cases/subject/delete-subject.usecase'
import { UpdateSubjectUseCase } from 'src/application/use-cases/subject/update-subject.usecase'
import { ListSubjectsUseCase } from 'src/application/use-cases/subject/list-subjects.usecase'
import { GetSubjectUseCase } from 'src/application/use-cases/subject/get-subject.usecase'
import { CreateSubjectUseCase } from 'src/application/use-cases/subject/create-subject.use-cases'
import { CreateClassUseCase } from 'src/application/use-cases/class/create-class.usecase'
import { GetClassUseCase } from 'src/application/use-cases/class/get-class.usecase'
import { ListClassesUseCase } from 'src/application/use-cases/class/list-classes.usecase'
import { UpdateClassUseCase } from 'src/application/use-cases/class/update-class.usecase'
import { AllocateSubjectUseCase } from 'src/application/use-cases/class/allocate-subject.usecase'
import { RemoveSubjectAllocationUseCase } from 'src/application/use-cases/class/remove-subject.usecase'
import { DeleteClassUseCase } from 'src/application/use-cases/class/delete-class.usecase'
import { createDepartmentRouter } from 'src/interfaces/routes/department.routes'
import { SubjectController } from 'src/interfaces/controllers/subject.controller'
import { ClassController } from 'src/interfaces/controllers/class.controller'
import { createSubjectRouter } from 'src/interfaces/routes/subject.routes'
import { createClassRouter } from 'src/interfaces/routes/class.routes'
import { AssignSubjectTeacherUseCase } from 'src/application/use-cases/class/assign-subject-teacher.use-case'

export function buildAcademicModule(
  logger: WinstonLogger,
  authMW: any,
): {
  departmentRouter: Router
  subjectRouter: Router
  classRouter: Router
} {
  // ── Repos ──────────────────────────────────────────
  const deptRepo = new MongooseDepartmentRepository()
  const subjectRepo = new MongooseSubjectRepository()
  const classRepo = new MongooseClassRepository()

  // ── Department use cases ───────────────────────────
  const deptController = new DepartmentController(
    new CreateDepartmentUseCase(deptRepo, logger),
    new GetDepartmentUseCase(deptRepo),
    new ListDepartmentsUseCase(deptRepo),
    new UpdateDepartmentUseCase(deptRepo, logger),
    new DeleteDepartmentUseCase(deptRepo, logger),
  )

  // ── Subject use cases ──────────────────────────────
  const subjectController = new SubjectController(
    new CreateSubjectUseCase(subjectRepo, deptRepo, logger),
    new GetSubjectUseCase(subjectRepo),
    new ListSubjectsUseCase(subjectRepo),
    new UpdateSubjectUseCase(subjectRepo, logger),
    new DeleteSubjectUseCase(subjectRepo, logger),
  )

  // ── Class use cases ────────────────────────────────
  const classController = new ClassController(
    new CreateClassUseCase(classRepo, logger),
    new GetClassUseCase(classRepo),
    new ListClassesUseCase(classRepo),
    new UpdateClassUseCase(classRepo, logger),
    new AllocateSubjectUseCase(classRepo, logger),
    new RemoveSubjectAllocationUseCase(classRepo, logger),
    new AssignSubjectTeacherUseCase(classRepo, logger),
    new DeleteClassUseCase(classRepo, logger),
  )

  return {
    departmentRouter: createDepartmentRouter(deptController, authMW),
    subjectRouter: createSubjectRouter(subjectController, authMW),
    classRouter: createClassRouter(classController, authMW),
  }
}