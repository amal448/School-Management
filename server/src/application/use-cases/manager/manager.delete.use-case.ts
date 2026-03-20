import { IManagerRepository } from "src/application/ports/repositories/manager.repository.interface"
import { IUseCase } from "../interfaces/use-case.interface"
import { ILogger } from "src/application/ports/services"
import { AppError } from "src/shared/types/app-error"

// ── Delete Manager (soft) — Admin only ────────────────
export interface DeleteManagerInput {
  targetId:    string
  requesterId: string
}

export class DeleteManagerUseCase
  implements IUseCase<DeleteManagerInput, void> {

  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly logger:      ILogger,
  ) {}

  async execute(input: DeleteManagerInput): Promise<void> {
    const manager = await this.managerRepo.findById(input.targetId)
    if (!manager) throw AppError.notFound('Manager not found')

    await this.managerRepo.softDelete(input.targetId)

    this.logger.info('DeleteManagerUseCase: soft-deleted', {
      id: input.targetId,
      by: input.requesterId,
    })
  }
}