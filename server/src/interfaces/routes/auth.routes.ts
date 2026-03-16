
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { ChangePasswordSchema, LoginSchema, RefreshTokenSchema } from '../validators';

type AuthMW = ReturnType<typeof createAuthMiddleware>;

// ── Auth Router ────────────────────────────────────────
export const createAuthRouter = (ctrl: AuthController, { authenticate }: AuthMW): Router => {
  const router = Router();

  /** POST /api/auth/login            — Public: login with role + credentials */
  router.post('/login',validate(LoginSchema),ctrl.login);

  /** POST /api/auth/refresh          — Public: rotate token pair */
  router.post('/refresh',validate(RefreshTokenSchema),ctrl.refresh);

  /** POST /api/auth/change-password  — Authenticated: any role */
  router.post('/change-password', authenticate, validate(ChangePasswordSchema
    
  ), ctrl.changePassword);

  /** GET  /api/auth/me               — Authenticated: return token payload */
  router.get('/me',authenticate,ctrl.me);

  return router;
};
