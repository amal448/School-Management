import { TeacherQueryDto } from '../../../domain/dtos/teacher.dto';
import { TeacherEntity } from '../../../domain/entities/teacher.entity';
import { PaginatedResult } from '../../../shared/types/Pagination-type';



export interface ITeacherRepository {
  save(teacher: TeacherEntity): Promise<TeacherEntity>;
  update(id: string, teacher: TeacherEntity): Promise<TeacherEntity | null>;
  softDelete(id: string): Promise<boolean>;
  findById(id: string): Promise<TeacherEntity | null>;
  findByEmail(email: string): Promise<TeacherEntity | null>;
  findByDeptAndSubject(deptId: string, subjectId: string): Promise<TeacherEntity[]>
  findByIds(ids: string[]): Promise<TeacherEntity[]>

  findByLevel(level: string): Promise<TeacherEntity[]>
  
  findAll(query: TeacherQueryDto): Promise<PaginatedResult<TeacherEntity>>;
  existsByEmail(email: string): Promise<boolean>;
  countByDept(deptId: string): Promise<number>;
}
