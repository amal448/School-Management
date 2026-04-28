import { IAnnouncementRepository } from 'src/application/ports/repositories/announcement.repository.interface'
import { AnnouncementEntity } from 'src/domain/entities/announcement.entity'
import { PaginatedResult } from 'src/application/ports/repositories/base.repository.interface'

export class ListAnnouncementsUseCase {
  constructor(private readonly repo: IAnnouncementRepository) {}

  async execute(query: any): Promise<PaginatedResult<AnnouncementEntity>> {
    return this.repo.findAll(query)
  }
}
