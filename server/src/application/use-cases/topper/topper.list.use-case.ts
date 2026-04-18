import { TopperResponseDto, TopperQueryDto } from 'src/domain/dtos/topper.dto'
import { IUseCase } from '../interfaces/use-case.interface'
import { ITopperRepository } from 'src/application/ports/repositories/topper.repository.interface'
import { TopperMapper } from 'src/application/mappers'
import { PaginatedResult } from 'src/application/ports/repositories/base.repository.interface'

export class ListToppersUseCase implements IUseCase<TopperQueryDto, PaginatedResult<TopperResponseDto>> {
  constructor(private readonly repo: ITopperRepository) {}

  async execute(query: TopperQueryDto): Promise<PaginatedResult<TopperResponseDto>> {
    const result = await this.repo.findAll(query as any)
    return {
      data: result.data.map(TopperMapper.toDto),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }
  }
}
