import { TeacherEntity } from '../../../domain/entities/teacher.entity';
import { IBaseRepository, PaginationOptions } from './base.repository.interface';

export interface TeacherQueryDto extends PaginationOptions {
  isActive?: boolean
  deptId?:   string
  search?:   string
}


export interface ITeacherRepository extends IBaseRepository<TeacherEntity,TeacherQueryDto> {
  softDelete(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<TeacherEntity | null>;
  findByDeptAndSubject(deptId: string, subjectId: string): Promise<TeacherEntity[]>
  findByIds(ids: string[]): Promise<TeacherEntity[]>
  findByLevel(level: string): Promise<TeacherEntity[]>
  existsByEmail(email: string): Promise<boolean>;
  countByDept(deptId: string): Promise<number>;
}
