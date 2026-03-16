import { StudentResponseDto, UpdateStudentDto } from "../../../domain/dtos/student.dto";
import { Role } from "../../../domain/enums";
import { AppError } from "../../../shared/types/app-error";
import { StudentMapper } from "../../mappers";
import { IStudentRepository } from "../../ports/repositories/student.repository.interface";
import { ILogger } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

export interface UpdateStudentInput {
  id: string;
  dto: UpdateStudentDto;
  requesterId: string;
  requesterRole: Role;
}

export class UpdateStudentUseCase implements IUseCase<UpdateStudentInput, StudentResponseDto> {
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: UpdateStudentInput): Promise<StudentResponseDto> {
    const isOwner   = input.id === input.requesterId;
    const isManager = input.requesterRole === Role.MANAGER;
    if (!isOwner && !isManager) throw AppError.forbidden('Access denied');

    const student = await this.studentRepo.findById(input.id);
    if (!student) throw AppError.notFound('Student not found');

    student.updateProfile(input.dto);
    const updated = await this.studentRepo.update(input.id, student);
    if (!updated) throw AppError.internal('Update failed');

    this.logger.info('UpdateStudentUseCase: updated', { id: input.id });
    return StudentMapper.toDto(updated);
  }
}
