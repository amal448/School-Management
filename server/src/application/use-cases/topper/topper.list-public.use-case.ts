import { IUseCase } from '../interfaces/use-case.interface'
import { TopperResponseDto } from 'src/domain/dtos/topper.dto'
import { ITopperRepository } from 'src/application/ports/repositories/topper.repository.interface'
import { TopperMapper } from 'src/application/mappers'

export class ListPublicToppersUseCase implements IUseCase<void, Record<string, TopperResponseDto[]>> {
  constructor(private readonly repo: ITopperRepository) {}

  async execute(): Promise<Record<string, TopperResponseDto[]>> {
    const grouped = await this.repo.findPublishedGrouped()

    const result: Record<string, TopperResponseDto[]> = {}
    for (const [grade, toppers] of Object.entries(grouped)) {
      result[grade] = toppers.map(TopperMapper.toDto)
    }

    return result
  }
}
