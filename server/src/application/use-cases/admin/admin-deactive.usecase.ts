import { IAdminRepository } from "src/application/ports/repositories/admin.repository.interface";
import { IUseCase } from "../interfaces/use-case.interface";
import { ILogger } from "src/application/ports/services";
import { AppError } from "src/shared/types/app-error";
import { DeactivateAdminInput } from "../interfaces/inputs";


export class DeactivateAdminUseCase implements IUseCase<DeactivateAdminInput, void> {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: DeactivateAdminInput): Promise<void> {
    if (input.targetId === input.requesterId) {
      throw AppError.badRequest('You cannot deactivate your own account')
    }
    const admin = await this.adminRepo.findById(input.targetId)
    if (!admin) throw AppError.notFound('Admin not found')

    await this.adminRepo.softDelete(input.targetId)
    this.logger.info('DeactivateAdminUseCase: deactivated', {...input})
  }
}