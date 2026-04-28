import { IAnnouncementRepository } from 'src/application/ports/repositories/announcement.repository.interface'
import { AnnouncementEntity } from 'src/domain/entities/announcement.entity'
import { AppError } from 'src/shared/types/app-error'

export class TogglePinAnnouncementUseCase {
  constructor(private readonly repo: IAnnouncementRepository) {}

  async execute(id: string): Promise<AnnouncementEntity> {
    const entity = await this.repo.findById(id)
    if (!entity) throw AppError.notFound('Announcement not found')

    entity.togglePin()
    const updated = await this.repo.update(id, entity)
    return updated!
  }
}
