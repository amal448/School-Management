import { ClassMapper } from 'src/application/mappers'
import { IUseCase } from '../interfaces/use-case.interface'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { ClassResponseDto } from 'src/domain/dtos/class.dto'
import { AppError } from 'src/shared/types/app-error'

export interface RemoveSubjectInput {
  classId: string
  subjectId: string
}

export class RemoveSubjectAllocationUseCase
  implements IUseCase<RemoveSubjectInput, ClassResponseDto> {

  constructor(
    private readonly classRepo: IClassRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: RemoveSubjectInput): Promise<ClassResponseDto> {
    const cls = await this.classRepo.findById(input.classId)
    if (!cls) throw AppError.notFound('Class not found')

    cls.removeSubjectAllocation(input.subjectId)

    const updated = await this.classRepo.update(input.classId, cls)
    if (!updated) throw AppError.internal('Removal failed')

    this.logger.info('Subject removed', input)

    return ClassMapper.toDto(updated)
  }
}