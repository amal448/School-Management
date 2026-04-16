import { Request, Response, NextFunction } from 'express'
import { AnnouncementMapper }  from 'src/application/mappers'
import { AppError }            from 'src/shared/types/app-error'
import { HttpStatus }          from 'src/shared/enums/http-status.enum'
import { IAnnouncementRepository } from 'src/application/ports/repositories/announcement.repository.interface'
import { AnnouncementEntity } from 'src/domain/entities/announcement.entity'

export class AnnouncementController {
  constructor(
    private readonly repo: IAnnouncementRepository,
  ) {}

  // GET /api/announcements — admin/manager (all)
  list = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.repo.findAll(req.query as any)
      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          data:       result.data.map(AnnouncementMapper.toDto),
          total:      result.total,
          page:       result.page,
          limit:      result.limit,
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
      const announcements = await this.repo.findPublished()
      res.status(HttpStatus.OK).json({
        success: true,
        data:    announcements.map(AnnouncementMapper.toDto),
      })
    } catch (err) { next(err) }
  }

  // POST /api/announcements
  create = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const entity = AnnouncementEntity.create({
        title:       req.body.title,
        content:     req.body.content,
        category:    req.body.category,
        eventDate:   req.body.eventDate
          ? new Date(req.body.eventDate)
          : undefined,
        isPublished: req.body.isPublished ?? false,
        isPinned:    req.body.isPinned    ?? false,
        createdBy:   req.user!.userId,
      })

      const saved = await this.repo.save(entity)
      res.status(HttpStatus.CREATED).json({
        success: true,
        data:    AnnouncementMapper.toDto(saved),
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/announcements/:id
  update = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const entity = await this.repo.findById(req.params.id)
      if (!entity) throw AppError.notFound('Announcement not found')

      entity.update({
        title:     req.body.title,
        content:   req.body.content,
        category:  req.body.category,
        eventDate: req.body.eventDate
          ? new Date(req.body.eventDate)
          : undefined,
      })

      const updated = await this.repo.update(req.params.id, entity)
      res.status(HttpStatus.OK).json({
        success: true,
        data:    AnnouncementMapper.toDto(updated!),
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/announcements/:id/publish
  publish = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const entity = await this.repo.findById(req.params.id)
      if (!entity) throw AppError.notFound('Announcement not found')

      entity.publish()
      const updated = await this.repo.update(req.params.id, entity)
      res.status(HttpStatus.OK).json({
        success: true,
        data:    AnnouncementMapper.toDto(updated!),
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/announcements/:id/unpublish
  unpublish = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const entity = await this.repo.findById(req.params.id)
      if (!entity) throw AppError.notFound('Announcement not found')

      entity.unpublish()
      const updated = await this.repo.update(req.params.id, entity)
      res.status(HttpStatus.OK).json({
        success: true,
        data:    AnnouncementMapper.toDto(updated!),
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/announcements/:id/pin
  togglePin = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const entity = await this.repo.findById(req.params.id)
      if (!entity) throw AppError.notFound('Announcement not found')

      entity.togglePin()
      const updated = await this.repo.update(req.params.id, entity)
      res.status(HttpStatus.OK).json({
        success: true,
        data:    AnnouncementMapper.toDto(updated!),
      })
    } catch (err) { next(err) }
  }

  // DELETE /api/announcements/:id
  remove = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const exists = await this.repo.existsById(req.params.id)
      if (!exists) throw AppError.notFound('Announcement not found')

      await this.repo.delete(req.params.id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Announcement deleted',
      })
    } catch (err) { next(err) }
  }
}