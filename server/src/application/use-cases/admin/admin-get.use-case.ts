import { IAdminRepository } from "src/application/ports/repositories/admin.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";
import { AdminResponseDto } from "src/domain/dtos/admin.dto";
import { AppError } from "src/shared/types/app-error";
import { AdminMapper } from "src/application/mappers";

// ── Get Admin by ID ────────────────────────────────────
export class GetAdminUseCase implements IUseCase<string, AdminResponseDto> {
  constructor(private readonly adminRepo: IAdminRepository) {}

  async execute(id: string): Promise<AdminResponseDto> {
    const admin = await this.adminRepo.findById(id);
    if (!admin) throw AppError.notFound('Admin not found');
    return AdminMapper.toDto(admin);
  }
}

