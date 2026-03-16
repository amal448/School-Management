import { StudentResponseDto } from "../../../domain/dtos/student.dto";
import { Role } from "../../../domain/enums";
import { AppError } from "../../../shared/types/app-error";
import { StudentMapper } from "../../mappers";
import { IStudentRepository } from "../../ports/repositories/student.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Get Student by ID ──────────────────────────────────
export interface GetStudentInput { targetId: string; requesterId: string; requesterRole: Role; }

export class GetStudentUseCase implements IUseCase<GetStudentInput, StudentResponseDto> {
  constructor(private readonly studentRepo: IStudentRepository) {}

  async execute(input: GetStudentInput): Promise<StudentResponseDto> {
    // Students may only view their own profile; teachers/managers can view any
    const isOwner   = input.targetId === input.requesterId;
    const isPrivileged = [Role.MANAGER, Role.TEACHER].includes(input.requesterRole);
    if (!isOwner && !isPrivileged) throw AppError.forbidden('Access denied');

    const student = await this.studentRepo.findById(input.targetId);
    if (!student) throw AppError.notFound('Student not found');
    return StudentMapper.toDto(student);
  }
}