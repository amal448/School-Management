import { ManagerResponseDto } from "../../../domain/dtos/manager.dto";
import { AppError } from "../../../shared/types/app-error";
import { ManagerMapper } from "../../mappers";
import { IManagerRepository } from "../../ports/repositories/manager.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Get Manager ────────────────────────────────────────
export class GetManagerUseCase implements IUseCase<string, ManagerResponseDto> {
  constructor(private readonly managerRepo: IManagerRepository) {}

  async execute(id: string): Promise<ManagerResponseDto> {
    const manager = await this.managerRepo.findById(id);
    if (!manager) throw AppError.notFound(`Manager not found`);
    return ManagerMapper.toDto(manager);
  }
}
