import { AppError } from "../../../shared/types/app-error";
import { ITeacherRepository } from "../../ports/repositories/teacher.repository.interface";
import { ILogger } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Delete Teacher (Manager only, soft) ───────────────
export class DeleteTeacherUseCase implements IUseCase<string, void> {
  constructor(
    private readonly teacherRepo: ITeacherRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(id: string): Promise<void> {
    const teacher = await this.teacherRepo.findById(id);
    if (!teacher) throw AppError.notFound('Teacher not found');
    await this.teacherRepo.softDelete(id);
    this.logger.info('DeleteTeacherUseCase: soft-deleted', { id });
  }
}
