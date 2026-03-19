import { IUseCase } from '../interfaces/use-case.interface';
import { IAdminRepository } from 'src/application/ports/repositories/admin.repository.interface';
import { ILogger } from 'src/application/ports/services';
import { AppError } from 'src/shared/types/app-error';


// ── Whitelist New Email ────────────────────────────────
// Allows existing admin to whitelist another Google email
export interface WhitelistEmailInput {
  email:       string
  role:        'admin' | 'manager'
  requesterId: string
}

export class RemoveWhitelistUseCase implements IUseCase<string, void> {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(email: string): Promise<void> {
    await this.adminRepo.removeFromWhitelist(email)
    this.logger.info('RemoveWhitelistUseCase: removed', { email })
  }
}
