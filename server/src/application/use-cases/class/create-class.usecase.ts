import { IUseCase } from '../interfaces/use-case.interface'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { ClassEntity } from 'src/domain/entities/class.entity'
import { CreateClassDto, ClassResponseDto } from 'src/domain/dtos/class.dto'
import { AppError } from 'src/shared/types/app-error'
import { ClassMapper } from 'src/application/mappers'

export class CreateClassUseCase
  implements IUseCase<CreateClassDto, ClassResponseDto> {

  constructor(
    private readonly classRepo: IClassRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: CreateClassDto): Promise<ClassResponseDto> {
    const exists = await this.classRepo.existsByNameSectionYear(
      input.className,
      input.section,
      input.academicYear,
    )

    if (exists) {
      throw AppError.conflict(
        `Class ${input.className}-${input.section} already exists for ${input.academicYear}`
      )
    }

    const cls = ClassEntity.create(input)
    const saved = await this.classRepo.save(cls)

    this.logger.info('Class created', { id: saved.id })

    return ClassMapper.toDto(saved)
  }
}