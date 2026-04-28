import { IExamScheduleRepository } from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { ExamScheduleEntity } from 'src/domain/entities/exam-schedule.entity'

export class GetMySchedulesForClassUseCase {
  constructor(private readonly repo: IExamScheduleRepository) {}

  async execute(teacherId: string, classId: string): Promise<ExamScheduleEntity[]> {
    return this.repo.findByTeacherAndClass(teacherId, classId)
  }
}
