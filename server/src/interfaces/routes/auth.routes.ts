import { Router, Request, Response } from 'express';  // ✅ add Request, Response here
import { AuthController } from '../controllers/auth.controller';
import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { ChangePasswordSchema, LoginSchema, RefreshTokenSchema } from '../validators';
import passport from 'passport';
import { AuthTokensDto } from 'src/domain/dtos/auth.dto';

type AuthMW = ReturnType<typeof createAuthMiddleware>;

export const createAuthRouter = (ctrl: AuthController, { authenticate }: AuthMW): Router => {
  const router = Router();

  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })
  );

  router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
    (req: Request, res: Response) => {                          // ✅ now resolves to Express types
      const tokens = req.user as unknown as AuthTokensDto;
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}`
      );
    }
  );

  router.post('/login',           validate(LoginSchema),                              ctrl.login);
  router.post('/refresh',         validate(RefreshTokenSchema),                       ctrl.refresh);
  router.post('/change-password', authenticate, validate(ChangePasswordSchema),       ctrl.changePassword);
  router.get('/me',               authenticate,                                       ctrl.me);

  return router;
};