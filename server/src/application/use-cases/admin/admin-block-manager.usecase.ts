import { IManagerRepository } from "src/application/ports/repositories/manager.repository.interface"
import { IUseCase } from "../interfaces/use-case.interface"
import { ILogger } from "src/application/ports/services"
import { AppError } from "src/shared/types/app-error"

// ── Block Manager ──────────────────────────────────────
export interface BlockManagerInput {
  managerId:   string
  requesterId: string
}

export class BlockManagerUseCase implements IUseCase<BlockManagerInput, void> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: BlockManagerInput): Promise<void> {
    const manager = await this.managerRepo.findById(input.managerId)
    if (!manager) throw AppError.notFound('Manager not found')
    if (manager.isBlocked) throw AppError.badRequest('Manager is already blocked')

    manager.block(input.requesterId)
    await this.managerRepo.update(input.managerId, manager)
    this.logger.info('BlockManagerUseCase: blocked', input)
  }
}