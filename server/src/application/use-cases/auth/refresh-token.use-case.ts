// src/application/use-cases/auth/refresh-token.use-case.ts
// The old version used generateTokenPair — completely replaced.
// Now refresh is handled directly in the middleware (auto-refresh)
// and via the /refresh endpoint which calls tokenService directly.
// This use case is kept thin — just delegates to token service.

import { Request, Response } from 'express'
import { JwtTokenService } from 'src/infrastructure/services/token.service'
import { ILogger } from 'src/application/ports/services'
import { AppError } from 'src/shared/types/app-error'

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly logger:       ILogger,
  ) {}

  async execute(req: Request, res: Response): Promise<void> {
    const result = await this.tokenService.refreshAccessToken(req, res)

    if (!result) {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.clearCookie('csrfToken')
      throw AppError.unauthorized('Session expired — please login again')
    }

    this.logger.info('RefreshTokenUseCase: access token refreshed', {
      userId: result.userId,
    })
  }
}