import { IExamScheduleRepository } from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { ExamScheduleEntity } from 'src/domain/entities/exam-schedule.entity'
import { MarksStatus } from 'src/domain/enums'

export class GetMySubmittedMarksUseCase {
  constructor(private readonly repo: IExamScheduleRepository) {}

  async execute(teacherId: string): Promise<ExamScheduleEntity[]> {
    return this.repo.findByTeacherIdAndStatuses(teacherId, [MarksStatus.SUBMITTED, MarksStatus.LOCKED])
  }
}
