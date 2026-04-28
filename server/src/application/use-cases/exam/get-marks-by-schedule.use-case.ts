import { IMarksRepository } from 'src/application/ports/repositories/marks.repository.interface'
import { MarksEntity } from 'src/domain/entities/marks.entity'

export class GetMarksByScheduleUseCase {
  constructor(private readonly repo: IMarksRepository) {}

  async execute(scheduleId: string): Promise<MarksEntity[]> {
    return this.repo.findByScheduleId(scheduleId)
  }
}
