import { IAnnouncementRepository } from 'src/application/ports/repositories/announcement.repository.interface'
import { AnnouncementEntity, AnnouncementCategory } from 'src/domain/entities/announcement.entity'
import { AppError } from 'src/shared/types/app-error'

export interface UpdateAnnouncementDto {
  title?: string
  content?: string
  category?: AnnouncementCategory
  eventDate?: string | Date
}

export class UpdateAnnouncementUseCase {
  constructor(private readonly repo: IAnnouncementRepository) {}

  async execute(id: string, dto: UpdateAnnouncementDto): Promise<AnnouncementEntity> {
    const entity = await this.repo.findById(id)
    if (!entity) throw AppError.notFound('Announcement not found')

    entity.update({
      title:     dto.title,
      content:   dto.content,
      category:  dto.category,
      eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
    })

    const updated = await this.repo.update(id, entity)
    return updated!
  }
}
