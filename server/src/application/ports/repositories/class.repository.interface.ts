import { ClassEntity } from 'src/domain/entities/class.entity'
import { ClassQueryDto } from 'src/domain/dtos/class.dto'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export interface IClassRepository {
  save(cls: ClassEntity): Promise<ClassEntity>
  update(id: string, cls: ClassEntity): Promise<ClassEntity | null>
  delete(id: string): Promise<boolean>
  findById(id: string): Promise<ClassEntity | null>
  findAll(query: ClassQueryDto): Promise<PaginatedResult<ClassEntity>>
  existsByNameSection(
    grade: string,
    section: string,
  ): Promise<boolean>
}