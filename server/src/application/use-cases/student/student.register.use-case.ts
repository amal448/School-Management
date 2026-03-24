// src/application/use-cases/student/student.register.use-case.ts
import { StudentResponseDto } from 'src/domain/dtos/student.dto'
import { IUseCase }           from '../interfaces/use-case.interface'
import { RegisterStudentDto } from 'src/domain/dtos/student.dto'
import { StudentEntity }      from 'src/domain/entities/student.entity'
import { AppError }           from 'src/shared/types/app-error'
import { StudentMapper }      from 'src/application/mappers'
import { IStudentRepository } from 'src/application/ports/repositories/student.repository.interface'
import { ILogger, IPasswordHasher } from 'src/application/ports/services'

export class RegisterStudentUseCase
  implements IUseCase<RegisterStudentDto, StudentResponseDto> {

  constructor(
    private readonly studentRepo:    IStudentRepository,
    private readonly passwordHasher: IPasswordHasher,   // ← second
    private readonly logger:         ILogger,            // ← third
  ) {}

  async execute(dto: RegisterStudentDto): Promise<StudentResponseDto> {
    const exists = await this.studentRepo.existsByEmail(dto.email)
    if (exists) throw AppError.conflict('Email is already registered')

    const passwordHash = await this.passwordHasher.hash(dto.password)

    const student = StudentEntity.create({
      ...dto,
      passwordHash,
    })

    const saved = await this.studentRepo.save(student)

    this.logger.info('RegisterStudentUseCase: created', { id: saved.id })

    return StudentMapper.toDto(saved)   // ← no tokens
  }
}