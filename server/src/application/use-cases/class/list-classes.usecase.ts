import { ClassMapper } from 'src/application/mappers'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { ClassQueryDto } from 'src/domain/dtos/class.dto'
import { DEFAULT_LIMIT } from 'src/shared/constants'

export class ListClassesUseCase {
  constructor(private readonly classRepo: IClassRepository) {}

  async execute(query: ClassQueryDto) {
    const result = await this.classRepo.findAll(query)

    const limit = query.limit ?? DEFAULT_LIMIT
    const totalPages = Math.ceil(result.total / limit)

    return {
      data: result.data.map(ClassMapper.toDto),
      total: result.total,
      page: result.page,
      limit,
      totalPages,
    }
  }
}