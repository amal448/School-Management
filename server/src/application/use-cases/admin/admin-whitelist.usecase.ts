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

export class WhitelistEmailUseCase implements IUseCase<WhitelistEmailInput, void> {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: WhitelistEmailInput): Promise<void> {
    // Check both roles — an email can only appear once across all roles
    const existsAsAdmin   = await this.adminRepo.isEmailWhitelisted(input.email, 'admin')
    const existsAsManager = await this.adminRepo.isEmailWhitelisted(input.email, 'manager')

    if (existsAsAdmin || existsAsManager) {
      throw AppError.conflict('This email is already whitelisted')
    }

    await this.adminRepo.addToWhitelist(input.email, input.role, input.requesterId)
    this.logger.info('WhitelistEmailUseCase: added', { email: input.email, role: input.role })
  }
}