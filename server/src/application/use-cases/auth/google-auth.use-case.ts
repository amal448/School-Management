// src/application/use-cases/auth/google-auth.use-case.ts

import { AdminMapper } from "src/application/mappers";
import { IAdminRepository } from "src/application/ports/repositories/admin.repository.interface";
import { ILogger, ITokenService } from "src/application/ports/services";
import { AuthTokensDto } from "src/domain/dtos/auth.dto";
import { AdminEntity } from "src/domain/entities/admin.entity";
import { Role } from "src/domain/enums";
import { AppError } from "src/shared/types/app-error";

export interface GoogleProfile {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export class GoogleAuthUseCase {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger,
  ) {}

  async execute(profile: GoogleProfile): Promise<AuthTokensDto> {
    // 1. Check if this Google account is already registered
    let admin = await this.adminRepo.findByGoogleId(profile.googleId);

    if (admin) {
      // 2a. Already exists — update their name/avatar from Google
      //     (handles name changes on Google account)
      admin.updateFromGoogle({
        firstName: profile.firstName,
        lastName:  profile.lastName,
        avatar:    profile.avatar,
      });
      await this.adminRepo.update(admin.id!, admin);
      this.logger.info('GoogleAuthUseCase: existing admin signed in', { id: admin.id });

    } else {
      // 2b. First time — check if this email is whitelisted
      const allowed = await this.adminRepo.isEmailWhitelisted(profile.email);
      if (!allowed) {
        throw AppError.forbidden(
          'This Google account is not authorised. Contact the system owner.'
        );
      }

      // 2c. Create the admin account
      admin = AdminEntity.create(profile);
      admin = await this.adminRepo.save(admin);
      this.logger.info('GoogleAuthUseCase: new admin created', { id: admin.id });
    }

    if (!admin.isActive) {
      throw AppError.forbidden('Admin account is deactivated');
    }

    // 3. Issue JWT — same token structure as other roles
    const tokens = this.tokenService.generateTokenPair({
      userId: admin.id!,
      email:  admin.email,
      role:   Role.ADMIN,
    });

    return { ...tokens, user: AdminMapper.toDto(admin) };
  }
}