import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ExamEntity } from 'src/domain/entities/exam.entity'
import { PaginatedResult } from 'src/application/ports/repositories/base.repository.interface'

export class ListExamsUseCase {
  constructor(private readonly repo: IExamRepository) {}

  async execute(query: any): Promise<PaginatedResult<ExamEntity>> {
    return this.repo.findAll(query)
  }
}
