import { IUseCase } from '../interfaces/use-case.interface'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { AppError } from 'src/shared/types/app-error'

export class DeleteClassUseCase
  implements IUseCase<string, void> {

  constructor(
    private readonly classRepo: IClassRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(id: string): Promise<void> {
    const cls = await this.classRepo.findById(id)
    if (!cls) throw AppError.notFound('Class not found')

    await this.classRepo.delete(id)

    this.logger.info('Class deleted', { id })
  }
}