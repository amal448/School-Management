// src/application/use-cases/auth/student-reset-password.use-case.ts
// Only manager or teacher can reset a student's password
// Student then MUST change it on first login (isFirstTime set back to true)

import { IUseCase } from '../interfaces/use-case.interface'
import { IStudentRepository } from 'src/application/ports/repositories/student.repository.interface'
import { IPasswordHasher, ILogger } from 'src/application/ports/services'
import { OtpService } from 'src/infrastructure/services/otp.service'
import { AppError } from 'src/shared/types/app-error'
import { Role } from 'src/domain/enums'
import { StudentResetPasswordInput, StudentResetPasswordResult } from '../interfaces/inputs'


export class StudentResetPasswordUseCase
  implements IUseCase<StudentResetPasswordInput, StudentResetPasswordResult> {

  constructor(
    private readonly studentRepo:    IStudentRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpService:     OtpService,
    private readonly logger:         ILogger,
  ) {}

  async execute(input: StudentResetPasswordInput): Promise<StudentResetPasswordResult> {
    const student = await this.studentRepo.findById(input.studentId)
    if (!student) throw AppError.notFound('Student not found')
    if (!student.isActive) throw AppError.badRequest('Student account is inactive')

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
    const tempHash     = await this.passwordHasher.hash(tempPassword)

    // Reset password and force first-time setup on next login
    student.updatePassword(tempHash)
    student.setPasswordResetBy(input.requesterId)
    // isFirstTime goes back to true — student must change on login
    student.markAsFirstTime()

    await this.studentRepo.update(input.studentId, student)

    // Generate a first-time token for student to set new password
    const firstTimeToken = await this.otpService.generateFirstTimeToken(
      Role.STUDENT,
      input.studentId,
    )

    this.logger.info('StudentResetPasswordUseCase: reset by', {
      studentId:   input.studentId,
      requesterId: input.requesterId,
      role:        input.requesterRole,
    })

    // Return token — manager/teacher sends this to student via email or share
    return { firstTimeToken }
  }
}