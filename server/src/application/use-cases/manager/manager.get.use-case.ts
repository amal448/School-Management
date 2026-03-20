import { ManagerResponseDto } from "../../../domain/dtos/manager.dto";
import { AppError } from "../../../shared/types/app-error";
import { ManagerMapper } from "../../mappers";
import { IManagerRepository } from "../../ports/repositories/manager.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";


// ── Get Manager by ID ──────────────────────────────────
export interface GetManagerInput {
  targetId:      string
  requesterId:   string
  requesterRole: string
}
// ── Get Manager ────────────────────────────────────────
export class GetManagerUseCase
  implements IUseCase<GetManagerInput, ManagerResponseDto> {

  constructor(private readonly managerRepo: IManagerRepository) {}

  async execute(input: GetManagerInput): Promise<ManagerResponseDto> {
    const manager = await this.managerRepo.findById(input.targetId)
    if (!manager) throw AppError.notFound('Manager not found')
    return ManagerMapper.toDto(manager)
  }
}
