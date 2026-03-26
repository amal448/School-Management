import { ExamScheduleEntity } from 'src/domain/entities/exam-schedule.entity'
import { MarksStatus }        from 'src/domain/enums'

export interface IExamScheduleRepository {
  save(schedule: ExamScheduleEntity):            Promise<ExamScheduleEntity>
  update(id: string, s: ExamScheduleEntity):     Promise<ExamScheduleEntity | null>
  findById(id: string):                          Promise<ExamScheduleEntity | null>
  findByExamId(examId: string):                  Promise<ExamScheduleEntity[]>
  findByTeacherId(teacherId: string):            Promise<ExamScheduleEntity[]>
  findByTeacherIdAndStatus(
    teacherId: string, status: MarksStatus,
  ):                                             Promise<ExamScheduleEntity[]>
  findByExamAndClass(
    examId: string, classId: string,
  ):                                             Promise<ExamScheduleEntity[]>
  allSubmitted(examId: string):                  Promise<boolean>
  saveMany(schedules: ExamScheduleEntity[]):     Promise<void>
}