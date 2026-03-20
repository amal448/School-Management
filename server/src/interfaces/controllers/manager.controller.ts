import { Request, Response, NextFunction } from 'express'
import { ListManagersUseCase } from 'src/application/use-cases/manager/manager-list-use-case'
import { UpdateManagerUseCase } from 'src/application/use-cases/manager/manager-update.use-case'
import { DeleteManagerUseCase } from 'src/application/use-cases/manager/manager.delete.use-case'
import { GetManagerUseCase } from 'src/application/use-cases/manager/manager.get.use-case'
import { CreateManagerUseCase } from 'src/application/use-cases/manager/manager.register.use-case'

export class ManagerController {
  constructor(
    private readonly createUseCase: CreateManagerUseCase,
    private readonly getUseCase:    GetManagerUseCase,
    private readonly listUseCase:   ListManagersUseCase,
    private readonly updateUseCase: UpdateManagerUseCase,
    private readonly deleteUseCase: DeleteManagerUseCase,
  ) {}

  // POST /api/managers  — Admin only
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.createUseCase.execute({
        dto:            req.body,
        createdByAdmin: req.user!.userId,
      })
      res.status(201).json({
        success: true,
        message: 'Manager created successfully',
        data:    { user: result },
      })
    } catch (err) { next(err) }
  }

  // GET /api/managers  — Admin only
  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.listUseCase.execute(req.query as any)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // GET /api/managers/:id  — Admin or self
  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.getUseCase.execute({
        targetId:      req.params.id,
        requesterId:   req.user!.userId,
        requesterRole: req.user!.role,
      })
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // PATCH /api/managers/:id  — Admin or self
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.updateUseCase.execute({
        id:            req.params.id,
        dto:           req.body,
        requesterId:   req.user!.userId,
        requesterRole: req.user!.role,
      })
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // DELETE /api/managers/:id  — Admin only (soft delete)
  remove = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.deleteUseCase.execute({
        targetId:    req.params.id,
        requesterId: req.user!.userId,
      })
      res.status(200).json({
        success: true,
        message: 'Manager deactivated successfully',
      })
    } catch (err) { next(err) }
  }
}