import { IExamScheduleRepository } from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { ExamScheduleEntity } from 'src/domain/entities/exam-schedule.entity'

export class GetExamSchedulesUseCase {
  constructor(private readonly repo: IExamScheduleRepository) {}

  async execute(examId: string): Promise<ExamScheduleEntity[]> {
    return this.repo.findByExamId(examId)
  }
}
