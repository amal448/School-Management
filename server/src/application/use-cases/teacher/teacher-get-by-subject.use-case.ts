// src/application/use-cases/teacher/teacher-get-by-subject.use-case.ts
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface';
import { ISubjectRepository } from 'src/application/ports/repositories/subject.repository.interface';
import { TeacherMapper } from 'src/application/mappers';

export class GetTeachersBySubjectUseCase {
  constructor(
    private readonly teacherRepo: ITeacherRepository,
    private readonly subjectRepo: ISubjectRepository
  ) {}

  async execute(subjectId: string) {
    // 1. Logic: Check if subject exists
    const subject = await this.subjectRepo.findById(subjectId);
    if (!subject) {
      throw new Error('Subject not found'); 
    }

    // 2. Fetch data via the port
    const teachers = await this.teacherRepo.findByDeptAndSubject(
      subject.deptId,
      subjectId
    );

    // 3. Map to DTO
    return teachers.map(TeacherMapper.toDto);
  }
}