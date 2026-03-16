// src/interfaces/controllers/teacher.controller.ts
import { Request, Response, NextFunction } from 'express';

import { Role } from '../../domain/enums/index';
import { RegisterTeacherUseCase } from 'src/application/use-cases/teacher/teacher-register.use-case';
import { GetTeacherUseCase } from 'src/application/use-cases/teacher/teacher-get.use-case';
import { ListTeachersUseCase } from 'src/application/use-cases/teacher/teacher-list.use-case';
import { UpdateTeacherUseCase } from 'src/application/use-cases/teacher/teacher-update.use-case';
import { AssignTeacherDeptUseCase } from 'src/application/use-cases/teacher/teacher-assign.use-case';
import { DeleteTeacherUseCase } from 'src/application/use-cases/teacher/teacher-delete.use-case';

export class TeacherController {
  constructor(
    private readonly registerUseCase: RegisterTeacherUseCase,
    private readonly getUseCase: GetTeacherUseCase,
    private readonly listUseCase: ListTeachersUseCase,
    private readonly updateUseCase: UpdateTeacherUseCase,
    private readonly assignDeptUseCase: AssignTeacherDeptUseCase,
    private readonly deleteUseCase: DeleteTeacherUseCase,
  ) {}

  // POST /api/teachers  (Manager only)
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json({ success: true, message: 'Teacher registered', data: result });
    } catch (err) { next(err); }
  };

  // GET /api/teachers  (Manager only)
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listUseCase.execute(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  // GET /api/teachers/:id  (Manager or self)
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getUseCase.execute(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  // PATCH /api/teachers/:id  (Manager or self)
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateUseCase.execute({
        id: req.params.id,
        dto: req.body,
        requesterId: req.user!.userId,
        requesterRole: req.user!.role as Role,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  // PATCH /api/teachers/:id/department  (Manager only)
  assignDept = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.assignDeptUseCase.execute({
        teacherId: req.params.id,
        deptId: req.body.deptId,
      });
      res.status(200).json({ success: true, message: 'Department assigned', data: result });
    } catch (err) { next(err); }
  };

  // DELETE /api/teachers/:id  (Manager only)
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.status(200).json({ success: true, message: 'Teacher deactivated' });
    } catch (err) { next(err); }
  };
}
