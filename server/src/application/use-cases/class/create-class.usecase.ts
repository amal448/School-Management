// src/application/use-cases/class/create-class.usecase.ts

import { IUseCase }          from '../interfaces/use-case.interface'
import { IClassRepository }  from 'src/application/ports/repositories/class.repository.interface'
import { ILogger }           from 'src/application/ports/services'
import { ClassEntity }       from 'src/domain/entities/class.entity'
import { ClassMapper }       from 'src/application/mappers'
import { CreateClassDto, ClassResponseDto } from 'src/domain/dtos/class.dto'
import { AppError }          from 'src/shared/types/app-error'

export class CreateClassUseCase
  implements IUseCase<CreateClassDto, ClassResponseDto> {

  constructor(
    private readonly classRepo: IClassRepository,   // ← was missing
    private readonly logger:    ILogger,             // ← was missing
  ) {}

  async execute(input: CreateClassDto): Promise<ClassResponseDto> {
    const exists = await this.classRepo.existsByNameSection(
      input.className,
      input.section,
    )
    if (exists) {
      throw AppError.conflict(
        `Class ${input.className}-${input.section} already exists`
      )
    }

    const cls   = ClassEntity.create(input)
    const saved = await this.classRepo.save(cls)

    this.logger.info('CreateClassUseCase: created', { id: saved.id })
    return ClassMapper.toDto(saved)
  }
}