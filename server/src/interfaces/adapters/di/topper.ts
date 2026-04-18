import { Router }                    from 'express'
import { MongooseTopperRepository }  from 'src/infrastructure/repositories/topper.repository'
import { TopperController }          from 'src/interfaces/controllers/topper.controller'
import { createTopperRouter }        from 'src/interfaces/routes/topper.routes'

import { ListToppersUseCase }        from 'src/application/use-cases/topper/topper.list.use-case'
import { ListPublicToppersUseCase }  from 'src/application/use-cases/topper/topper.list-public.use-case'
import { CreateTopperUseCase }       from 'src/application/use-cases/topper/topper.create.use-case'
import { UpdateTopperUseCase }       from 'src/application/use-cases/topper/topper.update.use-case'
import { PublishTopperUseCase }      from 'src/application/use-cases/topper/topper.publish.use-case'
import { UnpublishTopperUseCase }    from 'src/application/use-cases/topper/topper.unpublish.use-case'
import { DeleteTopperUseCase }       from 'src/application/use-cases/topper/topper.delete.use-case'

export function buildTopperModule(authMW: any): { router: Router } {
  const repo = new MongooseTopperRepository()

  const listToppersUseCase       = new ListToppersUseCase(repo)
  const listPublicToppersUseCase = new ListPublicToppersUseCase(repo)
  const createTopperUseCase      = new CreateTopperUseCase(repo)
  const updateTopperUseCase      = new UpdateTopperUseCase(repo)
  const publishTopperUseCase     = new PublishTopperUseCase(repo)
  const unpublishTopperUseCase   = new UnpublishTopperUseCase(repo)
  const deleteTopperUseCase      = new DeleteTopperUseCase(repo)

  const controller = new TopperController(
    listToppersUseCase,
    listPublicToppersUseCase,
    createTopperUseCase,
    updateTopperUseCase,
    publishTopperUseCase,
    unpublishTopperUseCase,
    deleteTopperUseCase
  )

  return { router: createTopperRouter(controller, authMW) }
}