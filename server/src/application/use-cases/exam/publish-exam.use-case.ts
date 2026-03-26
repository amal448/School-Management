import { IUseCase }                   from '../interfaces/use-case.interface'
import { IExamRepository }            from 'src/application/ports/repositories/exam.repository.interface'
import { IExamTimetableRepository }   from 'src/application/ports/repositories/exam-timetable.repository.interface'
import { IExamScheduleRepository }    from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { IClassRepository }           from 'src/application/ports/repositories/class.repository.interface'
import { ILogger }                    from 'src/application/ports/services'
import { ExamScheduleEntity }         from 'src/domain/entities/exam-schedule.entity'
import { ExamStatus, MarksStatus }    from 'src/domain/enums'
import { ExamResponseDto }            from 'src/domain/dtos/exam.dto'
import { AppError }                   from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'

export class PublishExamUseCase
  implements IUseCase<string, ExamResponseDto> {

  constructor(
    private readonly examRepo:      IExamRepository,
    private readonly timetableRepo: IExamTimetableRepository,
    private readonly scheduleRepo:  IExamScheduleRepository,
    private readonly classRepo:     IClassRepository,
    private readonly logger:        ILogger,
  ) {}

  async execute(examId: string): Promise<ExamResponseDto> {
    const exam = await this.examRepo.findById(examId)
    if (!exam) throw AppError.notFound('Exam not found')

    if (exam.status !== ExamStatus.DRAFT) {
      throw AppError.badRequest('Only draft exams can be published')
    }

    const timetable = await this.timetableRepo.findByExamId(examId)
    if (!timetable.length) {
      throw AppError.badRequest('Exam must have at least one timetable entry before publishing')
    }

    // Auto-generate exam_schedule records
    // For each (applicableClass × timetableEntry) where class teaches that subject
    const schedules: ExamScheduleEntity[] = []

    for (const classId of exam.applicableClasses) {
      const cls = await this.classRepo.findById(classId)
      if (!cls) continue

      for (const entry of timetable) {
        // Check if this class has this subject allocated
        const allocation = cls.subjectAllocations.find(
          (a) => a.subjectId === entry.subjectId
        )
        if (!allocation) continue   // skip — class doesn't have this subject

        // Guard: teacherId must exist (subject must be assigned a teacher)
        if (!allocation.teacherId) {
          throw AppError.badRequest(
            `Subject in class ${classId} has no teacher assigned. Assign teachers before publishing.`
          )
        }

        schedules.push(
          ExamScheduleEntity.create({
            examId,
            timetableId: entry.id!,
            classId,
            subjectId:   entry.subjectId,
            teacherId:   allocation.teacherId,   // snapshot
            marksStatus: MarksStatus.PENDING,
          })
        )
      }
    }

    if (!schedules.length) {
      throw AppError.badRequest(
        'No valid schedules could be generated. Ensure classes have subjects allocated.'
      )
    }

    // Save all schedules in one batch
    await this.scheduleRepo.saveMany(schedules)

    // Publish the exam
    exam.publish()
    const updated = await this.examRepo.update(examId, exam)

    this.logger.info('PublishExamUseCase: published', {
      examId,
      schedulesGenerated: schedules.length,
    })

    return ExamMapper.toDto(updated!)
  }
}