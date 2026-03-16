import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { WhitelistEmailSchema } from '../validators/admin.validator';
import { Role } from 'src/domain/enums';

type AuthMW = ReturnType<typeof createAuthMiddleware>;

export const createAdminRouter = (
  ctrl: AdminController,
  { authenticate, authorize }: AuthMW,
): Router => {
  const router = Router();

  // All admin routes require authentication + ADMIN role
  router.use(authenticate, authorize(Role.ADMIN));

  /**
   * GET /api/admins/me
   * Own profile — reads userId from JWT
   */
  router.get('/me', ctrl.getProfile);

  /**
   * GET /api/admins
   * List all admin accounts
   */
  router.get('/', ctrl.list);

  /**
   * GET /api/admins/:id
   * View any admin by ID
   */
  router.get('/:id', ctrl.getById);

  /**
   * DELETE /api/admins/:id
   * Deactivate another admin (cannot deactivate self)
   */
  router.delete('/:id', ctrl.deactivate);

  /**
   * POST /api/admins/whitelist
   * Whitelist a new Gmail so they can log in via Google OAuth
   * Body: { email: "newadmin@gmail.com" }
   */
  router.post(
    '/whitelist',
    validate(WhitelistEmailSchema),
    ctrl.whitelistEmail,
  );

  return router;
};