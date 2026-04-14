// src/application/use-cases/auth/first-time-setup.use-case.ts
// Used by teachers and students on their very first login
// Manager creates the account → sends firsttime token via email
// Teacher/Student clicks link → sets their own password

import { IUseCase } from '../interfaces/use-case.interface'
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface'
import { IStudentRepository } from 'src/application/ports/repositories/student.repository.interface'
import { IPasswordHasher, ILogger } from 'src/application/ports/services'
import { OtpService } from 'src/infrastructure/services/otp.service'
import { AppError } from 'src/shared/types/app-error'
import { Role } from 'src/domain/enums'
import { FirstTimeSetupInput } from '../interfaces/inputs'

export class FirstTimeSetupUseCase implements IUseCase<FirstTimeSetupInput, void> {
  constructor(
    private readonly teacherRepo:    ITeacherRepository,
    private readonly studentRepo:    IStudentRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpService:     OtpService,
    private readonly logger:         ILogger,
  ) {}

  async execute(input: FirstTimeSetupInput): Promise<void> {
    // Get userId from Redis firsttime token (24hr TTL)
    const userId = await this.otpService.verifyFirstTimeToken(input.role, input.token)
    if (!userId) {
      throw AppError.badRequest('Setup link is invalid or has expired. Contact your manager.')
    }

    const entity = input.role === Role.TEACHER
      ? await this.teacherRepo.findById(userId)
      : await this.studentRepo.findById(userId)

    if (!entity) throw AppError.notFound('Account not found')
    if (!entity.isFirstTime) {
      throw AppError.badRequest('Password has already been set. Use forgot password if needed.')
    }

    const newHash = await this.passwordHasher.hash(input.newPassword)
    entity.updatePassword(newHash)
    entity.completFirstTimeSetup(newHash)

    if (input.role === Role.TEACHER) {
      await this.teacherRepo.update(userId, entity as any)
    } else {
      await this.studentRepo.update(userId, entity as any)
    }

    this.logger.info('FirstTimeSetupUseCase: password set', { role: input.role, userId })
  }
}