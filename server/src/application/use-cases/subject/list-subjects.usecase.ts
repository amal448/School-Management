import { SubjectMapper } from 'src/application/mappers'
import { ISubjectRepository } from 'src/application/ports/repositories/subject.repository.interface'
import { SubjectQueryDto } from 'src/domain/dtos/subject.dto'
import { DEFAULT_LIMIT } from 'src/shared/constants'

export class ListSubjectsUseCase {
  constructor(private readonly subjectRepo: ISubjectRepository) {}

  async execute(query: SubjectQueryDto) {
    const result = await this.subjectRepo.findAll(query)

    const limit = query.limit ?? DEFAULT_LIMIT
    const totalPages = Math.ceil(result.total / limit)

    return {
      data: result.data.map(SubjectMapper.toDto),
      total: result.total,
      page: result.page,
      limit,
      totalPages,
    }
  }
}