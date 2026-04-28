import { IMarksRepository } from 'src/application/ports/repositories/marks.repository.interface'
import { MarksEntity } from 'src/domain/entities/marks.entity'

export class GetStudentResultsUseCase {
  constructor(private readonly repo: IMarksRepository) {}

  async execute(studentId: string): Promise<MarksEntity[]> {
    return this.repo.findByStudentId(studentId)
  }
}
