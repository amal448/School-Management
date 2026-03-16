import { AppError } from "../../../shared/types/app-error";
import { IManagerRepository } from "../../ports/repositories/manager.repository.interface";
import { ILogger } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Delete Manager (soft) ──────────────────────────────
export class DeleteManagerUseCase implements IUseCase<string, void> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(id: string): Promise<void> {
    const manager = await this.managerRepo.findById(id);
    if (!manager) throw AppError.notFound('Manager not found');
    await this.managerRepo.softDelete(id);
    this.logger.info('DeleteManagerUseCase: soft-deleted', { id });
  }
}
