import { Router }                        from 'express'
import { MongooseAnnouncementRepository } from 'src/infrastructure/repositories/announcement.repository'
import { WinstonLogger }                 from 'src/infrastructure/services'
import { AnnouncementController } from 'src/interfaces/controllers/announcement.controller'
import { createAnnouncementRouter } from 'src/interfaces/routes/announcement.routes'

export function buildAnnouncementModule(
  logger:  WinstonLogger,
  authMW:  any,
): { router: Router } {
  const repo       = new MongooseAnnouncementRepository()
  const controller = new AnnouncementController(repo)

  return {
    router: createAnnouncementRouter(controller, authMW),
  }
}