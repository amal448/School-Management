import { IAnnouncementRepository } from 'src/application/ports/repositories/announcement.repository.interface'
import { AnnouncementEntity } from 'src/domain/entities/announcement.entity'

export class ListPublicAnnouncementsUseCase {
  constructor(private readonly repo: IAnnouncementRepository) {}

  async execute(): Promise<AnnouncementEntity[]> {
    return this.repo.findPublished()
  }
}
