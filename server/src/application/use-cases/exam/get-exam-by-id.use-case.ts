import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ExamEntity } from 'src/domain/entities/exam.entity'

export class GetExamByIdUseCase {
  constructor(private readonly repo: IExamRepository) {}

  async execute(id: string): Promise<ExamEntity | null> {
    return this.repo.findById(id)
  }
}
