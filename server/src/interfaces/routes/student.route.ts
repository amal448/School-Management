
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
  router.post('/', authenticate, authorize(Role.ADMIN, Role.MANAGER,Role.TEACHER), validate(RegisterStudentSchema), ctrl.register,);
  router.get('/', authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER), validate(StudentQuerySchema, 'query'), ctrl.list,);
  router.get('/:id', authenticate, authorize(Role.MANAGER, Role.TEACHER, Role.STUDENT), ctrl.getById,);
  // Ensure teacher can read students (filtered by classId)
  router.get('/', authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER),   // ← teacher includedctrl.list,
  )
  router.get('/:id', authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER),   // ← teacher includedctrl.getById,
  )

  router.patch('/:id', authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.STUDENT), validate(UpdateStudentSchema), ctrl.update,);
  router.delete('/:id', authenticate, authorize(Role.ADMIN, Role.MANAGER), ctrl.remove,);

  return router;
};
