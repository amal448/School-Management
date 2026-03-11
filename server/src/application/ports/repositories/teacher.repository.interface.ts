import { Teacher } from '../../../domain/entities/teacher.entity';

export interface ITeacherRepository {
  save(teacher: Teacher): Promise<void>;
  findAll(): Promise<Teacher[]>;
  update(id: string, teacher: Partial<Teacher>): Promise<void>;
}