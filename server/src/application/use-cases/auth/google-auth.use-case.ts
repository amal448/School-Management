// src/application/use-cases/auth/google-auth.use-case.ts
import { IAdminRepository } from 'src/application/ports/repositories/admin.repository.interface'
import { ITokenService, ILogger } from 'src/application/ports/services'
import { AdminEntity } from 'src/domain/entities/admin.entity'
import { AuthTokensDto } from 'src/domain/dtos/auth.dto'
import { AppError } from 'src/shared/types/app-error'
import { Role } from 'src/domain/enums'
import { AdminMapper } from 'src/application/mappers'

export interface GoogleProfile {
  googleId:   string
  email:      string
  firstName:  string
  lastName:   string
  avatar?:    string
}

export class GoogleAuthUseCase {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger,
  ) {}

  async execute(profile: GoogleProfile): Promise<AuthTokensDto> {
    let admin = await this.adminRepo.findByGoogleId(profile.googleId)

    if (admin) {
      // Returning admin — refresh Google profile + record login
      admin.updateFromGoogle({
        firstName: profile.firstName,
        lastName:  profile.lastName,
        avatar:    profile.avatar,
      })
      admin.recordLogin()
      await this.adminRepo.update(admin.id!, admin)
      this.logger.info('GoogleAuthUseCase: existing admin signed in', { id: admin.id })

    } else {
      // First time — must be whitelisted with role: 'admin'
      const allowed = await this.adminRepo.isEmailWhitelisted(profile.email, 'admin')
      if (!allowed) {
        throw AppError.forbidden(
          'This Google account is not authorised. Contact the system owner.'
        )
      }

      admin = AdminEntity.create({
        ...profile,
        isVerified: true,   // Google accounts are pre-verified
        lastLogin:  new Date(),
      })
      admin = await this.adminRepo.save(admin)
      this.logger.info('GoogleAuthUseCase: new admin created', { id: admin.id })
    }

    if (!admin.isActive) {
      throw AppError.forbidden('Admin account is deactivated')
    }

    const tokens = this.tokenService.generateTokenPair({
      userId: admin.id!,
      email:  admin.email,
      role:   Role.ADMIN,
    })

    return { ...tokens, user: AdminMapper.toDto(admin) }
  }
}