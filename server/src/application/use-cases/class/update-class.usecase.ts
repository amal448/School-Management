import { ClassMapper } from 'src/application/mappers'
import { IUseCase } from '../interfaces/use-case.interface'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { UpdateClassDto, ClassResponseDto } from 'src/domain/dtos/class.dto'
import { AppError } from 'src/shared/types/app-error'

export interface UpdateClassInput {
  id: string
  dto: UpdateClassDto
}

export class UpdateClassUseCase
  implements IUseCase<UpdateClassInput, ClassResponseDto> {

  constructor(
    private readonly classRepo: IClassRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: UpdateClassInput): Promise<ClassResponseDto> {
    const cls = await this.classRepo.findById(input.id)
    if (!cls) throw AppError.notFound('Class not found')

    cls.updateDetails(input.dto)

    const updated = await this.classRepo.update(input.id, cls)
    if (!updated) throw AppError.internal('Update failed')

    this.logger.info('Class updated', { id: input.id })

    return ClassMapper.toDto(updated)
  }
}