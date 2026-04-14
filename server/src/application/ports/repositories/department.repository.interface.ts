import { IBaseRepository, PaginationOptions } from './base.repository.interface'
import { DepartmentEntity } from 'src/domain/entities/department.entity'

export interface DepartmentQueryDto extends PaginationOptions {
  search?: string
}
export interface IDepartmentRepository extends IBaseRepository<DepartmentEntity, DepartmentQueryDto> {
  existsByName(name: string): Promise<boolean>
}