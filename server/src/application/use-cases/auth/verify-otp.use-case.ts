// src/application/use-cases/auth/verify-otp.use-case.ts
import { Response } from 'express'
import { JwtTokenService } from 'src/infrastructure/services/token.service'
import { OtpService } from 'src/infrastructure/services/otp.service'
import { ILogger } from 'src/application/ports/services'
import { AppError } from 'src/shared/types/app-error'
import { Role } from 'src/domain/enums'
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface'
import { IStudentRepository } from 'src/application/ports/repositories/student.repository.interface'

export interface VerifyOtpInput {
  email:  string
  otp:    string
  role:   Role.TEACHER | Role.STUDENT
  res:    Response
}

export interface VerifyOtpResult {
  message:   string
  sessionId: string
  csrfToken: string
}

export class VerifyOtpUseCase {
  constructor(
    private readonly teacherRepo:  ITeacherRepository,
    private readonly studentRepo:  IStudentRepository,
    private readonly tokenService: JwtTokenService,
    private readonly otpService:   OtpService,
    private readonly logger:       ILogger,
  ) {}

  async execute(input: VerifyOtpInput): Promise<VerifyOtpResult> {
    // Verify OTP from Redis
    const valid = await this.otpService.verifyOtp(input.role, input.email, input.otp)
    if (!valid) {
      throw AppError.unauthorized('Invalid or expired OTP')
    }

    // Get the user
    const entity = input.role === Role.TEACHER
      ? await this.teacherRepo.findByEmail(input.email)
      : await this.studentRepo.findByEmail(input.email)

    if (!entity) throw AppError.notFound('User not found')

    // Create session
    const { sessionId, csrfToken } = await this.tokenService.generateSessionTokens(
      { userId: entity.id!, email: entity.email, role: input.role },
      input.res
    )

    this.logger.info('VerifyOtpUseCase: session created', { role: input.role, id: entity.id })

    return {
      message: `Welcome ${entity.firstName}`,
      sessionId,
      csrfToken,
    }
  }
}