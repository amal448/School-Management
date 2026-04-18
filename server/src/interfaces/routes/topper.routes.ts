import { Router }               from 'express'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { Role }                 from 'src/domain/enums'
import { TopperController }     from 'src/interfaces/controllers/topper.controller'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createTopperRouter = (
  ctrl:   TopperController,
  authMW: AuthMW,
): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW
  const adminManager = [authenticate, authorize(Role.ADMIN, Role.MANAGER)]

  // ── Public ────────────────────────────────────────
  router.get('/public',        ctrl.listPublic)
  // router.get('/public/:grade', ctrl.listPublicByGrade)

  // ── Protected ─────────────────────────────────────
  router.get('/',                  adminManager, ctrl.list)
  router.post('/',                 adminManager, ctrl.create)
  router.patch('/:id',             adminManager, ctrl.update)
  router.patch('/:id/publish',     adminManager, ctrl.publish)
  router.patch('/:id/unpublish',   adminManager, ctrl.unpublish)
  router.delete('/:id',            adminManager, ctrl.remove)

  return router
}