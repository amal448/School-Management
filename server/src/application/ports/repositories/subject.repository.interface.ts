import { SubjectEntity }   from 'src/domain/entities/subject.entity'
import { IBaseRepository, PaginationOptions } from './base.repository.interface'

export interface SubjectQueryDto extends PaginationOptions {
  deptId?: string
  search?: string
}

export interface ISubjectRepository
  extends IBaseRepository<SubjectEntity, SubjectQueryDto> {
  findByDeptId(deptId: string):                        Promise<SubjectEntity[]>
  existsByNameInDept(name: string, deptId: string):    Promise<boolean>
}