import { StudentQueryDto } from '../../../domain/dtos/student.dto';
import { StudentEntity } from '../../../domain/entities/student.entity';
import { PaginatedResult } from '../../../shared/types/Pagination-type';


export interface IStudentRepository {
  save(student: StudentEntity): Promise<StudentEntity>;
  update(id: string, student: StudentEntity): Promise<StudentEntity | null>;
  softDelete(id: string): Promise<boolean>;
  findById(id: string): Promise<StudentEntity | null>;
  findByEmail(email: string): Promise<StudentEntity | null>;
  findAll(query: StudentQueryDto): Promise<PaginatedResult<StudentEntity>>;
  findByClass(classId: string): Promise<StudentEntity[]>;
  existsByEmail(email: string): Promise<boolean>;
}
