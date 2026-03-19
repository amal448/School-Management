// src/application/use-cases/auth/forgot-password.use-case.ts
import { IUseCase } from '../interfaces/use-case.interface'
import { IAdminRepository } from 'src/application/ports/repositories/admin.repository.interface'
import { IManagerRepository } from 'src/application/ports/repositories/manager.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { OtpService } from 'src/infrastructure/services/otp.service'
import { AppError } from 'src/shared/types/app-error'
import { Role } from 'src/domain/enums'

export interface ForgotPasswordInput {
  email: string
  role:  Role.MANAGER
}

export class ForgotPasswordUseCase implements IUseCase<ForgotPasswordInput, void> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly otpService:  OtpService,
    private readonly logger:      ILogger,
  ) {}

  async execute(input: ForgotPasswordInput): Promise<void> {
    // Find user in correct collection
   const entity = await this.managerRepo.findByEmail(input.email)

    // Security: always return success even if not found (prevent email enumeration)
    if (!entity || !entity.isActive) {
      this.logger.warn('ForgotPasswordUseCase: email not found or inactive', {
        email: input.email, role: input.role,
      })
      return
    }

    const token = await this.otpService.generateResetToken(input.role, input.email)

    // TODO: send email with reset link
    // await emailService.sendResetEmail(input.email, token, input.role)

    this.logger.info('ForgotPasswordUseCase: reset token generated', {
      role: input.role, email: input.email,
    })
  }
}