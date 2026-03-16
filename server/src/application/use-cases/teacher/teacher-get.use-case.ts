import { TeacherResponseDto } from "../../../domain/dtos/teacher.dto";
import { AppError } from "../../../shared/types/app-error";
import { TeacherMapper } from "../../mappers";
import { ITeacherRepository } from "../../ports/repositories/teacher.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";

export class GetTeacherUseCase implements IUseCase<string, TeacherResponseDto> {
  constructor(private readonly teacherRepo: ITeacherRepository) {}

  async execute(id: string): Promise<TeacherResponseDto> {
    const teacher = await this.teacherRepo.findById(id);
    if (!teacher) throw AppError.notFound('Teacher not found');
    return TeacherMapper.toDto(teacher);
  }
}