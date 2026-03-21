import { Request, Response, NextFunction } from 'express'
import { AllocateSubjectUseCase } from 'src/application/use-cases/class/allocate-subject.usecase'
import { CreateClassUseCase } from 'src/application/use-cases/class/create-class.usecase'
import { DeleteClassUseCase } from 'src/application/use-cases/class/delete-class.usecase'
import { GetClassUseCase } from 'src/application/use-cases/class/get-class.usecase'
import { ListClassesUseCase } from 'src/application/use-cases/class/list-classes.usecase'
import { RemoveSubjectAllocationUseCase } from 'src/application/use-cases/class/remove-subject.usecase'
import { UpdateClassUseCase } from 'src/application/use-cases/class/update-class.usecase'

export class ClassController {
  constructor(
    private readonly createUseCase:          CreateClassUseCase,
    private readonly getUseCase:             GetClassUseCase,
    private readonly listUseCase:            ListClassesUseCase,
    private readonly updateUseCase:          UpdateClassUseCase,
    private readonly allocateSubjectUseCase: AllocateSubjectUseCase,
    private readonly removeSubjectUseCase:   RemoveSubjectAllocationUseCase,
    private readonly deleteUseCase:          DeleteClassUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createUseCase.execute(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listUseCase.execute(req.query as any)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getUseCase.execute(req.params.id)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateUseCase.execute({
        id:  req.params.id,
        dto: req.body,
      })
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  allocateSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.allocateSubjectUseCase.execute({
        classId: req.params.id,
        dto:     req.body,
      })
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  removeSubjectAllocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.removeSubjectUseCase.execute({
        classId:   req.params.id,
        subjectId: req.params.subjectId,
      })
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteUseCase.execute(req.params.id)
      res.status(200).json({ success: true, message: 'Class deleted' })
    } catch (err) { next(err) }
  }
}