// src/application/use-cases/exam/publish-exam.use-case.ts

import { IUseCase }                from '../interfaces/use-case.interface'
import { IExamRepository }         from 'src/application/ports/repositories/exam.repository.interface'
import { IExamScheduleRepository } from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { IClassRepository }        from 'src/application/ports/repositories/class.repository.interface'
import { ILogger }                 from 'src/application/ports/services'
import { ExamScheduleEntity }      from 'src/domain/entities/exam-schedule.entity'
import { ExamStatus, MarksStatus } from 'src/domain/enums'
import { ExamResponseDto }         from 'src/domain/dtos/exam.dto'
import { ExamMapper }              from 'src/application/mappers'   // ← import ExamMapper
import { SubjectAllocation }       from 'src/domain/entities/class.entity'
import { AppError }                from 'src/shared/types/app-error'

export class PublishExamUseCase
  implements IUseCase<string, ExamResponseDto> {

  constructor(
    private readonly examRepo:     IExamRepository,
    private readonly scheduleRepo: IExamScheduleRepository,
    private readonly classRepo:    IClassRepository,
    private readonly logger:       ILogger,
  ) {}

  async execute(examId: string): Promise<ExamResponseDto> {
    const exam = await this.examRepo.findById(examId)
    if (!exam) throw AppError.notFound('Exam not found')

    if (exam.status !== ExamStatus.DRAFT) {
      throw AppError.badRequest('Only draft exams can be published')
    }

    if (!exam.gradeConfigs.length) {
      throw AppError.badRequest('Configure at least one grade before publishing')
    }

    const schedules: ExamScheduleEntity[] = []
    const errors:    string[]             = []

    for (const gradeConfig of exam.gradeConfigs) {
      if (!gradeConfig.commonSubjects.length) {
        errors.push(`Grade ${gradeConfig.grade} has no subjects configured`)
        continue
      }

      // Fix: findByGrade added to IClassRepository
      const classes = await this.classRepo.findByGrade(gradeConfig.grade)
      if (!classes.length) {
        errors.push(`No classes found for grade ${gradeConfig.grade}`)
        continue
      }

      for (const cls of classes) {
        const subjects = exam.getSubjectsForClass(gradeConfig.grade, cls.id!)

        for (const subjectSchedule of subjects) {
          // Fix: explicit type for allocation
          const allocation = cls.subjectAllocations.find(
            (a: SubjectAllocation) => a.subjectId === subjectSchedule.subjectId
          )

          if (!allocation) continue

          if (!allocation.teacherId) {
            errors.push(
              `No teacher assigned for subject in class ${cls.grade}-${cls.section}`
            )
            continue
          }

          schedules.push(
            ExamScheduleEntity.create({
              examId,
              classId:      cls.id!,
              subjectId:    subjectSchedule.subjectId,
              teacherId:    allocation.teacherId,
              examDate:     subjectSchedule.examDate,
              startTime:    subjectSchedule.startTime,
              endTime:      subjectSchedule.endTime,
              totalMarks:   subjectSchedule.totalMarks,
              passingMarks: subjectSchedule.passingMarks,
              marksStatus:  MarksStatus.PENDING,
            })
          )
        }
      }
    }

    if (errors.length) {
      throw AppError.badRequest(errors.join('. '))
    }

    if (!schedules.length) {
      throw AppError.badRequest(
        'No valid schedules generated. Ensure classes have subjects and teachers assigned.'
      )
    }

    await this.scheduleRepo.saveMany(schedules)

    exam.publish()
    const updated = await this.examRepo.update(examId, exam)

    this.logger.info('PublishExamUseCase: published', {
      examId,
      schedulesGenerated: schedules.length,
    })

    return ExamMapper.toDto(updated!)   // ← now found
  }
}