import { Request, Response, NextFunction } from 'express'
import { CreateSubjectUseCase } from 'src/application/use-cases/subject/create-subject.use-cases'
import { DeleteSubjectUseCase } from 'src/application/use-cases/subject/delete-subject.usecase'
import { GetSubjectUseCase } from 'src/application/use-cases/subject/get-subject.usecase'
import { ListSubjectsUseCase } from 'src/application/use-cases/subject/list-subjects.usecase'
import { UpdateSubjectUseCase } from 'src/application/use-cases/subject/update-subject.usecase'

export class SubjectController {
  constructor(
    private readonly createUseCase: CreateSubjectUseCase,
    private readonly getUseCase:    GetSubjectUseCase,
    private readonly listUseCase:   ListSubjectsUseCase,
    private readonly updateUseCase: UpdateSubjectUseCase,
    private readonly deleteUseCase: DeleteSubjectUseCase,
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

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteUseCase.execute(req.params.id)
      res.status(200).json({ success: true, message: 'Subject deleted' })
    } catch (err) { next(err) }
  }
}