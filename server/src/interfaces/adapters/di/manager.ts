import { ManagerController } from 'src/interfaces/controllers/manager.controller';
import { BcryptPasswordHasher, JwtTokenService, WinstonLogger } from '../../../infrastructure/services';
import { createManagerRouter } from 'src/interfaces/routes/manager.routes';
import { UpdateManagerUseCase } from '../../../application/use-cases/manager/manager-update.use-case';
import { DeleteManagerUseCase } from '../../../application/use-cases/manager/manager.delete.use-case';
import { GetManagerUseCase } from '../../../application/use-cases/manager/manager.get.use-case';
import { RegisterManagerUseCase } from '../../../application/use-cases/manager/manager.register.use-case'
import { MongooseManagerRepository } from 'src/infrastructure/repositories/manager.repository';


export function buildManagerModule(
    tokenService: JwtTokenService,
    passwordHasher: BcryptPasswordHasher,
    logger: WinstonLogger,
    authMW: any
) {
    // 1. Repository specific to Managers
    const repo = new MongooseManagerRepository();

    // 2. Controller with Manager Use Cases
    const controller = new ManagerController(
        new RegisterManagerUseCase(repo, passwordHasher, tokenService, logger),
        new GetManagerUseCase(repo),
        new UpdateManagerUseCase(repo, logger),
        new DeleteManagerUseCase(repo, logger)
    );

    // 3. Router with injected Auth Middleware
    const router = createManagerRouter(controller, authMW);

    // Return the repo because the Auth module will likely need it to verify Manager logins
    return { repo, router };
}