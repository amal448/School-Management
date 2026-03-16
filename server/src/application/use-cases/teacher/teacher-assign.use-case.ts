import { TeacherResponseDto } from "../../../domain/dtos/teacher.dto";
import { AppError } from "../../../shared/types/app-error";
import { TeacherMapper } from "../../mappers";
import { ITeacherRepository } from "../../ports/repositories/teacher.repository.interface";
import { ILogger } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Assign Teacher to Department (Manager only) ────────
export interface AssignDeptInput { teacherId: string; deptId: string; }

export class AssignTeacherDeptUseCase implements IUseCase<AssignDeptInput, TeacherResponseDto> {
  constructor(
    private readonly teacherRepo: ITeacherRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: AssignDeptInput): Promise<TeacherResponseDto> {
    const teacher = await this.teacherRepo.findById(input.teacherId);
    if (!teacher) throw AppError.notFound('Teacher not found');

    teacher.assignToDepartment(input.deptId);
    const updated = await this.teacherRepo.update(input.teacherId, teacher);
    if (!updated) throw AppError.internal('Assignment failed');

    this.logger.info('AssignTeacherDeptUseCase', { teacherId: input.teacherId, deptId: input.deptId });
    return TeacherMapper.toDto(updated);
  }
}
