import { TeacherMapper } from 'src/application/mappers';
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface';
import { TeacherResponseDto } from 'src/domain/dtos/teacher.dto';

export class GetTeachersByLevelUseCase {
  constructor(private readonly teacherRepo: ITeacherRepository) {}

  async execute(level: string): Promise<TeacherResponseDto[]> {
    const teachers = await this.teacherRepo.findByLevel(level);
    return teachers.map(TeacherMapper.toDto);
  }
}