
import { Router } from 'express';

import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from 'src/domain/enums';
import { StudentController } from '../controllers/student.controller';
import { AssignClassSchema, RegisterStudentSchema, StudentQuerySchema, UpdateStudentSchema } from '../validators';

type AuthMW = ReturnType<typeof createAuthMiddleware>;


// ── Student Router ─────────────────────────────────────
export const createStudentRouter = (ctrl: StudentController, { authenticate, authorize }: AuthMW): Router => {
  const router = Router();

  /** POST /api/students              — Manager: enrol a student */
  router.post('/',
    authenticate, authorize(Role.ADMIN,Role.MANAGER),
    validate(RegisterStudentSchema),
    ctrl.register,
  );

  /** GET /api/students               — Manager or Teacher: list with filters */
  router.get('/',
    authenticate, authorize(Role.ADMIN,Role.MANAGER, Role.TEACHER),
    validate(StudentQuerySchema, 'query'),
    ctrl.list,
  );

  /** GET /api/students/:id           — Manager, Teacher, or self */
  router.get('/:id',
    authenticate, authorize(Role.MANAGER, Role.TEACHER, Role.STUDENT),
    ctrl.getById,
  );

  /** PATCH /api/students/:id         — Manager or self */
  router.patch('/:id',
    authenticate, authorize(Role.ADMIN,Role.MANAGER, Role.STUDENT),
    validate(UpdateStudentSchema),
    ctrl.update,
  );

  /** DELETE /api/students/:id        — Manager: soft-delete */
  router.delete('/:id',
    authenticate, authorize(Role.ADMIN,Role.MANAGER),
    ctrl.remove,
  );

  return router;
};
