import { PaginatedStudentsDto, StudentQueryDto } from "../../../domain/dtos/student.dto";
import { StudentEntity } from "../../../domain/entities/student.entity";
import { DEFAULT_LIMIT } from "../../../shared/constants";
import { PaginatedResult } from "../../../shared/types/Pagination-type";
import { StudentMapper } from "../../mappers";
import { IStudentRepository } from "../../ports/repositories/student.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";

// ── List Students ──────────────────────────────────────
export class ListStudentsUseCase implements IUseCase<StudentQueryDto, PaginatedStudentsDto> {
  constructor(private readonly studentRepo: IStudentRepository) {}

  async execute(query: StudentQueryDto): Promise<PaginatedStudentsDto> {
    const result: PaginatedResult<StudentEntity> = await this.studentRepo.findAll(query);
    return {
      data: StudentMapper.toDtoList(result.data),
      total: result.total,
      page: result.page,
      limit: query.limit ?? DEFAULT_LIMIT,
      totalPages: Math.ceil(result.total / (query.limit ?? DEFAULT_LIMIT)),
    };
  }
}