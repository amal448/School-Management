import { Request, Response, NextFunction } from 'express'
import { CreateDepartmentUseCase } from 'src/application/use-cases/department/createdepartment.use-case'
import { DeleteDepartmentUseCase } from 'src/application/use-cases/department/deletedepartment.use-case'
import { GetDepartmentUseCase } from 'src/application/use-cases/department/getdepartmentId.use-case'
import { ListDepartmentsUseCase } from 'src/application/use-cases/department/listdepartment.usecase'
import { UpdateDepartmentUseCase } from 'src/application/use-cases/department/updatedepartment.use-case'

export class DepartmentController {
  constructor(
    private readonly createUseCase: CreateDepartmentUseCase,
    private readonly getUseCase:    GetDepartmentUseCase,
    private readonly listUseCase:   ListDepartmentsUseCase,
    private readonly updateUseCase: UpdateDepartmentUseCase,
    private readonly deleteUseCase: DeleteDepartmentUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.createUseCase.execute(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.listUseCase.execute(req.query as any)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getUseCase.execute(req.params.id)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateUseCase.execute({
        id:  req.params.id,
        dto: req.body,
      })
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.deleteUseCase.execute(req.params.id)
      res.status(200).json({ success: true, message: 'Department deleted' })
    } catch (err) { next(err) }
  }
}