import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import {
  DepartmentQueryDto,
} from 'src/domain/dtos/department.dto'
import { DEFAULT_LIMIT }         from 'src/shared/constants/index'
import { DepartmentMapper } from 'src/application/mappers'



// ── List ───────────────────────────────────────────────
export class ListDepartmentsUseCase {
  constructor(private readonly deptRepo: IDepartmentRepository) {}

  async execute(query: DepartmentQueryDto) {
    const result     = await this.deptRepo.findAll(query)
    const limit      = query.limit ?? DEFAULT_LIMIT
    const totalPages = Math.ceil(result.total / limit)

    return {
      data:  result.data.map(DepartmentMapper.toDto),
      total: result.total,
      page:  result.page,
      limit,
      totalPages,
    }
  }
}
