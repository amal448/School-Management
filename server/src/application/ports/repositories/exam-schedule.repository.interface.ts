// src/application/ports/repositories/exam-schedule.repository.interface.ts

import { MarksStatus }         from 'src/domain/enums'
import { ExamScheduleEntity }  from 'src/domain/entities/exam-schedule.entity'

export interface IExamScheduleRepository {
  save(schedule: ExamScheduleEntity):               Promise<ExamScheduleEntity>
  saveMany(schedules: ExamScheduleEntity[]):        Promise<void>
  update(id: string, s: ExamScheduleEntity):        Promise<ExamScheduleEntity | null>
  findById(id: string):                             Promise<ExamScheduleEntity | null>
  findByExamId(examId: string):                     Promise<ExamScheduleEntity[]>
  findByTeacherId(teacherId: string):               Promise<ExamScheduleEntity[]>
  findByTeacherIdAndStatus(
    teacherId: string,
    status: MarksStatus,
  ):                                                Promise<ExamScheduleEntity[]>
  findByTeacherIdAndStatuses(
    teacherId: string,
    statuses: MarksStatus[],
  ):                                                Promise<ExamScheduleEntity[]>
  findByExamAndClass(
    examId: string,
    classId: string,
  ):                                                Promise<ExamScheduleEntity[]>
  findByTeacherAndClass(
    teacherId: string,
    classId: string,
  ):                                                Promise<ExamScheduleEntity[]>
  allSubmitted(examId: string):                     Promise<boolean>
}