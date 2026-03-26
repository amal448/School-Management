import { ExamTimetableEntity } from 'src/domain/entities/exam-timetable.entity'

export interface IExamTimetableRepository {
    save(entry: ExamTimetableEntity): Promise<ExamTimetableEntity>
    update(id: string, entry: ExamTimetableEntity): Promise<ExamTimetableEntity | null>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<ExamTimetableEntity | null>
    findByExamId(examId: string): Promise<ExamTimetableEntity[]>
    existsByExamAndSubject(
        examId: string, subjectId: string,
    ): Promise<boolean>
}