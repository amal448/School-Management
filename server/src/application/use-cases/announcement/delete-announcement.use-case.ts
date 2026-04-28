import { IAnnouncementRepository } from 'src/application/ports/repositories/announcement.repository.interface'
import { AppError } from 'src/shared/types/app-error'

export class DeleteAnnouncementUseCase {
  constructor(private readonly repo: IAnnouncementRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.repo.existsById(id)
    if (!exists) throw AppError.notFound('Announcement not found')

    await this.repo.delete(id)
  }
}
