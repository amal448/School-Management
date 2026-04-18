import { Request, Response, NextFunction } from 'express'
import { HttpStatus } from 'src/shared/enums/http-status.enum'

import { ListToppersUseCase } from 'src/application/use-cases/topper/topper.list.use-case'
import { ListPublicToppersUseCase } from 'src/application/use-cases/topper/topper.list-public.use-case'
import { CreateTopperUseCase } from 'src/application/use-cases/topper/topper.create.use-case'
import { UpdateTopperUseCase } from 'src/application/use-cases/topper/topper.update.use-case'
import { PublishTopperUseCase } from 'src/application/use-cases/topper/topper.publish.use-case'
import { UnpublishTopperUseCase } from 'src/application/use-cases/topper/topper.unpublish.use-case'
import { DeleteTopperUseCase } from 'src/application/use-cases/topper/topper.delete.use-case'

export class TopperController {
  constructor(
    private readonly listToppersUseCase: ListToppersUseCase,
    private readonly listPublicToppersUseCase: ListPublicToppersUseCase,
    private readonly createTopperUseCase: CreateTopperUseCase,
    private readonly updateTopperUseCase: UpdateTopperUseCase,
    private readonly publishTopperUseCase: PublishTopperUseCase,
    private readonly unpublishTopperUseCase: UnpublishTopperUseCase,
    private readonly deleteTopperUseCase: DeleteTopperUseCase
  ) { }

  // GET /api/toppers — admin/manager (all)
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listToppersUseCase.execute(req.query as any)
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      })
    } catch (err) { next(err) }
  }

  // GET /api/toppers/public
  listPublic = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.listPublicToppersUseCase.execute()
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      })
    } catch (err) { next(err) }
  }

  // POST /api/toppers
  create = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      console.log(" create req.body", req.body);
      const result = await this.createTopperUseCase.execute({
        ...req.body,
        userId: req.user!.userId,
      })

      res.status(HttpStatus.CREATED).json({
        success: true,
        data: result,
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/toppers/:id
  update = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.updateTopperUseCase.execute({
        id: req.params.id,
        dto: req.body,
      })

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      })
    } catch (err) { next(err) }
  }

  // PATCH /api/toppers/:id/publish
  publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.publishTopperUseCase.execute(req.params.id)
      res.status(HttpStatus.OK).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // PATCH /api/toppers/:id/unpublish
  unpublish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.unpublishTopperUseCase.execute(req.params.id)
      res.status(HttpStatus.OK).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // DELETE /api/toppers/:id
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteTopperUseCase.execute(req.params.id)
      res.status(HttpStatus.OK).json({ success: true, message: 'Topper deleted' })
    } catch (err) { next(err) }
  }
}