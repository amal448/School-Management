// src/application/use-cases/auth/logout.use-case.ts
import { Response } from 'express'
import { JwtTokenService } from 'src/infrastructure/services/token.service'
import { ILogger } from 'src/application/ports/services'

export class LogoutUseCase {
  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly logger:       ILogger,
  ) {}

  async execute(userId: string, res: Response): Promise<void> {
    await this.tokenService.revokeSession(userId)

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.clearCookie('csrfToken')

    this.logger.info('LogoutUseCase: logged out', { userId })
  }
}