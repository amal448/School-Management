import { TeacherResponseDto, UpdateTeacherDto } from "../../../domain/dtos/teacher.dto";
import { Role } from "../../../domain/enums";
import { AppError } from "../../../shared/types/app-error";
import { TeacherMapper } from "../../mappers";
import { ITeacherRepository } from "../../ports/repositories/teacher.repository.interface";
import { ILogger } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

export interface UpdateTeacherInput {
  id: string;
  dto: UpdateTeacherDto;
  requesterId: string;
  requesterRole: Role;
}

export class UpdateTeacherUseCase implements IUseCase<UpdateTeacherInput, TeacherResponseDto> {
  constructor(
    private readonly teacherRepo: ITeacherRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: UpdateTeacherInput): Promise<TeacherResponseDto> {
    const isOwner   = input.id === input.requesterId;
    const isManager = input.requesterRole === Role.MANAGER;
    const isAdmin = input.requesterRole === Role.ADMIN;
    if (!isOwner && !isManager && !isAdmin) throw AppError.forbidden('Access denied');

    const teacher = await this.teacherRepo.findById(input.id);
    if (!teacher) throw AppError.notFound('Teacher not found');

    teacher.updateProfile(input.dto);
    const updated = await this.teacherRepo.update(input.id, teacher);
    if (!updated) throw AppError.internal('Update failed');

    this.logger.info('UpdateTeacherUseCase: updated', { id: input.id });
    return TeacherMapper.toDto(updated);
  }
}