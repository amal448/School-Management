import { Request, Response, NextFunction } from 'express'
import { AnnouncementMapper } from 'src/application/mappers'
import { HttpStatus } from 'src/shared/enums/http-status.enum'
import { ListAnnouncementsUseCase } from 'src/application/use-cases/announcement/list-announcements.use-case'
import { ListPublicAnnouncementsUseCase } from 'src/application/use-cases/announcement/list-public-announcements.use-case'
import { CreateAnnouncementUseCase } from 'src/application/use-cases/announcement/create-announcement.use-case'
import { UpdateAnnouncementUseCase } from 'src/application/use-cases/announcement/update-announcement.use-case'
import { PublishAnnouncementUseCase } from 'src/application/use-cases/announcement/publish-announcement.use-case'
import { UnpublishAnnouncementUseCase } from 'src/application/use-cases/announcement/unpublish-announcement.use-case'
import { TogglePinAnnouncementUseCase } from 'src/application/use-cases/announcement/toggle-pin-announcement.use-case'
import { DeleteAnnouncementUseCase } from 'src/application/use-cases/announcement/delete-announcement.use-case'

export class AnnouncementController {
  constructor(
    private readonly listUseCase: ListAnnouncementsUseCase,
    private readonly listPublicUseCase: ListPublicAnnouncementsUseCase,
    private readonly createUseCase: CreateAnnouncementUseCase,
    private readonly updateUseCase: UpdateAnnouncementUseCase,
    private readonly publishUseCase: PublishAnnouncementUseCase,
    private readonly unpublishUseCase: UnpublishAnnouncementUseCase,
    private readonly togglePinUseCase: TogglePinAnnouncementUseCase,
    private readonly deleteUseCase: DeleteAnnouncementUseCase,
  ) { }

  // GET /api/announcements — admin/manager (all)
  list = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.listUseCase.execute(req.query as any)
      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          data: result.data.map(AnnouncementMapper.toDto),
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      })
    } catch (err) { next(err) }
  }

  // GET /api/announcements/public — no auth required
  listPublic = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const announcements = await this.listPublicUseCase.execute()
      res.status(HttpStatus.OK).json({
        success: true,
        data: announcements.map(AnnouncementMapper.toDto),
      })
    } catch (err) { next(err) }
  }

  // POST /api/announcements
  create = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const saved = await this.createUseCase.execute(req.body, req.user!.userId)
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: AnnouncementMapper.toDto(saved),
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/announcements/:id
  update = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.updateUseCase.execute(req.params.id, req.body)
      res.status(HttpStatus.OK).json({
        success: true,
        data: AnnouncementMapper.toDto(updated!),
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/announcements/:id/publish
  publish = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.publishUseCase.execute(req.params.id)
      res.status(HttpStatus.OK).json({
        success: true,
        data: AnnouncementMapper.toDto(updated!),
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/announcements/:id/unpublish
  unpublish = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.unpublishUseCase.execute(req.params.id)
      res.status(HttpStatus.OK).json({
        success: true,
        data: AnnouncementMapper.toDto(updated!),
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/announcements/:id/pin
  togglePin = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.togglePinUseCase.execute(req.params.id)
      res.status(HttpStatus.OK).json({
        success: true,
        data: AnnouncementMapper.toDto(updated!),
      })
    } catch (err) { next(err) }
  }

  // DELETE /api/announcements/:id
  remove = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      await this.deleteUseCase.execute(req.params.id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Announcement deleted',
      })
    } catch (err) { next(err) }
  }
}