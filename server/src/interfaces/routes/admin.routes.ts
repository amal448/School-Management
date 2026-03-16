
import { Router } from 'express';
import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { Role } from 'src/domain/enums';
import { StudentController } from '../controllers/student.controller';

type AuthMW = ReturnType<typeof createAuthMiddleware>;


// ── Student Router ─────────────────────────────────────
export const createStudentRouter = (ctrl: StudentController, { authenticate, authorize }: AuthMW): Router => {
    const router = Router();

    // Admin-only routes (CRUD on managers)
    router.post('/', authenticate, authorize(Role.ADMIN), ctrl.register);
    router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.remove);
    router.get('/', authenticate, authorize(Role.ADMIN, Role.MANAGER), ctrl.list);
    router.get('/:id', authenticate, authorize(Role.ADMIN, Role.MANAGER), ctrl.getById);
    return router;
};
