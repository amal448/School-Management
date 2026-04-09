// src/application/use-cases/teacher/list-teacher-classes.use-case.ts
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface';
import { ClassMapper } from 'src/application/mappers';

export class ListTeacherClassesUseCase {
  constructor(private readonly classRepo: IClassRepository) {}

  async execute(teacherId: string) {
    // 1. Fetch data through the Port
    // We get a larger set, but the filtering is business logic
    const result = await this.classRepo.findAll({ limit: 1000 });

    // 2. Business Logic: Identify which classes belong to this specific teacher
    const teacherClasses = result.data.filter((cls) => {
      const isClassTeacher = cls.classTeacherId === teacherId;
      const isSubjectTeacher = cls.subjectAllocations.some(
        (allocation) => allocation.teacherId === teacherId
      );
      return isClassTeacher || isSubjectTeacher;
    });

    // 3. Return DTOs
    return teacherClasses.map(ClassMapper.toDto);
  }
}