import { Router }                        from 'express'
import { MongooseAnnouncementRepository } from 'src/infrastructure/repositories/announcement.repository'
import { WinstonLogger }                 from 'src/infrastructure/services'
import { AnnouncementController } from 'src/interfaces/controllers/announcement.controller'
import { createAnnouncementRouter } from 'src/interfaces/routes/announcement.routes'

import { ListAnnouncementsUseCase } from 'src/application/use-cases/announcement/list-announcements.use-case'
import { ListPublicAnnouncementsUseCase } from 'src/application/use-cases/announcement/list-public-announcements.use-case'
import { CreateAnnouncementUseCase } from 'src/application/use-cases/announcement/create-announcement.use-case'
import { UpdateAnnouncementUseCase } from 'src/application/use-cases/announcement/update-announcement.use-case'
import { PublishAnnouncementUseCase } from 'src/application/use-cases/announcement/publish-announcement.use-case'
import { UnpublishAnnouncementUseCase } from 'src/application/use-cases/announcement/unpublish-announcement.use-case'
import { TogglePinAnnouncementUseCase } from 'src/application/use-cases/announcement/toggle-pin-announcement.use-case'
import { DeleteAnnouncementUseCase } from 'src/application/use-cases/announcement/delete-announcement.use-case'

export function buildAnnouncementModule(
  logger:  WinstonLogger,
  authMW:  any,
): { router: Router } {
  const repo       = new MongooseAnnouncementRepository()
  
  const listUseCase = new ListAnnouncementsUseCase(repo)
  const listPublicUseCase = new ListPublicAnnouncementsUseCase(repo)
  const createUseCase = new CreateAnnouncementUseCase(repo)
  const updateUseCase = new UpdateAnnouncementUseCase(repo)
  const publishUseCase = new PublishAnnouncementUseCase(repo)
  const unpublishUseCase = new UnpublishAnnouncementUseCase(repo)
  const togglePinUseCase = new TogglePinAnnouncementUseCase(repo)
  const deleteUseCase = new DeleteAnnouncementUseCase(repo)

  const controller = new AnnouncementController(
    listUseCase,
    listPublicUseCase,
    createUseCase,
    updateUseCase,
    publishUseCase,
    unpublishUseCase,
    togglePinUseCase,
    deleteUseCase,
  )

  return {
    router: createAnnouncementRouter(controller, authMW),
  }
}