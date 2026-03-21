import { Router }               from 'express'
import { ClassController }      from 'src/interfaces/controllers/class.controller'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate }             from 'src/interfaces/middlewares/validate.middleware'
import { z }                    from 'zod'
import { Role }                 from 'src/domain/enums'

const CreateClassSchema = z.object({
  className:    z.string().min(1).max(20),
  section:      z.string().min(1).max(10),
  academicYear: z.string().min(4).max(10),
  classTeacherId: z.string().optional(),
  subjectAllocations: z.array(z.object({
    subjectId: z.string(),
    teacherId: z.string(),
  })).optional(),
})

const UpdateClassSchema = z.object({
  className:      z.string().min(1).max(20).optional(),
  section:        z.string().min(1).max(10).optional(),
  academicYear:   z.string().min(4).max(10).optional(),
  classTeacherId: z.string().optional(),
})

const AllocateSubjectSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
})

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