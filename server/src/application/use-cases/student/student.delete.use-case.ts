import { AppError } from "../../../shared/types/app-error";
import { IStudentRepository } from "../../ports/repositories/student.repository.interface";
import { ILogger } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Delete Student (Manager only, soft) ───────────────
export class DeleteStudentUseCase implements IUseCase<string, void> {
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(id: string): Promise<void> {
    const student = await this.studentRepo.findById(id);
    if (!student) throw AppError.notFound('Student not found');
    await this.studentRepo.softDelete(id);
    this.logger.info('DeleteStudentUseCase: soft-deleted', { id });
  }
}