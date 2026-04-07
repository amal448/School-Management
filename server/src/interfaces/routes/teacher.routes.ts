// src/interfaces/routes/teacher.routes.ts
import { Router }               from 'express'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate }             from 'src/interfaces/middlewares/validate.middleware'
import { Role }                 from 'src/domain/enums'
import { TeacherController }    from 'src/interfaces/controllers/teacher.controller'
import {
  AssignDeptSchema,
  RegisterTeacherSchema,
  TeacherQuerySchema,
  UpdateTeacherSchema,
} from 'src/interfaces/validators'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createTeacherRouter = (
  ctrl:   TeacherController,
  authMW: AuthMW,
): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW


  router.get('/me',authenticate,authorize(Role.TEACHER),ctrl.getMe,)
  router.get('/me/classes',authenticate,authorize(Role.TEACHER),ctrl.myClasses)

  // ── Standard CRUD ──────────────────────────────────────
  router.post('/',authenticate, authorize(Role.MANAGER, Role.ADMIN),validate(RegisterTeacherSchema),ctrl.register,)
  router.get('/',authenticate, authorize(Role.MANAGER, Role.ADMIN),validate(TeacherQuerySchema, 'query'),ctrl.list,)
  router.get('/:id',authenticate, authorize(Role.MANAGER, Role.TEACHER, Role.ADMIN),ctrl.getById,)
  router.patch('/:id',authenticate, authorize(Role.MANAGER, Role.TEACHER, Role.ADMIN),validate(UpdateTeacherSchema),ctrl.update,)
  router.patch('/:id/department',authenticate, authorize(Role.MANAGER, Role.ADMIN),validate(AssignDeptSchema),ctrl.assignDept,)
  router.delete('/:id',authenticate, authorize(Role.MANAGER, Role.ADMIN),ctrl.remove)

  return router
}