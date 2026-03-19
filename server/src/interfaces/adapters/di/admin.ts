import { WinstonLogger, JwtTokenService } from '../../../infrastructure/services';
import { MongooseAdminRepository } from 'src/infrastructure/repositories/admin.repository';
import { MongooseManagerRepository } from 'src/infrastructure/repositories/manager.repository';
import { GoogleAuthUseCase } from 'src/application/use-cases/auth/google-auth.use-case';
import { configureGoogleOAuth } from 'src/infrastructure/services/google-oauth.service';
import { AdminController } from '../../controllers/admin.controller';
import { createAdminRouter } from '../../routes/admin.routes';
import { Router } from 'express';

// Use cases
import { GetAdminProfileUseCase } from 'src/application/use-cases/admin/admin-getprofile.use-case';
import { ListAdminsUseCase }       from 'src/application/use-cases/admin/admin-list.use-case';
import { DeactivateAdminUseCase }  from 'src/application/use-cases/admin/admin-deactive.usecase';
import { WhitelistEmailUseCase }   from 'src/application/use-cases/admin/admin-whitelist.usecase';
import { RemoveWhitelistUseCase }  from 'src/application/use-cases/admin/admin-remove-whitelist.usecase';
import { BlockManagerUseCase }     from 'src/application/use-cases/admin/admin-block-manager.usecase';
import { UnblockManagerUseCase }   from 'src/application/use-cases/admin/admin-unblock-manager.usecase';

export function buildAdminModule(
  tokenService:  JwtTokenService,
  logger:        WinstonLogger,
  authMW:        any,
  managerRepo:   MongooseManagerRepository,   // needed for block/unblock
): { repo: MongooseAdminRepository; router: Router } {

  // 1. Repo
  const adminRepo = new MongooseAdminRepository();

  // 2. Google OAuth
  const googleAuthUseCase = new GoogleAuthUseCase(adminRepo, tokenService, logger);
  configureGoogleOAuth(googleAuthUseCase);

  // 3. Use cases — matching AdminController's 7-arg constructor exactly
  const getProfileUseCase      = new GetAdminProfileUseCase(adminRepo);
  const listAdminsUseCase      = new ListAdminsUseCase(adminRepo);
  const deactivateUseCase      = new DeactivateAdminUseCase(adminRepo, logger);
  const whitelistEmailUseCase  = new WhitelistEmailUseCase(adminRepo, logger);
  const removeWhitelistUseCase = new RemoveWhitelistUseCase(adminRepo, logger);
  const blockManagerUseCase    = new BlockManagerUseCase(managerRepo, logger);
  const unblockManagerUseCase  = new UnblockManagerUseCase(managerRepo, logger);

  // 4. Controller — 7 args in the same order as the constructor
  const controller = new AdminController(
    getProfileUseCase,
    listAdminsUseCase,
    deactivateUseCase,
    whitelistEmailUseCase,
    removeWhitelistUseCase,
    blockManagerUseCase,
    unblockManagerUseCase,
  );

  // 5. Router
  const router = createAdminRouter(controller, authMW);

  return { repo: adminRepo, router };
}