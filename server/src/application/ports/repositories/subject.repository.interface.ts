import { SubjectEntity }   from 'src/domain/entities/subject.entity'
import { SubjectQueryDto } from 'src/domain/dtos/subject.dto'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export interface ISubjectRepository {
  save(subject: SubjectEntity):                        Promise<SubjectEntity>
  update(id: string, subject: SubjectEntity):          Promise<SubjectEntity | null>
  delete(id: string):                                  Promise<boolean>
  findById(id: string):                                Promise<SubjectEntity | null>
  findAll(query: SubjectQueryDto):                     Promise<PaginatedResult<SubjectEntity>>
  findByDeptId(deptId: string):                        Promise<SubjectEntity[]>
  existsByNameInDept(name: string, deptId: string):    Promise<boolean>
}