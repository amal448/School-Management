import { Router }            from 'express'
import { ManagerController } from 'src/interfaces/controllers/manager.controller'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate }          from 'src/interfaces/middlewares/validate.middleware'
import {
  CreateManagerSchema,
  UpdateManagerSchema,
  ManagerQuerySchema,
} from 'src/interfaces/validators/manager.validator'
import { Role }              from 'src/domain/enums/index'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createManagerRouter = (
  ctrl: ManagerController,
  { authenticate, authorize }: AuthMW,
): Router => {
  const router = Router()

  /**
   * POST /api/managers
   * Admin only — create a new manager with custom credentials
   */
  router.post(
    '/',
    authenticate,
    authorize(Role.ADMIN),
    validate(CreateManagerSchema),
    ctrl.create,
  )

  /**
   * GET /api/managers
   * Admin only — list all managers with filters
   */
  router.get(
    '/',
    authenticate,
    authorize(Role.ADMIN),
    validate(ManagerQuerySchema, 'query'),
    ctrl.list,
  )

  /**
   * GET /api/managers/:id
   * Admin or self (manager viewing own profile)
   */
  router.get(
    '/:id',
    authenticate,
    authorize(Role.ADMIN, Role.MANAGER),
    ctrl.getById,
  )

  /**
   * PATCH /api/managers/:id
   * Admin or self — update profile
   */
  router.patch(
    '/:id',
    authenticate,
    authorize(Role.ADMIN, Role.MANAGER),
    validate(UpdateManagerSchema),
    ctrl.update,
  )

  /**
   * DELETE /api/managers/:id
   * Admin only — soft delete
   */
  router.delete(
    '/:id',
    authenticate,
    authorize(Role.ADMIN),
    ctrl.remove,
  )

  return router
}