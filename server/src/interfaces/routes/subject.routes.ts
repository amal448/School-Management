import { Router }               from 'express'
import { SubjectController }    from 'src/interfaces/controllers/subject.controller'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate }             from 'src/interfaces/middlewares/validate.middleware'
import { z }                    from 'zod'
import { Role }                 from 'src/domain/enums'

const CreateSubjectSchema = z.object({
  subjectName: z.string().min(1).max(100),
  deptId:      z.string().min(1, 'Department is required'),
})

const UpdateSubjectSchema = z.object({
  subjectName: z.string().min(1).max(100).optional(),
  deptId:      z.string().optional(),
})

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createSubjectRouter = (
  ctrl:   SubjectController,
  authMW: AuthMW,
): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW
  const guard = [authenticate, authorize(Role.ADMIN, Role.MANAGER)]

  router.post  ('/',    ...guard, validate(CreateSubjectSchema), ctrl.create)
  router.get   ('/',    ...guard, ctrl.list)
  router.get   ('/:id', ...guard, ctrl.getById)
  router.patch ('/:id', ...guard, validate(UpdateSubjectSchema), ctrl.update)
  router.delete('/:id', ...guard, ctrl.delete)

  return router
}