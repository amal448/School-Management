import { ClassMapper } from 'src/application/mappers'
import { IUseCase } from '../interfaces/use-case.interface'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { ClassResponseDto } from 'src/domain/dtos/class.dto'
import { AppError } from 'src/shared/types/app-error'

export class GetClassUseCase
  implements IUseCase<string, ClassResponseDto> {

  constructor(private readonly classRepo: IClassRepository) {}

  async execute(id: string): Promise<ClassResponseDto> {
    const cls = await this.classRepo.findById(id)
    if (!cls) throw AppError.notFound('Class not found')

    return ClassMapper.toDto(cls)
  }
}