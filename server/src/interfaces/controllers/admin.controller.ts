import { Request, Response, NextFunction } from 'express';
import { DeactivateAdminUseCase } from 'src/application/use-cases/admin/admin-deactive.usecase';
import { GetAdminUseCase } from 'src/application/use-cases/admin/admin-get.use-case';
import { GetAdminProfileUseCase } from 'src/application/use-cases/admin/admin-getprofile.use-case';
import { ListAdminsUseCase } from 'src/application/use-cases/admin/admin-list.use-case';
import { WhitelistAdminEmailUseCase } from 'src/application/use-cases/admin/admin-whitelist.usecase';

export class AdminController {
  constructor(
    private readonly getAdminUseCase: GetAdminUseCase,
    private readonly listAdminsUseCase: ListAdminsUseCase,
    private readonly getProfileUseCase: GetAdminProfileUseCase,
    private readonly deactivateUseCase: DeactivateAdminUseCase,
    private readonly whitelistEmailUseCase: WhitelistAdminEmailUseCase,
  ) {}

  // GET /api/admins/me — own profile from JWT
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getProfileUseCase.execute(req.user!.userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  // GET /api/admins — list all admins
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listAdminsUseCase.execute();
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  // GET /api/admins/:id — get specific admin
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getAdminUseCase.execute(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  // DELETE /api/admins/:id — deactivate another admin
  deactivate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deactivateUseCase.execute({
        targetId:    req.params.id,
        requesterId: req.user!.userId,
      });
      res.status(200).json({ success: true, message: 'Admin deactivated' });
    } catch (err) { next(err); }
  };

  // POST /api/admins/whitelist — whitelist a new Gmail for admin access
  whitelistEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.whitelistEmailUseCase.execute({
        email:       req.body.email,
        requesterId: req.user!.userId,
      });
      res.status(201).json({ success: true, message: 'Email whitelisted successfully' });
    } catch (err) { next(err); }
  };
}