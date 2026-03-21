import { ClassMapper } from 'src/application/mappers'
import { IUseCase } from '../interfaces/use-case.interface'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { AllocateSubjectDto, ClassResponseDto } from 'src/domain/dtos/class.dto'
import { AppError } from 'src/shared/types/app-error'

export interface AllocateSubjectInput {
  classId: string
  dto: AllocateSubjectDto
}

export class AllocateSubjectUseCase
  implements IUseCase<AllocateSubjectInput, ClassResponseDto> {

  constructor(
    private readonly classRepo: IClassRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: AllocateSubjectInput): Promise<ClassResponseDto> {
    const cls = await this.classRepo.findById(input.classId)
    if (!cls) throw AppError.notFound('Class not found')

    cls.allocateSubject(input.dto)

    const updated = await this.classRepo.update(input.classId, cls)
    if (!updated) throw AppError.internal('Allocation failed')

    this.logger.info('Subject allocated', {
      classId: input.classId,
      subjectId: input.dto.subjectId,
    })

    return ClassMapper.toDto(updated)
  }
}