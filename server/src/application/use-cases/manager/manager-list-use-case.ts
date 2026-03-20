import { ManagerQueryDto, PaginatedManagersDto } from "src/domain/dtos/manager.dto"
import { IUseCase } from "../interfaces/use-case.interface"
import { IManagerRepository } from "src/application/ports/repositories/manager.repository.interface"
import { ManagerEntity } from "src/domain/entities/manager.entity"
import { PaginatedResult } from "src/shared/types/Pagination-type"
import { DEFAULT_LIMIT } from "src/shared/constants"
import { ManagerMapper } from "src/application/mappers"

// ── List Managers (Admin only) ─────────────────────────
export class ListManagersUseCase
  implements IUseCase<ManagerQueryDto, PaginatedManagersDto> {

  constructor(private readonly managerRepo: IManagerRepository) {}

  async execute(query: ManagerQueryDto): Promise<PaginatedManagersDto> {
    const result: PaginatedResult<ManagerEntity> =
      await this.managerRepo.findAll(query)

    const limit      = query.limit ?? DEFAULT_LIMIT
    const totalPages = Math.ceil(result.total / limit)

    return {
      data:  ManagerMapper.toDtoList(result.data),
      total: result.total,
      page:  result.page,
      limit,
      totalPages,
    }
  }
}