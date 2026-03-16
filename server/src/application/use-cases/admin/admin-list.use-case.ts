import { IAdminRepository } from "src/application/ports/repositories/admin.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";
import { AdminResponseDto } from "src/domain/dtos/admin.dto";
import { AdminMapper } from "src/application/mappers";

// ── List All Admins ────────────────────────────────────
export class ListAdminsUseCase implements IUseCase<void, AdminResponseDto[]> {
  constructor(private readonly adminRepo: IAdminRepository) {}

  async execute(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepo.findAll();
    return admins.map(AdminMapper.toDto);
  }
}