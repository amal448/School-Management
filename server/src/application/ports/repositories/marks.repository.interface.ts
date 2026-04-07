import { MarksEntity } from 'src/domain/entities/marks.entity'

export interface IMarksRepository {
  saveMany(marks: MarksEntity[]): Promise<void>
  findByScheduleId(scheduleId: string): Promise<MarksEntity[]>
  findByStudentAndExam(studentId: string, examId: string,): Promise<MarksEntity[]>
  findByClassAndExam(classId: string, examId: string,): Promise<MarksEntity[]>
  existsBySchedule(scheduleId: string): Promise<boolean>
  findByStudentId(studentId: string): Promise<MarksEntity[]>

}