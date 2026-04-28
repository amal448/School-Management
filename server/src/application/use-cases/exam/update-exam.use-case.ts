import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ExamEntity } from 'src/domain/entities/exam.entity'
import { AppError } from 'src/shared/types/app-error'

export class UpdateExamUseCase {
  constructor(private readonly repo: IExamRepository) {}

  async execute(id: string, dto: any): Promise<ExamEntity> {
    const exam = await this.repo.findById(id)
    if (!exam) throw AppError.notFound('Exam not found')
    exam.updateDetails(dto)
    const updated = await this.repo.update(id, exam)
    return updated!
  }
}
