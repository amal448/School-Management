import { WinstonLogger, BcryptPasswordHasher, JwtTokenService } from 'src/infrastructure/services/index'
import { MongooseManagerRepository } from 'src/infrastructure/repositories/manager.repository'

import { ManagerController }  from 'src/interfaces/controllers/manager.controller'
import { createManagerRouter } from 'src/interfaces/routes/manager.routes'
import { Router }             from 'express'
import { CreateManagerUseCase } from 'src/application/use-cases/manager/manager.register.use-case'
import { GetManagerUseCase } from 'src/application/use-cases/manager/manager.get.use-case'
import { ListManagersUseCase } from 'src/application/use-cases/manager/manager-list-use-case'
import { UpdateManagerUseCase } from 'src/application/use-cases/manager/manager-update.use-case'
import { DeleteManagerUseCase } from 'src/application/use-cases/manager/manager.delete.use-case'

export function buildManagerModule(
  passwordHasher: BcryptPasswordHasher,
  logger:         WinstonLogger,
  authMW:         any,
): { repo: MongooseManagerRepository; router: Router } {

  // ── Repo ──────────────────────────────────────────
  const managerRepo = new MongooseManagerRepository()

  // ── Use cases ─────────────────────────────────────
  const createUseCase = new CreateManagerUseCase(managerRepo, passwordHasher, logger)
  const getUseCase    = new GetManagerUseCase(managerRepo)
  const listUseCase   = new ListManagersUseCase(managerRepo)
  const updateUseCase = new UpdateManagerUseCase(managerRepo, logger)
  const deleteUseCase = new DeleteManagerUseCase(managerRepo, logger)

  // ── Controller ────────────────────────────────────
  const controller = new ManagerController(
    createUseCase,
    getUseCase,
    listUseCase,
    updateUseCase,
    deleteUseCase,
  )

  // ── Router ────────────────────────────────────────
  const router = createManagerRouter(controller, authMW)

  return { repo: managerRepo, router }
}

