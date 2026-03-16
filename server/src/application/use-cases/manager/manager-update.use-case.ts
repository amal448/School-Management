import { ManagerResponseDto, UpdateManagerDto } from "../../../domain/dtos/manager.dto";
import { AppError } from "../../../shared/types/app-error";
import { ManagerMapper } from "../../mappers";
import { IManagerRepository } from "../../ports/repositories/manager.repository.interface";
import { ILogger } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Update Manager ─────────────────────────────────────
export interface UpdateManagerInput { id: string; dto: UpdateManagerDto; requesterId: string; }

export class UpdateManagerUseCase implements IUseCase<UpdateManagerInput, ManagerResponseDto> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: UpdateManagerInput): Promise<ManagerResponseDto> {
    // Managers can only update their own profile
    if (input.id !== input.requesterId) throw AppError.forbidden('You can only update your own profile');

    const manager = await this.managerRepo.findById(input.id);
    if (!manager) throw AppError.notFound('Manager not found');

    manager.updateProfile(input.dto);
    const updated = await this.managerRepo.update(input.id, manager);
    if (!updated) throw AppError.internal('Update failed');

    this.logger.info('UpdateManagerUseCase: updated', { id: input.id });
    return ManagerMapper.toDto(updated);
  }
}