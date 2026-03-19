import { IManagerRepository } from "src/application/ports/repositories/manager.repository.interface"
import { IUseCase } from "../interfaces/use-case.interface"
import { ILogger } from "src/application/ports/services"
import { AppError } from "src/shared/types/app-error"

// ── Unblock Manager ────────────────────────────────────
export class UnblockManagerUseCase implements IUseCase<string, void> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(managerId: string): Promise<void> {
    const manager = await this.managerRepo.findById(managerId)
    if (!manager) throw AppError.notFound('Manager not found')
    if (!manager.isBlocked) throw AppError.badRequest('Manager is not blocked')

    manager.unblock()
    await this.managerRepo.update(managerId, manager)
    this.logger.info('UnblockManagerUseCase: unblocked', { managerId })
  }
}