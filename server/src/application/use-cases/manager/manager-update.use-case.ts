import { ManagerResponseDto, UpdateManagerDto } from "src/domain/dtos/manager.dto"
import { IUseCase } from "../interfaces/use-case.interface"
import { IManagerRepository } from "src/application/ports/repositories/manager.repository.interface"
import { ILogger } from "src/application/ports/services"
import { AppError } from "src/shared/types/app-error"
import { ManagerMapper } from "src/application/mappers"

export interface UpdateManagerInput {
  id:            string
  dto:           UpdateManagerDto
  requesterId:   string
  requesterRole: string
}

export class UpdateManagerUseCase
  implements IUseCase<UpdateManagerInput, ManagerResponseDto> {

  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly logger:      ILogger,
  ) {}

  async execute(input: UpdateManagerInput): Promise<ManagerResponseDto> {
    const isOwner   = input.id === input.requesterId
    const isAdmin   = input.requesterRole === 'ADMIN'

    // Business rule: only admin or the manager themselves can update
    if (!isOwner && !isAdmin) {
      throw AppError.forbidden('You do not have permission to update this profile')
    }

    const manager = await this.managerRepo.findById(input.id)
    if (!manager) throw AppError.notFound('Manager not found')

    manager.updateProfile(input.dto)
    const updated = await this.managerRepo.update(input.id, manager)
    if (!updated) throw AppError.internal('Update failed')

    this.logger.info('UpdateManagerUseCase: updated', { id: input.id })
    return ManagerMapper.toDto(updated)
  }
}