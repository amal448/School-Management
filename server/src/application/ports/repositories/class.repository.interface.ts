// src/application/ports/repositories/class.repository.interface.ts

import { IBaseRepository, PaginationOptions } from './base.repository.interface'
import { ClassEntity } from 'src/domain/entities/class.entity'

export interface ClassQueryDto extends PaginationOptions {
  grade?: string
}

export interface IClassRepository extends IBaseRepository<ClassEntity, ClassQueryDto> {
  existsByNameSection(
    className: string, section: string,
  ): Promise<boolean>
  assignSubjectTeacher(
    classId: string,
    subjectId: string,
    teacherId: string,
  ): Promise<ClassEntity | null>
  findByGrade(grade: string): Promise<ClassEntity[]>   // ← add
}