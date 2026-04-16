import { IBaseRepository, PaginationOptions } from './base.repository.interface'
import { AnnouncementEntity } from 'src/domain/entities/announcement.entity'

export interface AnnouncementQueryDto extends PaginationOptions {
  category?:    string
  isPublished?: boolean
  isPinned?:    boolean
  search?:      string
}

export interface IAnnouncementRepository
  extends IBaseRepository<AnnouncementEntity, AnnouncementQueryDto> {
  findPublished(): Promise<AnnouncementEntity[]>
}