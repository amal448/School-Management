import { IUseCase } from '../interfaces/use-case.interface';
import { IAdminRepository } from 'src/application/ports/repositories/admin.repository.interface';
import { ILogger } from 'src/application/ports/services';
import { AppError } from 'src/shared/types/app-error';


// ── Whitelist New Email ────────────────────────────────
// Allows existing admin to whitelist another Google email
export interface WhitelistEmailInput {
  email: string;
  requesterId: string;
}

export class WhitelistAdminEmailUseCase implements IUseCase<WhitelistEmailInput, void> {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: WhitelistEmailInput): Promise<void> {
    const already = await this.adminRepo.isEmailWhitelisted(input.email);
    if (already) throw AppError.conflict('Email is already whitelisted');

    await this.adminRepo.addToWhitelist(input.email, input.requesterId);
    this.logger.info('WhitelistAdminEmailUseCase: added', {
      email: input.email,
      by: input.requesterId,
    });
  }
}