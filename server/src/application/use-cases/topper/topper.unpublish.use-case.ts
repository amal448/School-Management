import { IUseCase } from '../interfaces/use-case.interface'
import { TopperResponseDto } from 'src/domain/dtos/topper.dto'
import { ITopperRepository } from 'src/application/ports/repositories/topper.repository.interface'
import { TopperMapper } from 'src/application/mappers'
import { AppError } from 'src/shared/types/app-error'

export class UnpublishTopperUseCase implements IUseCase<string, TopperResponseDto> {
  constructor(private readonly repo: ITopperRepository) {}

  async execute(id: string): Promise<TopperResponseDto> {
    const entity = await this.repo.findById(id)
    if (!entity) throw AppError.notFound('Topper not found')
    
    entity.unpublish()
    
    const updated = await this.repo.update(id, entity)
    return TopperMapper.toDto(updated!)
  }
}
