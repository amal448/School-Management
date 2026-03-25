import { Router }               from 'express'
import { ClassController }      from 'src/interfaces/controllers/class.controller'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate }             from 'src/interfaces/middlewares/validate.middleware'
import { Role }                 from 'src/domain/enums'
import { CreateClassSchema, UpdateClassSchema } from '../validators/class.validator'
import { AllocateSubjectSchema } from '../validators/subject.validator'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createClassRouter = (
  ctrl:   ClassController,
  authMW: AuthMW,
): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW
  const guard = [authenticate, authorize(Role.ADMIN, Role.MANAGER)]

  router.post  ('/',                        ...guard, validate(CreateClassSchema),     ctrl.create)
  router.get   ('/',                        ...guard, ctrl.list)
  router.get   ('/:id',                     ...guard, ctrl.getById)
  router.patch ('/:id',                     ...guard, validate(UpdateClassSchema),     ctrl.update)
  router.delete('/:id',                     ...guard, ctrl.delete)
  router.post  ('/:id/subjects',            ...guard, validate(AllocateSubjectSchema), ctrl.allocateSubject)
  router.delete('/:id/subjects/:subjectId', ...guard, ctrl.removeSubjectAllocation)

  return router
}