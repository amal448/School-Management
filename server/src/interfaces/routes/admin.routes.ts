// src/interfaces/routes/admin.routes.ts
import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { createAuthMiddleware } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { WhitelistEmailSchema } from '../validators/admin.validator'
import { Role } from 'src/domain/enums'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createAdminRouter = (
  ctrl: AdminController,
  { authenticate, authorize }: AuthMW,
): Router => {
  const router = Router()

  // All routes require ADMIN role
  router.use(authenticate, authorize(Role.ADMIN))

  /** GET  /api/admins/me                   — Own profile */
  router.get('/me', ctrl.getProfile)

  /** GET  /api/admins                      — List all admins */
  router.get('/', ctrl.list)

  /** DELETE /api/admins/:id                — Deactivate another admin */
  router.delete('/:id', ctrl.deactivate)

  /** POST /api/admins/whitelist            — Whitelist email (admin or manager role) */
  router.post('/whitelist', validate(WhitelistEmailSchema), ctrl.whitelistEmail)

  /** DELETE /api/admins/whitelist/:email   — Remove from whitelist */
  router.delete('/whitelist/:email', ctrl.removeWhitelist)

  /** PATCH /api/admins/managers/:id/block   — Block a manager */
  router.patch('/managers/:id/block', ctrl.blockManager)

  /** PATCH /api/admins/managers/:id/unblock — Unblock a manager */
  router.patch('/managers/:id/unblock', ctrl.unblockManager)

  return router
}