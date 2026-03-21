import { IUseCase }              from '../interfaces/use-case.interface'
import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import { ILogger }               from 'src/application/ports/services'
import { AppError }              from 'src/shared/types/app-error'


// ── Delete ─────────────────────────────────────────────
export class DeleteDepartmentUseCase
  implements IUseCase<string, void> {

  constructor(
    private readonly deptRepo: IDepartmentRepository,
    private readonly logger:   ILogger,
  ) {}

  async execute(id: string): Promise<void> {
    const dept = await this.deptRepo.findById(id)
    if (!dept) throw AppError.notFound('Department not found')

    await this.deptRepo.delete(id)
    this.logger.info('DeleteDepartmentUseCase: deleted', { id })
  }
}