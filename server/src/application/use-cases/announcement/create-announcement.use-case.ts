import { IAnnouncementRepository } from 'src/application/ports/repositories/announcement.repository.interface'
import { AnnouncementEntity, AnnouncementCategory } from 'src/domain/entities/announcement.entity'

export interface CreateAnnouncementDto {
  title: string
  content: string
  category: AnnouncementCategory
  eventDate?: string | Date
  isPublished?: boolean
  isPinned?: boolean
}

export class CreateAnnouncementUseCase {
  constructor(private readonly repo: IAnnouncementRepository) {}

  async execute(dto: CreateAnnouncementDto, createdBy: string): Promise<AnnouncementEntity> {
    const entity = AnnouncementEntity.create({
      title:       dto.title,
      content:     dto.content,
      category:    dto.category,
      eventDate:   dto.eventDate ? new Date(dto.eventDate) : undefined,
      isPublished: dto.isPublished ?? false,
      isPinned:    dto.isPinned ?? false,
      createdBy,
    })
    return this.repo.save(entity)
  }
}
