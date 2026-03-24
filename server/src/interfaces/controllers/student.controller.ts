import { Request, Response, NextFunction } from "express";
import { RegisterStudentUseCase } from "src/application/use-cases/student/student.register.use-case";
import { GetStudentUseCase } from "src/application/use-cases/student/student.get.use-case";
import { ListStudentsUseCase } from "src/application/use-cases/student/student.list.use-case";
import { UpdateStudentUseCase } from "src/application/use-cases/student/student.update.use-case";
// import { AssignStudentClassUseCase } from "src/application/use-cases/student/student.assign.use-case";
import { DeleteStudentUseCase } from "src/application/use-cases/student/student.delete.use-case";
import { Role } from "src/domain/enums";

export class StudentController {
    constructor(
        private readonly registerUseCase: RegisterStudentUseCase,
        private readonly getUseCase: GetStudentUseCase,
        private readonly listUseCase: ListStudentsUseCase,
        private readonly updateUseCase: UpdateStudentUseCase,
        // private readonly assignClassUseCase: AssignStudentClassUseCase,
        private readonly deleteUseCase: DeleteStudentUseCase,
    ) {}


 // (Manager only)
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json({ success: true, message: 'Student registered', data: result });
    } catch (err) { next(err); }
  };

  //   (Manager, Teacher)
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listUseCase.execute(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  //  (Manager, Teacher, or self)
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getUseCase.execute({
        targetId: req.params.id,
        requesterId: req.user!.userId,
        requesterRole: req.user!.role as Role,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  // PATCH   (Manager or self)
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

  // DELETE  (Manager only)
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.status(200).json({ success: true, message: 'Student deactivated' });
    } catch (err) { next(err); }
  };











}