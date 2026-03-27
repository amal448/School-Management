import { Router } from 'express'
import { ClassController } from 'src/interfaces/controllers/class.controller'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate } from 'src/interfaces/middlewares/validate.middleware'
import { Role } from 'src/domain/enums'
import { CreateClassSchema, UpdateClassSchema } from '../validators/class.validator'
import { AllocateSubjectSchema, AssignSubjectTeacherSchema } from '../validators/subject.validator'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createClassRouter = (ctrl: ClassController, authMW: AuthMW,): Router => {

  const router = Router()
  const { authenticate, authorize } = authMW

  router.post('/', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(CreateClassSchema), ctrl.create)
  router.get('/', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.list)
  router.get('/:id', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.getById)
  router.patch('/:id', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(UpdateClassSchema), ctrl.update)
  router.patch('/:id/subjects/:subjectId/teacher',[authenticate, authorize(Role.ADMIN, Role.MANAGER)],validate(AssignSubjectTeacherSchema),ctrl.assignSubjectTeacher)
  router.delete('/:id', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.delete)
  router.post('/:id/subjects', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(AllocateSubjectSchema), ctrl.allocateSubject)
  router.delete('/:id/subjects/:subjectId', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.removeSubjectAllocation)

  return router
}