import { DepartmentEntity } from 'src/domain/entities/department.entity'
import { DepartmentQueryDto } from 'src/domain/dtos/department.dto'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export interface IDepartmentRepository {
  save(dept: DepartmentEntity):                        Promise<DepartmentEntity>
  update(id: string, dept: DepartmentEntity):          Promise<DepartmentEntity | null>
  delete(id: string):                                  Promise<boolean>
  findById(id: string):                                Promise<DepartmentEntity | null>
  findAll(query: DepartmentQueryDto):                  Promise<PaginatedResult<DepartmentEntity>>
  existsByName(name: string):                          Promise<boolean>
}