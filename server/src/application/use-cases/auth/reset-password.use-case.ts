// src/application/use-cases/auth/reset-password.use-case.ts
import { IUseCase } from '../interfaces/use-case.interface'
import { IAdminRepository } from 'src/application/ports/repositories/admin.repository.interface'
import { IManagerRepository } from 'src/application/ports/repositories/manager.repository.interface'
import { IPasswordHasher, ILogger } from 'src/application/ports/services'
import { OtpService } from 'src/infrastructure/services/otp.service'
import { AppError } from 'src/shared/types/app-error'
import { Role } from 'src/domain/enums'

export interface ResetPasswordInput {
  token: string
  role: Role.MANAGER | Role.TEACHER
  newPassword: string
}

export class ResetPasswordUseCase implements IUseCase<ResetPasswordInput, void> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpService: OtpService,
    private readonly logger: ILogger,
  ) { }

  async execute(input: ResetPasswordInput): Promise<void> {
    // Get email from Redis reset token
    const email = await this.otpService.verifyResetToken(input.role, input.token)
    if (!email) {
      throw AppError.badRequest('Reset token is invalid or has expired')
    }

    // Find entity in correct collection
    const entity = await this.managerRepo.findByEmail(email)

    if (!entity) throw AppError.notFound('User not found')

    const newHash = await this.passwordHasher.hash(input.newPassword)
    entity.updatePassword(newHash)
    await this.managerRepo.update(entity.id!, entity)

    this.logger.info('ResetPasswordUseCase: password reset', {
      role: input.role, email,
    })
  }
}