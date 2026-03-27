import { Router }                from 'express'
import { DepartmentController }  from 'src/interfaces/controllers/department.controller'
import { createAuthMiddleware }  from 'src/interfaces/middlewares/auth.middleware'
import { validate }              from 'src/interfaces/middlewares/validate.middleware'
import { Role }                  from 'src/domain/enums'
import { CreateDepartmentSchema, UpdateDepartmentSchema } from '../validators/department.validator'


type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createDepartmentRouter = (
  ctrl:   DepartmentController,
  authMW: AuthMW,
): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW

  // Admin + Manager both can manage departments

  router.post  ('/',   [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(CreateDepartmentSchema), ctrl.create)
  router.get   ('/',   [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.list)
  router.get   ('/:id',[authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.getById)
  router.patch ('/:id',[authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(UpdateDepartmentSchema), ctrl.update)
  router.delete('/:id',[authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.delete)

  return router
}