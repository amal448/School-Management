// src/application/use-cases/teacher/teacher-register.use-case.ts

import { IUseCase }           from '../interfaces/use-case.interface'
import { CreateTeacherInput } from '../interfaces/inputs/teacher.inputs'  // ← from inputs file
import { TeacherResponseDto } from 'src/domain/dtos/teacher.dto'
import { TeacherEntity }      from 'src/domain/entities/teacher.entity'
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface'
import { IPasswordHasher }    from 'src/application/ports/services/password-hasher.interface'
import { ILogger }            from 'src/application/ports/services/logger.service.interface'
import { TeacherMapper }      from 'src/application/mappers'
import { AppError }           from 'src/shared/types/app-error'
import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import { ISubjectRepository } from 'src/application/ports/repositories/subject.repository.interface'

export class RegisterTeacherUseCase
  implements IUseCase<CreateTeacherInput, TeacherResponseDto> {

  constructor(
    private readonly teacherRepo:    ITeacherRepository,
    private readonly deptRepo:       IDepartmentRepository,
    private readonly subjectRepo:    ISubjectRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly logger:         ILogger,
  ) {}

  async execute(input: CreateTeacherInput): Promise<TeacherResponseDto> {
    const exists = await this.teacherRepo.existsByEmail(input.dto.email)
    if (exists) throw AppError.conflict('Email is already registered')

    if (input.dto.deptId) {
      const dept = await this.deptRepo.findById(input.dto.deptId)
      if (!dept) throw AppError.notFound('Department not found')
    }

    if (input.dto.subjectIds?.length) {
      for (const subjectId of input.dto.subjectIds) {
        const subject = await this.subjectRepo.findById(subjectId)
        if (!subject) throw AppError.notFound(`Subject ${subjectId} not found`)
        if (input.dto.deptId && subject.deptId !== input.dto.deptId) {
          throw AppError.badRequest('Subject does not belong to the selected department')
        }
      }
    }

    const passwordHash = await this.passwordHasher.hash(input.dto.password)

   const teacher = TeacherEntity.create({
      firstName: input.dto.firstName,
      lastName: input.dto.lastName,
      email: input.dto.email,
      passwordHash,
      phone: input.dto.phone,
      designation: input.dto.designation,
      deptId: input.dto.deptId,
      // EXPLICITLY ADD THESE:
      level: input.dto.level,
      subjectIds: input.dto.subjectIds || [],
      createdBy: input.createdBy,
    })

    const saved = await this.teacherRepo.save(teacher)
    this.logger.info('RegisterTeacherUseCase: created', { id: saved.id })
    return TeacherMapper.toDto(saved)
  }
}