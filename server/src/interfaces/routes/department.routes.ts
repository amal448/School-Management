import { Router }                from 'express'
import { DepartmentController }  from 'src/interfaces/controllers/department.controller'
import { createAuthMiddleware }  from 'src/interfaces/middlewares/auth.middleware'
import { validate }              from 'src/interfaces/middlewares/validate.middleware'
import { z }                     from 'zod'
import { Role }                  from 'src/domain/enums'

const CreateDepartmentSchema = z.object({
  deptName:    z.string().min(1).max(100),
  deptHeadId:  z.string().optional(),
  description: z.string().optional(),
})

const UpdateDepartmentSchema = z.object({
  deptName:    z.string().min(1).max(100).optional(),
  deptHeadId:  z.string().optional(),
  description: z.string().optional(),
})

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createDepartmentRouter = (
  ctrl:   DepartmentController,
  authMW: AuthMW,
): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW

  // Admin + Manager both can manage departments
  const guard = [authenticate, authorize(Role.ADMIN, Role.MANAGER)]

  router.post  ('/',    ...guard, validate(CreateDepartmentSchema), ctrl.create)
  router.get   ('/',    ...guard, ctrl.list)
  router.get   ('/:id', ...guard, ctrl.getById)
  router.patch ('/:id', ...guard, validate(UpdateDepartmentSchema), ctrl.update)
  router.delete('/:id', ...guard, ctrl.delete)

  return router
}