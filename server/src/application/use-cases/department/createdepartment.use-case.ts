import { IUseCase }              from '../interfaces/use-case.interface'
import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import { ILogger }               from 'src/application/ports/services'
import { DepartmentEntity }      from 'src/domain/entities/department.entity'
import {
  CreateDepartmentDto,
  DepartmentResponseDto,
} from 'src/domain/dtos/department.dto'
import { AppError }              from 'src/shared/types/app-error'
import { DepartmentMapper } from 'src/application/mappers'

// ── Create ─────────────────────────────────────────────
export class CreateDepartmentUseCase
  implements IUseCase<CreateDepartmentDto, DepartmentResponseDto> {

  constructor(
    private readonly deptRepo: IDepartmentRepository,
    private readonly logger:   ILogger,
  ) {}

  async execute(input: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const exists = await this.deptRepo.existsByName(input.deptName)
    if (exists) throw AppError.conflict('A department with this name already exists')

    const dept  = DepartmentEntity.create(input)
    const saved = await this.deptRepo.save(dept)

    this.logger.info('CreateDepartmentUseCase: created', { id: saved.id })
    return DepartmentMapper.toDto(saved)
  }
}
