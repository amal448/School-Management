
import { Router } from 'express';

import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { ManagerController } from '../controllers/manager.controller';
import { Role } from 'src/domain/enums';
import { RegisterManagerSchema, UpdateManagerSchema } from '../validators';

type AuthMW = ReturnType<typeof createAuthMiddleware>;


export const createManagerRouter = (ctrl: ManagerController, { authenticate, authorize }: AuthMW): Router => {
  const router = Router();

  /** POST /api/managers/register     — Public: first-time manager setup */
  router.post('/register',    validate(RegisterManagerSchema),                              ctrl.register);

  /** GET  /api/managers/:id          — Authenticated manager only */
  router.get('/:id',          authenticate, authorize(Role.MANAGER),                       ctrl.getById);

  /** PATCH /api/managers/:id         — Authenticated manager (own profile) */
  router.patch('/:id',        authenticate, authorize(Role.MANAGER), validate(UpdateManagerSchema), ctrl.update);

  /** DELETE /api/managers/:id        — Authenticated manager */
  router.delete('/:id',       authenticate, authorize(Role.MANAGER),                       ctrl.remove);

  return router;
};
