import { IUseCase }                  from '../interfaces/use-case.interface'
import { IExamScheduleRepository }   from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { IExamRepository }           from 'src/application/ports/repositories/exam.repository.interface'
import { IExamTimetableRepository }  from 'src/application/ports/repositories/exam-timetable.repository.interface'
import { IStudentRepository }        from 'src/application/ports/repositories/student.repository.interface'
import { IMarksRepository }          from 'src/application/ports/repositories/marks.repository.interface'
import { ILogger }                   from 'src/application/ports/services'
import { MarksEntity }               from 'src/domain/entities/marks.entity'
import { MarksStatus, ExamStatus }   from 'src/domain/enums'
import { EnterMarksDto }             from 'src/domain/dtos/exam.dto'
import { AppError }                  from 'src/shared/types/app-error'

export interface EnterMarksInput {
  dto:       EnterMarksDto
  teacherId: string           // from JWT — enforces only correct teacher
}

export class EnterMarksUseCase
  implements IUseCase<EnterMarksInput, void> {

  constructor(
    private readonly scheduleRepo:  IExamScheduleRepository,
    private readonly examRepo:      IExamRepository,
    private readonly timetableRepo: IExamTimetableRepository,
    private readonly studentRepo:   IStudentRepository,
    private readonly marksRepo:     IMarksRepository,
    private readonly logger:        ILogger,
  ) {}

  async execute(input: EnterMarksInput): Promise<void> {
    const schedule = await this.scheduleRepo.findById(input.dto.scheduleId)
    if (!schedule) throw AppError.notFound('Exam schedule not found')

    // Only the assigned teacher can enter marks
    if (schedule.teacherId !== input.teacherId) {
      throw AppError.forbidden('You are not assigned to enter marks for this schedule')
    }

    // Marks must be pending
    if (schedule.marksStatus !== MarksStatus.PENDING) {
      throw AppError.badRequest('Marks already submitted for this schedule')
    }

    // Exam must be ongoing or scheduled
    const exam = await this.examRepo.findById(schedule.examId)
    if (!exam) throw AppError.notFound('Exam not found')
    if (
      exam.status !== ExamStatus.ONGOING &&
      exam.status !== ExamStatus.MARKS_PENDING &&
      exam.status !== ExamStatus.SCHEDULED
    ) {
      throw AppError.badRequest('Exam is not in a state that allows marks entry')
    }

    // Get timetable entry for totalMarks
    const timetableEntry = await this.timetableRepo.findById(schedule.timetableId)
    if (!timetableEntry) throw AppError.notFound('Timetable entry not found')

    // Get all students in this class for validation
    const students = await this.studentRepo.findAll({
      classId: schedule.classId,
      limit: 1000,
    })
    const studentIds = new Set(students.data.map((s) => s.id))

    // Validate all entries reference valid students in this class
    for (const entry of input.dto.entries) {
      if (!studentIds.has(entry.studentId)) {
        throw AppError.badRequest(
          `Student ${entry.studentId} is not in this class`
        )
      }
      if (!entry.isAbsent && entry.marksScored > timetableEntry.totalMarks) {
        throw AppError.badRequest(
          `Marks scored cannot exceed total marks (${timetableEntry.totalMarks})`
        )
      }
    }

    // Build marks entities
    const marksEntities = input.dto.entries.map((entry) =>
      MarksEntity.create({
        examId:      schedule.examId,
        scheduleId:  schedule.id!,
        studentId:   entry.studentId,
        subjectId:   schedule.subjectId,
        classId:     schedule.classId,
        marksScored: entry.isAbsent ? 0 : entry.marksScored,
        totalMarks:  timetableEntry.totalMarks,
        isAbsent:    entry.isAbsent,
        gradedBy:    input.teacherId,
        gradedAt:    new Date(),
      })
    )

    // Save all marks
    await this.marksRepo.saveMany(marksEntities)

    // Mark schedule as submitted
    schedule.submitMarks()
    await this.scheduleRepo.update(schedule.id!, schedule)

    // Check if ALL schedules for this exam are now submitted
    // If yes — auto-transition exam to marks_pending or trigger declaration check
    const allDone = await this.scheduleRepo.allSubmitted(schedule.examId)
    if (allDone) {
      exam.markPending()
      await this.examRepo.update(exam.id!, exam)
      this.logger.info('EnterMarksUseCase: all marks submitted — exam marked pending', {
        examId: exam.id,
      })
    }

    this.logger.info('EnterMarksUseCase: marks submitted', {
      scheduleId: schedule.id,
      count:      marksEntities.length,
    })
  }
}