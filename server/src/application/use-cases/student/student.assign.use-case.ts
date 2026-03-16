import { StudentResponseDto } from "../../../domain/dtos/student.dto";
import { AppError } from "../../../shared/types/app-error";
import { StudentMapper } from "../../mappers";
import { IStudentRepository } from "../../ports/repositories/student.repository.interface";
import { ILogger } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Assign Student to Class (Manager only) ─────────────
export interface AssignClassInput { studentId: string; classId: string; }

export class AssignStudentClassUseCase implements IUseCase<AssignClassInput, StudentResponseDto> {
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: AssignClassInput): Promise<StudentResponseDto> {
    const student = await this.studentRepo.findById(input.studentId);
    if (!student) throw AppError.notFound('Student not found');

    student.assignToClass(input.classId);
    const updated = await this.studentRepo.update(input.studentId, student);
    if (!updated) throw AppError.internal('Assignment failed');

    this.logger.info('AssignStudentClassUseCase', input);
    return StudentMapper.toDto(updated);
  }
}
