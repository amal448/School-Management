import { Router }               from 'express'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { Role }                 from 'src/domain/enums'
import { AnnouncementController } from '../controllers/announcement.controller'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createAnnouncementRouter = (
  ctrl:   AnnouncementController,
  authMW: AuthMW,
): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW

  const adminManager = [
    authenticate,
    authorize(Role.ADMIN, Role.MANAGER),
  ]

  // ── Public — no auth ──────────────────────────────
  router.get('/public', ctrl.listPublic)

  // ── Protected ─────────────────────────────────────
  router.get('/',          adminManager, ctrl.list)
  router.post('/',         adminManager, ctrl.create)
  router.patch('/:id',     adminManager, ctrl.update)
  router.patch('/:id/publish',   adminManager, ctrl.publish)
  router.patch('/:id/unpublish', adminManager, ctrl.unpublish)
  router.patch('/:id/pin',       adminManager, ctrl.togglePin)
  router.delete('/:id',  adminManager, ctrl.remove)

  return router
}