
import { Router } from 'express';

import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { ManagerController } from '../controllers/manager.controller';
import { Role } from 'src/domain/enums';
import { TeacherController } from '../controllers/teacher.controller';
import { AssignDeptSchema, RegisterTeacherSchema, TeacherQuerySchema, UpdateTeacherSchema } from '../validators';

type AuthMW = ReturnType<typeof createAuthMiddleware>;


export const createTeacherRouter = (ctrl: TeacherController, { authenticate, authorize }: AuthMW): Router => {
  const router = Router();

  /** POST /api/teachers              — Manager: create a teacher account */
  router.post('/',
    authenticate, authorize(Role.MANAGER,Role.ADMIN),
    validate(RegisterTeacherSchema),
    ctrl.register,
  );

  /** GET /api/teachers               — Manager: list with filters + pagination */
  router.get('/',
    authenticate, authorize(Role.MANAGER,Role.ADMIN),
    validate(TeacherQuerySchema, 'query'),
    ctrl.list,
  );

  /** GET /api/teachers/:id           — Manager or self */
  router.get('/:id',
    authenticate, authorize(Role.MANAGER, Role.TEACHER,Role.ADMIN),
    ctrl.getById,
  );

  /** PATCH /api/teachers/:id         — Manager or self */
  router.patch('/:id',
    authenticate, authorize(Role.MANAGER, Role.TEACHER,Role.ADMIN),
    validate(UpdateTeacherSchema),
    ctrl.update,
  );

  /** PATCH /api/teachers/:id/department — Manager: assign to dept */
  router.patch('/:id/department',
    authenticate, authorize(Role.MANAGER,Role.ADMIN),
    validate(AssignDeptSchema),
    ctrl.assignDept,
  );

  /** DELETE /api/teachers/:id        — Manager: soft-delete */
  router.delete('/:id',
    authenticate, authorize(Role.MANAGER,Role.ADMIN),
    ctrl.remove,
  );

  return router;
};
