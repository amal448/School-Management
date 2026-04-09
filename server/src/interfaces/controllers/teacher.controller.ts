// src/interfaces/controllers/teacher.controller.ts
import { Request, Response, NextFunction } from 'express'
import { Role } from 'src/domain/enums'
import { RegisterTeacherUseCase } from 'src/application/use-cases/teacher/teacher-register.use-case'
import { GetTeacherUseCase } from 'src/application/use-cases/teacher/teacher-get.use-case'
import { ListTeachersUseCase } from 'src/application/use-cases/teacher/teacher-list.use-case'
import { UpdateTeacherUseCase } from 'src/application/use-cases/teacher/teacher-update.use-case'
import { AssignTeacherDeptUseCase } from 'src/application/use-cases/teacher/teacher-assign.use-case'
import { DeleteTeacherUseCase } from 'src/application/use-cases/teacher/teacher-delete.use-case'
import { GetTeachersBySubjectUseCase } from 'src/application/use-cases/teacher/teacher-get-by-subject.use-case'
import { ListTeacherClassesUseCase } from 'src/application/use-cases/teacher/list-teacher-classes.use-case'

export class TeacherController {
  constructor(
    private readonly registerUseCase: RegisterTeacherUseCase,
    private readonly getUseCase: GetTeacherUseCase,      // ← was getByIdUseCase
    private readonly listUseCase: ListTeachersUseCase,
    private readonly updateUseCase: UpdateTeacherUseCase,
    private readonly assignDeptUseCase: AssignTeacherDeptUseCase,
    private readonly deleteUseCase: DeleteTeacherUseCase,
    private readonly getBySubjectUseCase: GetTeachersBySubjectUseCase,
    private readonly listTeacherClassesUseCase: ListTeacherClassesUseCase,
  ) { }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("registerdewd", req.body);

      const result = await this.registerUseCase.execute({
        dto: req.body,
        createdBy: req.user!.userId,
      })
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
        id: req.params.id,
        dto: req.body,
        requesterId: req.user!.userId,
        requesterRole: req.user!.role as Role,
      })
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  assignDept = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.assignDeptUseCase.execute({
        teacherId: req.params.id,
        deptId: req.body.deptId,
      })
      res.status(200).json({ success: true, message: 'Department assigned', data: result })
    } catch (err) { next(err) }
  }

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteUseCase.execute(req.params.id)
      res.status(200).json({ success: true, message: 'Teacher deactivated' })
    } catch (err) { next(err) }
  }

  // ── GET /api/teachers/me ───────────────────────────────
  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getUseCase.execute(req.user!.userId)  // ← fix: getUseCase
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // ── GET /api/teachers/me/classes ───────────────────────
  myClasses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const teacherId = req.user!.userId
      const result = await this.listTeacherClassesUseCase.execute(teacherId);

      res.status(200).json({
        success: true,
        data: result
      })
    } catch (err) { next(err) }
  }

  getBySubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // The controller only triggers the Use Case
      const result = await this.getBySubjectUseCase.execute(req.params.subjectId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err); // Centralized error handler will catch "Subject not found"
    }
  }

  getByLevel = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const { level } = req.params
      const teachers = await this.teacherRepo.findByLevel(level)
      res.status(200).json({
        success: true,
        data: teachers.map(TeacherMapper.toDto),
      })
    } catch (err) { next(err) }
  }


}