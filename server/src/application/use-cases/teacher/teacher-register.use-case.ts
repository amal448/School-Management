// src/application/use-cases/teacher/teacher.use-cases.ts

import { IUseCase }              from '../interfaces/use-case.interface'
import { RegisterTeacherDto }    from 'src/domain/dtos/teacher.dto'
import { TeacherResponseDto }    from 'src/domain/dtos/teacher.dto'
import { TeacherEntity }         from 'src/domain/entities/teacher.entity'
import { ITeacherRepository }    from 'src/application/ports/repositories/teacher.repository.interface'
import { IPasswordHasher, ILogger } from 'src/application/ports/services'
import { TeacherMapper }         from 'src/application/mappers'
import { AppError }              from 'src/shared/types/app-error'

export interface CreateTeacherInput {
  dto:       RegisterTeacherDto
  createdBy: string
}

export class RegisterTeacherUseCase
  implements IUseCase<CreateTeacherInput, TeacherResponseDto> {

  constructor(
    private readonly teacherRepo:    ITeacherRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly logger:         ILogger,
  ) {}

  async execute(input: CreateTeacherInput): Promise<TeacherResponseDto> {
    const exists = await this.teacherRepo.existsByEmail(input.dto.email)
    if (exists) throw AppError.conflict('Email is already registered')

    const passwordHash = await this.passwordHasher.hash(input.dto.password)

    const teacher = TeacherEntity.create({
      ...input.dto,
      passwordHash,
      createdBy: input.createdBy,
    })

    const saved = await this.teacherRepo.save(teacher)

    // this.logger.info('RegisterTeacherUseCase: created', {
    //   id:        saved.id,
    //   createdBy: input.createdBy,
    // })

    // Return teacher profile only — no token
    // Teacher logs in separately using their credentials
    return TeacherMapper.toDto(saved)
  }
}