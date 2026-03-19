// src/infrastructure/services/token.service.ts
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Request, Response } from 'express'
import { redisClient } from 'src/infrastructure/cache/redis-client'
import { RedisKeys, RedisTTL } from 'src/infrastructure/cache/redis-keys'
import { AppConfig } from 'src/config/app.config'
import { TokenPayload } from 'src/application/ports/services'
import { AppError } from 'src/shared/types/app-error'

export class JwtTokenService {

  // ── Generate full session ──────────────────────────
  // Creates access token + refresh token + Redis session + CSRF token
  // Sets all three as HTTP-only cookies on the response
  async generateSessionTokens(
    payload: TokenPayload,
    res: Response,
  ): Promise<{ sessionId: string; csrfToken: string }> {

    const sessionId = crypto.randomBytes(16).toString('hex')

    const accessToken = jwt.sign(
      { ...payload, sessionId },
      AppConfig.jwt.accessSecret,
      { expiresIn: AppConfig.jwt.accessExpiresIn as any },
    )

    const refreshToken = jwt.sign(
      { ...payload, sessionId },
      AppConfig.jwt.refreshSecret,
      { expiresIn: AppConfig.jwt.refreshExpiresIn as any },
    )

    // Single session policy — revoke any existing session for this user
    const existingSessionId = await redisClient.get(
      RedisKeys.activeSession(payload.userId)
    )
    if (existingSessionId) {
      await redisClient.del(RedisKeys.session(existingSessionId))
    }

    const sessionData = {
      userId:       payload.userId,
      email:        payload.email,
      role:         payload.role,
      sessionId,
      createdAt:    new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    }

    const csrfToken = crypto.randomBytes(32).toString('hex')

    // Store everything in Redis in parallel
    await Promise.all([
      redisClient.setex(RedisKeys.refreshToken(payload.userId),  RedisTTL.session, refreshToken),
      redisClient.setex(RedisKeys.session(sessionId),            RedisTTL.session, JSON.stringify(sessionData)),
      redisClient.setex(RedisKeys.activeSession(payload.userId), RedisTTL.session, sessionId),
      redisClient.setex(RedisKeys.csrfToken(payload.userId),     RedisTTL.csrf,    csrfToken),
    ])

    const isProduction = AppConfig.server.nodeEnv === 'production'

    // Access token — short lived, HTTP-only
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure:   isProduction,
      sameSite: 'none',
      maxAge:   AppConfig.jwt.accessExpiresInSeconds * 1000,
    })

    // Refresh token — long lived, HTTP-only
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   isProduction,
      sameSite: 'none',
      maxAge:   RedisTTL.session * 1000,
    })

    // CSRF token — NOT httpOnly so frontend JS can read it
    // Frontend must send this back in x-csrf-token header
    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure:   isProduction,
      sameSite: 'none',
      maxAge:   RedisTTL.session * 1000,
    })

    return { sessionId, csrfToken }
  }

  // ── Silently refresh access token from refresh cookie ──
  // Called automatically by authenticate middleware when access token expires
  async refreshAccessToken(req: Request, res: Response): Promise<TokenPayload & { sessionId: string } | null> {
    const token = req.cookies?.refreshToken
    if (!token) return null

    try {
      const decoded = jwt.verify(
        token,
        AppConfig.jwt.refreshSecret,
      ) as TokenPayload & { sessionId: string }

      // Validate stored refresh token matches exactly
      const stored = await redisClient.get(RedisKeys.refreshToken(decoded.userId))
      if (stored !== token) return null

      // Validate this session is still the active one
      const activeSessionId = await redisClient.get(RedisKeys.activeSession(decoded.userId))
      if (activeSessionId !== decoded.sessionId) return null

      // Validate session data still exists in Redis
      const sessionData = await redisClient.get(RedisKeys.session(decoded.sessionId))
      if (!sessionData) return null

      // Update last activity timestamp
      const parsed = JSON.parse(sessionData)
      parsed.lastActivity = new Date().toISOString()
      await redisClient.setex(
        RedisKeys.session(decoded.sessionId),
        RedisTTL.session,
        JSON.stringify(parsed),
      )

      // Issue fresh access token with same payload
      const newAccessToken = jwt.sign(
        {
          userId:    decoded.userId,
          email:     decoded.email,
          role:      decoded.role,
          sessionId: decoded.sessionId,
        },
        AppConfig.jwt.accessSecret,
        { expiresIn: AppConfig.jwt.accessExpiresIn as any },
      )

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure:   AppConfig.server.nodeEnv === 'production',
        sameSite: 'none',
        maxAge:   AppConfig.jwt.accessExpiresInSeconds * 1000,
      })

      return decoded

    } catch {
      return null
    }
  }

  // ── Verify access token ────────────────────────────
  // Throws AppError if invalid or expired — used in authenticate middleware
  verifyAccessToken(token: string): TokenPayload & { sessionId: string } {
    try {
      return jwt.verify(
        token,
        AppConfig.jwt.accessSecret,
      ) as TokenPayload & { sessionId: string }
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw AppError.unauthorized('Access token expired')
      }
      throw AppError.unauthorized('Access token invalid')
    }
  }

  // ── Check session is active in Redis ──────────────
  async isSessionActive(userId: string, sessionId: string): Promise<boolean> {
    const active = await redisClient.get(RedisKeys.activeSession(userId))
    return active === sessionId
  }

  // ── Revoke session (logout) ────────────────────────
  async revokeSession(userId: string): Promise<void> {
    const activeSessionId = await redisClient.get(RedisKeys.activeSession(userId))

    await Promise.all([
      redisClient.del(RedisKeys.refreshToken(userId)),
      redisClient.del(RedisKeys.activeSession(userId)),
      redisClient.del(RedisKeys.csrfToken(userId)),
      redisClient.del(RedisKeys.userCache(userId)),
      activeSessionId
        ? redisClient.del(RedisKeys.session(activeSessionId))
        : Promise.resolve(),
    ])
  }
}