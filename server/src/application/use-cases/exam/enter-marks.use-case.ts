// src/application/use-cases/exam/enter-marks.use-case.ts

import { IVoidUseCase }              from '../interfaces/use-case.interface'
import { EnterMarksInput }           from '../interfaces/inputs/exam.inputs'  // ← from shared file
import { IExamScheduleRepository }   from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { IExamRepository }           from 'src/application/ports/repositories/exam.repository.interface'
import { IStudentRepository }        from 'src/application/ports/repositories/student.repository.interface'
import { IMarksRepository }          from 'src/application/ports/repositories/marks.repository.interface'
import { ILogger }                   from 'src/application/ports/services/logger.service.interface'
import { MarksEntity }               from 'src/domain/entities/marks.entity'
import { MarksStatus, ExamStatus }   from 'src/domain/enums'
import { AppError }                  from 'src/shared/types/app-error'

// ← REMOVED: local EnterMarksInput interface — it now lives in exam.inputs.ts

export class EnterMarksUseCase implements IVoidUseCase<EnterMarksInput> {

  constructor(
    private readonly scheduleRepo: IExamScheduleRepository,
    private readonly examRepo:     IExamRepository,
    private readonly studentRepo:  IStudentRepository,
    private readonly marksRepo:    IMarksRepository,
    private readonly logger:       ILogger,
  ) {}

  async execute(input: EnterMarksInput): Promise<void> {
    const schedule = await this.scheduleRepo.findById(input.dto.scheduleId)
    if (!schedule) throw AppError.notFound('Exam schedule not found')

    if (schedule.teacherId !== input.teacherId) {
      throw AppError.forbidden('You are not assigned to enter marks for this schedule')
    }

    if (schedule.marksStatus !== MarksStatus.PENDING) {
      throw AppError.badRequest('Marks already submitted for this schedule')
    }

    const exam = await this.examRepo.findById(schedule.examId)
    if (!exam) throw AppError.notFound('Exam not found')

    if (
      exam.status !== ExamStatus.ONGOING      &&
      exam.status !== ExamStatus.MARKS_PENDING &&
      exam.status !== ExamStatus.SCHEDULED
    ) {
      throw AppError.badRequest('Exam is not accepting marks at this time')
    }

    const totalMarks = schedule.totalMarks

    const students = await this.studentRepo.findAll({
      classId: schedule.classId,
      limit:   1000,
    })
    const studentIds = new Set(students.data.map((s) => s.id))

    for (const entry of input.dto.entries) {
      if (!studentIds.has(entry.studentId)) {
        throw AppError.badRequest(`Student ${entry.studentId} is not in this class`)
      }
      if (!entry.isAbsent && entry.marksScored > totalMarks) {
        throw AppError.badRequest(
          `Marks scored cannot exceed total marks (${totalMarks})`
        )
      }
    }

    const marksEntities = input.dto.entries.map((entry) =>
      MarksEntity.create({
        examId:      schedule.examId,
        scheduleId:  schedule.id!,
        studentId:   entry.studentId,
        subjectId:   schedule.subjectId,
        classId:     schedule.classId,
        marksScored: entry.isAbsent ? 0 : entry.marksScored,
        totalMarks,
        isAbsent:    entry.isAbsent,
        gradedBy:    input.teacherId,
        gradedAt:    new Date(),
      })
    )

    await this.marksRepo.saveMany(marksEntities)

    schedule.submitMarks()
    await this.scheduleRepo.update(schedule.id!, schedule)

    const allDone = await this.scheduleRepo.allSubmitted(schedule.examId)
    if (allDone) {
      exam.markPending()
      await this.examRepo.update(exam.id!, exam)
    }

    this.logger.info('EnterMarksUseCase: submitted', {
      scheduleId: schedule.id,
      count:      marksEntities.length,
    })
  }
}