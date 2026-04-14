import { StudentEntity } from '../../../domain/entities/student.entity';
import { PaginatedResult } from '../../../shared/types/Pagination-type';
import { IBaseRepository, PaginationOptions } from './base.repository.interface';

export interface StudentQueryDto extends PaginationOptions {
  classId?:  string
  isActive?: boolean
  search?:   string
}

export interface IStudentRepository
  extends IBaseRepository<StudentEntity, StudentQueryDto> {
    
  softDelete(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<StudentEntity | null>;
  findByClass(classId: string): Promise<StudentEntity[]>;
  existsByEmail(email: string): Promise<boolean>;
  assignToClass(id: string, classId: string):      Promise<StudentEntity | null>
}
