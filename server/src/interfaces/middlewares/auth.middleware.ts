import { ITokenService, TokenPayload } from '../../application/ports/services/index';
import { Role } from '../../domain/enums/index';
import { AppError } from '../../shared/types/app-error';
import { BEARER_PREFIX } from '../../shared/constants/index';
import { Request,Response,NextFunction } from 'express';
import { AuthTokensDto } from 'src/domain/dtos/auth.dto';


declare global {
  namespace Express {
    interface Request {
      // Normal JWT auth populates this
      user?: TokenPayload;

      // Google OAuth callback populates this (passport puts the use-case result here)
      authResult?: AuthTokensDto;
    }
  }
}

export const createAuthMiddleware = (tokenService: ITokenService) => {
  // Verifies JWT and populates req.user
  const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith(BEARER_PREFIX)) {
        throw AppError.unauthorized('Missing or malformed Authorization header');
      }
      req.user = tokenService.verifyAccessToken(header.slice(BEARER_PREFIX.length));
      next();
    } catch (err) {
      next(err);
    }
  };

  // Guards routes by one or more roles (ISP: only pass roles relevant to each route)
  const authorize = (...roles: Role[]) =>
    (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) return next(AppError.unauthorized());
      if (!roles.includes(req.user.role as Role)) {
        return next(AppError.forbidden(`Access restricted to: ${roles.join(', ')}`));
      }
      next();
    };

  return { authenticate, authorize };
};
