// src/interfaces/routes/admin.routes.ts
import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { createAuthMiddleware } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { WhitelistEmailSchema } from '../validators/admin.validator'
import { Role } from 'src/domain/enums'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createAdminRouter = (ctrl: AdminController,{ authenticate, authorize }: AuthMW,): Router => {
  
  const router = Router()
  router.use(authenticate, authorize(Role.ADMIN))
  router.get('/me', ctrl.getProfile)
  router.get('/', ctrl.list)
  router.delete('/:id', ctrl.deactivate)
  router.post('/whitelist', validate(WhitelistEmailSchema), ctrl.whitelistEmail)
  router.delete('/whitelist/:email', ctrl.removeWhitelist)
  router.patch('/managers/:id/block', ctrl.blockManager)
  router.patch('/managers/:id/unblock', ctrl.unblockManager)

  return router
}