import { IUseCase } from '../interfaces/use-case.interface'
import { ISubjectRepository } from 'src/application/ports/repositories/subject.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { AppError } from 'src/shared/types/app-error'

export class DeleteSubjectUseCase
  implements IUseCase<string, void> {

  constructor(
    private readonly subjectRepo: ISubjectRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(id: string): Promise<void> {
    const subject = await this.subjectRepo.findById(id)
    if (!subject) throw AppError.notFound('Subject not found')

    await this.subjectRepo.delete(id)

    this.logger.info('Subject deleted', { id })
  }
}