import { IUseCase }              from '../interfaces/use-case.interface'
import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import { ILogger }               from 'src/application/ports/services'
import {
  UpdateDepartmentDto,
  DepartmentResponseDto,
} from 'src/domain/dtos/department.dto'
import { AppError }              from 'src/shared/types/app-error'
import { DepartmentMapper } from 'src/application/mappers'

// ── Update ─────────────────────────────────────────────
export interface UpdateDepartmentInput {
  id:  string
  dto: UpdateDepartmentDto
}

export class UpdateDepartmentUseCase
  implements IUseCase<UpdateDepartmentInput, DepartmentResponseDto> {

  constructor(
    private readonly deptRepo: IDepartmentRepository,
    private readonly logger:   ILogger,
  ) {}

  async execute(input: UpdateDepartmentInput): Promise<DepartmentResponseDto> {
    const dept = await this.deptRepo.findById(input.id)
    if (!dept) throw AppError.notFound('Department not found')

    dept.updateDetails(input.dto)
    const updated = await this.deptRepo.update(input.id, dept)
    if (!updated) throw AppError.internal('Update failed')

    this.logger.info('UpdateDepartmentUseCase: updated', { id: input.id })
    return DepartmentMapper.toDto(updated)
  }
}
