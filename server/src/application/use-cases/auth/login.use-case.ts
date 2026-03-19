// src/application/use-cases/auth/login.use-case.ts
import { Request, Response } from 'express'
import { IPasswordHasher, ILogger } from 'src/application/ports/services'
import { JwtTokenService } from 'src/infrastructure/services/token.service'
import { OtpService } from 'src/infrastructure/services/otp.service'
import { AppError } from 'src/shared/types/app-error'
import { Role } from 'src/domain/enums'
import { IManagerRepository } from 'src/application/ports/repositories/manager.repository.interface'
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface'
import { IStudentRepository } from 'src/application/ports/repositories/student.repository.interface'

export interface LoginInput {
  email:    string
  password: string
  role:     Role
  req:      Request
  res:      Response
}

export interface LoginResult {
  message:   string
  otpSent:   boolean
  sessionId?: string
  csrfToken?: string
}

export class LoginUseCase {
  constructor(
    private readonly managerRepo:    IManagerRepository,
    private readonly teacherRepo:    ITeacherRepository,
    private readonly studentRepo:    IStudentRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService:   JwtTokenService,
    private readonly otpService:     OtpService,
    private readonly logger:         ILogger,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const { entity, role } = await this.resolveUser(input.email, input.role)

    if (!entity || !entity.isActive) {
      throw AppError.unauthorized('Invalid credentials')
    }

    // Block check for managers
    if (role === Role.MANAGER && (entity as any).isBlocked) {
      throw AppError.forbidden('Your account has been blocked. Contact the administrator.')
    }

    if (!entity.passwordHash) {
      throw AppError.badRequest('Password not set. Please use your first-time setup link.')
    }

    const valid = await this.passwordHasher.compare(input.password, entity.passwordHash)
    if (!valid) throw AppError.unauthorized('Invalid credentials')

    // Admin logs in directly — no OTP (they use Google OAuth)
    // Managers get session directly
    if (role === Role.MANAGER) {
      const { sessionId, csrfToken } = await this.tokenService.generateSessionTokens(
        { userId: entity.id!, email: entity.email, role },
        input.res
      )
      this.logger.info('LoginUseCase: manager logged in', { id: entity.id })
      return { message: `Welcome ${entity.firstName}`, otpSent: false, sessionId, csrfToken }
    }

    // Teachers and students get OTP step
    const otp = await this.otpService.generateOtp(role, input.email)
    // TODO: send via email service
    this.logger.info('LoginUseCase: OTP sent', { role, email: input.email, otp })

    return {
      message: 'OTP sent to your email. Valid for 10 minutes.',
      otpSent: true,
    }
  }

  private async resolveUser(email: string, role: Role) {
    switch (role) {
      case Role.ADMIN:
        throw AppError.badRequest('Admin accounts use Google Sign-In. Use /api/auth/google')
      case Role.MANAGER:
        return { entity: await this.managerRepo.findByEmail(email), role: Role.MANAGER }
      case Role.TEACHER:
        return { entity: await this.teacherRepo.findByEmail(email), role: Role.TEACHER }
      case Role.STUDENT:
        return { entity: await this.studentRepo.findByEmail(email), role: Role.STUDENT }
      default:
        throw AppError.badRequest('Invalid role')
    }
  }
}