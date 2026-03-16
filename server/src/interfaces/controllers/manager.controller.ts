import { Request, Response, NextFunction } from 'express'
import { RegisterManagerUseCase } from 'src/application/use-cases/manager/manager.register.use-case'
import { GetManagerUseCase } from 'src/application/use-cases/manager/manager.get.use-case'
import { UpdateManagerUseCase } from 'src/application/use-cases/manager/manager-update.use-case'
import { DeleteManagerUseCase } from 'src/application/use-cases/manager/manager.delete.use-case'

export class ManagerController {
    constructor(
        private readonly registerUseCase: RegisterManagerUseCase,
        private readonly getUseCase: GetManagerUseCase,
        private readonly updateUseCase: UpdateManagerUseCase,
        private readonly deleteUseCase: DeleteManagerUseCase,
    ) { }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.registerUseCase.execute(req.body);
            res.status(201).json({ success: true, message: 'Manager registered', data: result });
        } catch (err) { next(err); }
    }

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.getUseCase.execute(req.params.id);
            res.status(200).json({ success: true, data: result });
        } catch (err) { next(err); }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.updateUseCase.execute({
                id: req.params.id,
                dto: req.body,
                requesterId: req.user!.userId,
            });
            res.status(200).json({ success: true, data: result });
        } catch (err) { next(err); }
    };

     remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.status(200).json({ success: true, message: 'Manager deactivated' });
    } catch (err) { next(err); }
  };

}