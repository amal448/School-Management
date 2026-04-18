import { IUseCase } from '../interfaces/use-case.interface'
import { ITopperRepository } from 'src/application/ports/repositories/topper.repository.interface'
import { AppError } from 'src/shared/types/app-error'

export class DeleteTopperUseCase implements IUseCase<string, void> {
  constructor(private readonly repo: ITopperRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.repo.existsById(id)
    if (!exists) throw AppError.notFound('Topper not found')
    
    await this.repo.delete(id)
  }
}
