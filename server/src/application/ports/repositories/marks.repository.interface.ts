// src/application/ports/repositories/marks.repository.interface.ts

import { MarksEntity } from 'src/domain/entities/marks.entity'

export interface IMarksRepository {
  // save(marks: MarksEntity): Promise<MarksEntity>
  saveMany(marks: MarksEntity[]): Promise<void>
  // findById(id: string): Promise<MarksEntity | null>
  findByScheduleId(scheduleId: string): Promise<MarksEntity[]>
  findByStudentId(studentId: string): Promise<MarksEntity[]>
  findByClassAndExam(classId: string, examId: string): Promise<MarksEntity[]>
  findByStudentAndExam(studentId: string, examId: string): Promise<MarksEntity[]>
}