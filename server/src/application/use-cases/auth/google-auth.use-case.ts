// src/application/use-cases/auth/google-auth.use-case.ts
import { Response } from 'express'
import { IAdminRepository } from 'src/application/ports/repositories/admin.repository.interface'
import {  ILogger } from 'src/application/ports/services'
import { AdminEntity } from 'src/domain/entities/admin.entity'
import { AppError } from 'src/shared/types/app-error'
import { Role } from 'src/domain/enums'
import { JwtTokenService } from 'src/infrastructure/services/token.service'
import { AdminMapper } from 'src/application/mappers'

export interface GoogleProfile {
  googleId:  string
  email:     string
  firstName: string
  lastName:  string
  avatar?:   string
}

export interface GoogleAuthResult {
  sessionId: string
  csrfToken: string
  user:      ReturnType<typeof AdminMapper.toDto>
}

export class GoogleAuthUseCase {
  constructor(
    private readonly adminRepo:    IAdminRepository,
    private readonly tokenService: JwtTokenService,
    private readonly logger:       ILogger,
  ) {}

  async execute(profile: GoogleProfile, res: Response): Promise<GoogleAuthResult> {
    let admin = await this.adminRepo.findByGoogleId(profile.googleId)

    if (admin) {
      // Returning admin — refresh Google profile data
      admin.updateFromGoogle({
        firstName: profile.firstName,
        lastName:  profile.lastName,
        avatar:    profile.avatar,
      })
      admin.recordLogin()
      await this.adminRepo.update(admin.id!, admin)
      this.logger.info('GoogleAuthUseCase: existing admin signed in', { id: admin.id })

    } else {
      // First time — check whitelist with role: 'admin'
      const allowed = await this.adminRepo.isEmailWhitelisted(profile.email, 'admin')
      if (!allowed) {
        throw AppError.forbidden(
          'This Google account is not authorised. Contact the system owner.'
        )
      }

      admin = AdminEntity.create({
        ...profile,
        isVerified: true,
        lastLogin:  new Date(),
      })
      admin = await this.adminRepo.save(admin)
      this.logger.info('GoogleAuthUseCase: new admin created', { id: admin.id })
    }

    if (!admin.isActive) {
      throw AppError.forbidden('Admin account has been deactivated')
    }

    // Generate cookie-based session
    const { sessionId, csrfToken } = await this.tokenService.generateSessionTokens(
      { userId: admin.id!, email: admin.email, role: Role.ADMIN },
      res,
    )

    return { sessionId, csrfToken, user: AdminMapper.toDto(admin) }
  }
}