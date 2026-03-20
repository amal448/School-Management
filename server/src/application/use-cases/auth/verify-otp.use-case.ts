// src/application/use-cases/auth/verify-otp.use-case.ts
import { Response }           from 'express'
import { JwtTokenService }    from 'src/infrastructure/services/token.service'
import { OtpService }         from 'src/infrastructure/services/otp.service'
import { ILogger }            from 'src/application/ports/services'
import { AppError }           from 'src/shared/types/app-error'
import { Role }               from 'src/domain/enums'
import { IManagerRepository } from 'src/application/ports/repositories/manager.repository.interface'
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface'

export interface VerifyOtpInput {
  email: string
  otp:   string
  role:  Role.MANAGER | Role.TEACHER | Role.STUDENT
  res:   Response
}

export interface VerifyOtpResult {
  message:   string
  sessionId: string
  csrfToken: string
}

export class VerifyOtpUseCase {
  constructor(
    private readonly managerRepo:  IManagerRepository,
    private readonly teacherRepo:  ITeacherRepository,
    private readonly tokenService: JwtTokenService,
    private readonly otpService:   OtpService,
    private readonly logger:       ILogger,
  ) {}

  async execute(input: VerifyOtpInput): Promise<VerifyOtpResult> {

    // 1. Verify OTP from Redis — deletes on success (one-time use)
    const valid = await this.otpService.verifyOtp(
      input.role,
      input.email,
      input.otp,
    )
    if (!valid) {
      throw AppError.unauthorized('Invalid or expired OTP')
    }

    // 2. Fetch entity from correct collection
    const entity = await this.resolveUser(input.email, input.role)
    if (!entity) {
      throw AppError.notFound('User not found')
    }

    // 3. Record login timestamp
    entity.recordLogin()
    await this.updateEntity(entity, input.role)

    // 4. Create session — sets cookies on response
    const { sessionId, csrfToken } = await this.tokenService.generateSessionTokens(
      { userId: entity.id!, email: entity.email, role: input.role },
      input.res,
    )

    this.logger.info('VerifyOtpUseCase: session created', {
      role: input.role,
      id:   entity.id,
    })

    return {
      message: `Welcome ${entity.firstName}`,
      sessionId,
      csrfToken,
    }
  }

  private async resolveUser(email: string, role: Role) {
    switch (role) {
      case Role.MANAGER: return this.managerRepo.findByEmail(email)
      case Role.TEACHER: return this.teacherRepo.findByEmail(email)
      default: throw AppError.badRequest('Invalid role')
    }
  }

  private async updateEntity(entity: any, role: Role): Promise<void> {
    switch (role) {
      case Role.MANAGER:
        await this.managerRepo.update(entity.id!, entity)
        break
      case Role.TEACHER:
        await this.teacherRepo.update(entity.id!, entity)
        break
     
    }
  }
}