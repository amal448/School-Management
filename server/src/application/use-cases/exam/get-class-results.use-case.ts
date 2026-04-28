import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { IMarksRepository } from 'src/application/ports/repositories/marks.repository.interface'
import { MarksEntity } from 'src/domain/entities/marks.entity'
import { AppError } from 'src/shared/types/app-error'

export class GetClassResultsUseCase {
  constructor(
    private readonly examRepo: IExamRepository,
    private readonly marksRepo: IMarksRepository
  ) {}

  async execute(classId: string, examId: string): Promise<MarksEntity[]> {
    const exam = await this.examRepo.findById(examId)
    if (!exam) throw AppError.notFound('Exam not found')
    if (exam.status !== 'declared') {
      throw AppError.forbidden('Results not yet declared')
    }
    return this.marksRepo.findByClassAndExam(classId, examId)
  }
}
