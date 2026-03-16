import { WinstonLogger, JwtTokenService } from '../../../infrastructure/services';
import { MongooseAdminRepository } from 'src/infrastructure/repositories/admin.repository';
import { GoogleAuthUseCase } from 'src/application/use-cases/auth/google-auth.use-case';
import { configureGoogleOAuth } from 'src/infrastructure/services/google-oauth.service';

import { AdminController } from '../../controllers/admin.controller';
import { createAdminRouter } from '../../routes/admin.routes';
import { Router } from 'express';
import { GetAdminUseCase } from 'src/application/use-cases/admin/admin-get.use-case';
import { ListAdminsUseCase } from 'src/application/use-cases/admin/admin-list.use-case';
import { GetAdminProfileUseCase } from 'src/application/use-cases/admin/admin-getprofile.use-case';
import { DeactivateAdminUseCase } from 'src/application/use-cases/admin/admin-deactive.usecase';
import { WhitelistAdminEmailUseCase } from 'src/application/use-cases/admin/admin-whitelist.usecase';

export function buildAdminModule(
  tokenService: JwtTokenService,
  logger: WinstonLogger,
  authMW: any,
): { repo: MongooseAdminRepository; router: Router } {

  // 1. Repo
  const adminRepo = new MongooseAdminRepository();

  // 2. Google OAuth use case + strategy registration
  const googleAuthUseCase = new GoogleAuthUseCase(adminRepo, tokenService, logger);
  configureGoogleOAuth(googleAuthUseCase);

  // 3. Admin CRUD use cases
  const getAdminUseCase        = new GetAdminUseCase(adminRepo);
  const listAdminsUseCase      = new ListAdminsUseCase(adminRepo);
  const getProfileUseCase      = new GetAdminProfileUseCase(adminRepo);
  const deactivateUseCase      = new DeactivateAdminUseCase(adminRepo, logger);
  const whitelistEmailUseCase  = new WhitelistAdminEmailUseCase(adminRepo, logger);

  // 4. Controller
  const controller = new AdminController(
    getAdminUseCase,
    listAdminsUseCase,
    getProfileUseCase,
    deactivateUseCase,
    whitelistEmailUseCase,
  );

  // 5. Router
  const router = createAdminRouter(controller, authMW);

  return { repo: adminRepo, router };
}