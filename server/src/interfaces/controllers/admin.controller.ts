// src/interfaces/controllers/admin.controller.ts
import { Request, Response, NextFunction } from 'express'
import { BlockManagerUseCase } from 'src/application/use-cases/admin/admin-block-manager.usecase'
import { DeactivateAdminUseCase } from 'src/application/use-cases/admin/admin-deactive.usecase'
import { GetAdminProfileUseCase } from 'src/application/use-cases/admin/admin-get.use-case'
import { ListAdminsUseCase } from 'src/application/use-cases/admin/admin-list.use-case'
import { RemoveWhitelistUseCase } from 'src/application/use-cases/admin/admin-remove-whitelist.usecase'
import { UnblockManagerUseCase } from 'src/application/use-cases/admin/admin-unblock-manager.usecase'
import { WhitelistEmailUseCase } from 'src/application/use-cases/admin/admin-whitelist.usecase'


export class AdminController {
  constructor(
    private readonly getProfileUseCase: GetAdminProfileUseCase,
    private readonly listAdminsUseCase: ListAdminsUseCase,
    private readonly deactivateUseCase: DeactivateAdminUseCase,
    private readonly whitelistEmailUseCase: WhitelistEmailUseCase,
    private readonly removeWhitelistUseCase: RemoveWhitelistUseCase,
    private readonly blockManagerUseCase: BlockManagerUseCase,
    private readonly unblockManagerUseCase: UnblockManagerUseCase,
  ) { }

  // GET /api/admins/me
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getProfileUseCase.execute(req.user!.userId)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // GET /api/admins
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listAdminsUseCase.execute()
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // DELETE /api/admins/:id
  deactivate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deactivateUseCase.execute({
        targetId: req.params.id,
        requesterId: req.user!.userId,
      })
      res.status(200).json({ success: true, message: 'Admin deactivated' })
    } catch (err) { next(err) }
  }

  // POST /api/admins/whitelist
  whitelistEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.whitelistEmailUseCase.execute({
        email: req.body.email,
        role: req.body.role,
        requesterId: req.user!.userId,
      })
      res.status(201).json({ success: true, message: 'Email whitelisted successfully' })
    } catch (err) { next(err) }
  }

  // DELETE /api/admins/whitelist/:email
  removeWhitelist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.removeWhitelistUseCase.execute(
        decodeURIComponent(req.params.email)
      )
      res.status(200).json({ success: true, message: 'Removed from whitelist' })
    } catch (err) { next(err) }
  }

  // PATCH /api/admins/managers/:id/block
  blockManager = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.blockManagerUseCase.execute({
        managerId: req.params.id,
        requesterId: req.user!.userId,
      })
      res.status(200).json({ success: true, message: 'Manager blocked' })
    } catch (err) { next(err) }
  }

  // PATCH /api/admins/managers/:id/unblock
  unblockManager = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.unblockManagerUseCase.execute(req.params.id)
      res.status(200).json({ success: true, message: 'Manager unblocked' })
    } catch (err) { next(err) }
  }
}