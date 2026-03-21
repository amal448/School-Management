import { IUseCase }              from '../interfaces/use-case.interface'
import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import {
  DepartmentResponseDto,
} from 'src/domain/dtos/department.dto'
import { AppError }              from 'src/shared/types/app-error'
import { DepartmentMapper } from 'src/application/mappers'


// ── Get by ID ──────────────────────────────────────────
export class GetDepartmentUseCase
  implements IUseCase<string, DepartmentResponseDto> {

  constructor(private readonly deptRepo: IDepartmentRepository) {}

  async execute(id: string): Promise<DepartmentResponseDto> {
    const dept = await this.deptRepo.findById(id)
    if (!dept) throw AppError.notFound('Department not found')
    return DepartmentMapper.toDto(dept)
  }
}
