// src/interfaces/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { JwtTokenService } from 'src/infrastructure/services/token.service'
import { redisClient } from 'src/infrastructure/cache/redis-client'
import { RedisKeys } from 'src/infrastructure/cache/redis-keys'
import { Role } from 'src/domain/enums'
import { AppError } from 'src/shared/types/app-error'
import { TokenPayload } from 'src/application/ports/services'

declare global {
  namespace Express {
    interface Request {
      user?:      TokenPayload & { sessionId: string }
      sessionId?: string
    }
  }
}

export const createAuthMiddleware = (tokenService: JwtTokenService) => {

  // ── Authenticate — reads from HTTP-only cookie ─────
  const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.cookies?.accessToken

      if (!token) {
        throw AppError.unauthorized('No access token — please login')
      }

      let decoded: TokenPayload & { sessionId: string }

      try {
        decoded = tokenService.verifyAccessToken(token)
      } catch {
        // Token expired — try refresh automatically
        const refreshed = await tokenService.refreshAccessToken(req, res)
        if (!refreshed) {
          res.clearCookie('accessToken')
          res.clearCookie('refreshToken')
          res.clearCookie('csrfToken')
          throw AppError.unauthorized('Session expired — please login again')
        }
        decoded = refreshed as TokenPayload & { sessionId: string }
      }

      // Validate session is still active in Redis
      const sessionActive = await tokenService.isSessionActive(
        decoded.userId,
        decoded.sessionId
      )

      if (!sessionActive) {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.clearCookie('csrfToken')
        throw AppError.unauthorized('Session expired — you have been logged in from another device')
      }

      // Try user cache first
      const cached = await redisClient.get(RedisKeys.userCache(decoded.userId))
      if (cached) {
        req.user      = { ...JSON.parse(cached), sessionId: decoded.sessionId }
        req.sessionId = decoded.sessionId
        return next()
      }

      req.user      = decoded
      req.sessionId = decoded.sessionId
      next()

    } catch (err) {
      next(err)
    }
  }

  // ── Authorize — role guard ─────────────────────────
  const authorize = (...roles: Role[]) =>
    (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) return next(AppError.unauthorized())
      if (!roles.includes(req.user.role as Role)) {
        return next(AppError.forbidden(`Access restricted to: ${roles.join(', ')}`))
      }
      next()
    }

  // ── CSRF Validation ────────────────────────────────
  const verifyCsrf = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // CSRF token sent by frontend in header (not cookie)
      const csrfFromHeader = req.headers['x-csrf-token'] as string

      if (!csrfFromHeader) {
        throw AppError.forbidden('CSRF token missing')
      }

      const stored = await redisClient.get(RedisKeys.csrfToken(req.user!.userId))

      if (!stored || stored !== csrfFromHeader) {
        throw AppError.forbidden('Invalid CSRF token')
      }

      next()
    } catch (err) {
      next(err)
    }
  }

  return { authenticate, authorize, verifyCsrf }
}