import { IUseCase }                from '../interfaces/use-case.interface'
import { IExamRepository }         from 'src/application/ports/repositories/exam.repository.interface'
import { IExamScheduleRepository } from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { ILogger }                 from 'src/application/ports/services'
import { ExamResponseDto }         from 'src/domain/dtos/exam.dto'
import { AppError }                from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'

export class DeclareExamUseCase
  implements IUseCase<string, ExamResponseDto> {

  constructor(
    private readonly examRepo:     IExamRepository,
    private readonly scheduleRepo: IExamScheduleRepository,
    private readonly logger:       ILogger,
  ) {}

  async execute(examId: string): Promise<ExamResponseDto> {
    const exam = await this.examRepo.findById(examId)
    if (!exam) throw AppError.notFound('Exam not found')

    // Check all schedules submitted — warn if not (admin can force)
    const allDone = await this.scheduleRepo.allSubmitted(examId)
    if (!allDone) {
      throw AppError.badRequest(
        'Not all marks have been submitted. Use force-declare to override.'
      )
    }

    exam.declare()
    const updated = await this.examRepo.update(examId, exam)

    // Lock all schedules
    const schedules = await this.scheduleRepo.findByExamId(examId)
    for (const s of schedules) {
      s.lock()
      await this.scheduleRepo.update(s.id!, s)
    }

    this.logger.info('DeclareExamUseCase: declared', { examId })
    return ExamMapper.toDto(updated!)
  }
}