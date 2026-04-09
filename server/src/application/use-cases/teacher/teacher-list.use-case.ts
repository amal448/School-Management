import { PaginatedTeachersDto, TeacherQueryDto } from "../../../domain/dtos/teacher.dto";
import { TeacherEntity } from "../../../domain/entities/teacher.entity";
import { DEFAULT_LIMIT } from "../../../shared/constants";
import { PaginatedResult } from "../../../shared/types/Pagination-type";
import { TeacherMapper } from "../../mappers";
import { ITeacherRepository } from "../../ports/repositories/teacher.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";

export class ListTeachersUseCase implements IUseCase<TeacherQueryDto, PaginatedTeachersDto> {
  constructor(private readonly teacherRepo: ITeacherRepository) { }

  async execute(query: TeacherQueryDto): Promise<PaginatedTeachersDto> {
    const result: PaginatedResult<TeacherEntity> = await this.teacherRepo.findAll(query);
    return {
     data: result.data.map((t: any) => ({
        ...TeacherMapper.toDto(t),
        deptName: t.deptName ?? null,
      })),
      total: result.total,
      page: result.page,
      limit: query.limit ?? DEFAULT_LIMIT,
      totalPages: Math.ceil(result.total / (query.limit ?? DEFAULT_LIMIT)),
    };
  }
}