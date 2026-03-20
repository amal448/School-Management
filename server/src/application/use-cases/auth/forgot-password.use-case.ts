// src/application/use-cases/auth/forgot-password.use-case.ts
import { IUseCase }          from '../interfaces/use-case.interface'
import { IManagerRepository } from 'src/application/ports/repositories/manager.repository.interface'
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface'
import { OtpService }        from 'src/infrastructure/services/otp.service'
import { IEmailService, ILogger }           from 'src/application/ports/services'
import { AppError }          from 'src/shared/types/app-error'
import { Role }              from 'src/domain/enums'
import { AppConfig }         from 'src/config/app.config'

export interface ForgotPasswordInput {
  email: string
  role:  Role.MANAGER | Role.TEACHER
}

export class ForgotPasswordUseCase implements IUseCase<ForgotPasswordInput, void> {
  constructor(
    private readonly managerRepo:  IManagerRepository,
    private readonly teacherRepo:  ITeacherRepository,
    private readonly otpService:   OtpService,
    private readonly emailService: IEmailService,     // ← injected
    private readonly logger:       ILogger,
  ) {}

  async execute(input: ForgotPasswordInput): Promise<void> {
    const entity = input.role === Role.MANAGER
      ? await this.managerRepo.findByEmail(input.email)
      : await this.teacherRepo.findByEmail(input.email)

    // Always silent — never reveal if email exists
    if (!entity || !entity.isActive) {
      this.logger.warn('ForgotPasswordUseCase: not found or inactive', {
        email: input.email,
        role:  input.role,
      })
      return
    }

    const token = await this.otpService.generateResetToken(input.role, input.email)

    // Build reset link
    const resetLink = `${AppConfig.server.frontendUrl}/auth/reset-password?token=${token}&role=${input.role}`

    try {
      await this.emailService.sendResetPassword({
        to:        input.email,
        firstName: entity.firstName,
        resetLink,
        role:      input.role.toLowerCase(),
      })
    } catch (emailErr) {
      this.logger.error('ForgotPasswordUseCase: failed to send reset email', {
        email: input.email,
        error: (emailErr as Error).message,
      })
    }

    this.logger.info('ForgotPasswordUseCase: reset email sent', {
      role:  input.role,
      email: input.email,
    })
  }
}