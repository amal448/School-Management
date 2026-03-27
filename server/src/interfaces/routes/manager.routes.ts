import { Router } from 'express'
import { ManagerController } from 'src/interfaces/controllers/manager.controller'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate } from 'src/interfaces/middlewares/validate.middleware'
import {
  CreateManagerSchema,
  UpdateManagerSchema,
  ManagerQuerySchema,
} from 'src/interfaces/validators/manager.validator'
import { Role } from 'src/domain/enums/index'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createManagerRouter = (ctrl: ManagerController, { authenticate, authorize }: AuthMW): Router => {
  
  const router = Router()
  router.post('/', authenticate, authorize(Role.ADMIN), validate(CreateManagerSchema), ctrl.create)
  router.get('/', authenticate, authorize(Role.ADMIN), validate(ManagerQuerySchema, 'query'), ctrl.list)
  router.get('/:id', authenticate, authorize(Role.ADMIN, Role.MANAGER), ctrl.getById,)
  router.patch('/:id', authenticate, authorize(Role.ADMIN, Role.MANAGER), validate(UpdateManagerSchema), ctrl.update,)
  router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.remove,
  )

  return router
}