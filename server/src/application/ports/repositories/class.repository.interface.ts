// src/application/ports/repositories/class.repository.interface.ts

import { ClassEntity }   from 'src/domain/entities/class.entity'
import { ClassQueryDto } from 'src/domain/dtos/class.dto'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export interface IClassRepository {
  save(cls: ClassEntity):                           Promise<ClassEntity>
  update(id: string, cls: ClassEntity):             Promise<ClassEntity | null>
  delete(id: string):                               Promise<boolean>
  findById(id: string):                             Promise<ClassEntity | null>
  findAll(query: ClassQueryDto):                    Promise<PaginatedResult<ClassEntity>>
  existsByNameSection(
    className: string, section: string,
  ):                                                Promise<boolean>
  assignSubjectTeacher(
    classId:   string,
    subjectId: string,
    teacherId: string,
  ):                                                Promise<ClassEntity | null>
  findByGrade(grade: string):                       Promise<ClassEntity[]>   // ← add
}