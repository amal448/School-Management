import { Request, Response, NextFunction } from 'express'
import { CreateExamUseCase }          from 'src/application/use-cases/exam/create-exam.use-case'
import { AddTimetableEntryUseCase }   from 'src/application/use-cases/exam/add-timetable-entry.use-case'
import { PublishExamUseCase }         from 'src/application/use-cases/exam/publish-exam.use-case'
import { EnterMarksUseCase }          from 'src/application/use-cases/exam/enter-marks.use-case'
import { DeclareExamUseCase }         from 'src/application/use-cases/exam/declare-exam.use-case'
import { IExamRepository }            from 'src/application/ports/repositories/exam.repository.interface'
import { IExamTimetableRepository }   from 'src/application/ports/repositories/exam-timetable.repository.interface'
import { IExamScheduleRepository }    from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { IMarksRepository }           from 'src/application/ports/repositories/marks.repository.interface'
import { MarksStatus }                from 'src/domain/enums'
import { ExamMapper } from 'src/application/mappers'

export class ExamController {
  constructor(
    private readonly createUseCase:          CreateExamUseCase,
    private readonly addTimetableUseCase:    AddTimetableEntryUseCase,
    private readonly publishUseCase:         PublishExamUseCase,
    private readonly enterMarksUseCase:      EnterMarksUseCase,
    private readonly declareUseCase:         DeclareExamUseCase,
    private readonly examRepo:               IExamRepository,
    private readonly timetableRepo:          IExamTimetableRepository,
    private readonly scheduleRepo:           IExamScheduleRepository,
    private readonly marksRepo:              IMarksRepository,
  ) {}

  // ── Exam CRUD ─────────────────────────────────────────
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createUseCase.execute({
        dto:       req.body,
        createdBy: req.user!.userId,
      })
      res.status(201).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.examRepo.findAll(req.query as any)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exam = await this.examRepo.findById(req.params.id)
      if (!exam) {
        res.status(404).json({ success: false, message: 'Exam not found' })
        return
      }
      res.status(200).json({ success: true, data: ExamMapper.toDto(exam) })
    } catch (err) { next(err) }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exam = await this.examRepo.findById(req.params.id)
      if (!exam) {
        res.status(404).json({ success: false, message: 'Exam not found' })
        return
      }
      exam.updateDetails(req.body)
      const updated = await this.examRepo.update(req.params.id, exam)
      res.status(200).json({ success: true, data: ExamMapper.toDto(updated!) })
    } catch (err) { next(err) }
  }

  // ── Timetable ─────────────────────────────────────────
  addTimetableEntry = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.addTimetableUseCase.execute({
        examId: req.params.id,
        dto:    req.body,
      })
      res.status(201).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  getTimetable = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const entries = await this.timetableRepo.findByExamId(req.params.id)
      res.status(200).json({
        success: true,
        data:    entries.map(ExamMapper.timetableToDto),
      })
    } catch (err) { next(err) }
  }

  deleteTimetableEntry = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      await this.timetableRepo.delete(req.params.entryId)
      res.status(200).json({ success: true, message: 'Entry removed' })
    } catch (err) { next(err) }
  }

  // ── Lifecycle ─────────────────────────────────────────
  publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.publishUseCase.execute(req.params.id)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  declare = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.declareUseCase.execute(req.params.id)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  // ── Schedules ─────────────────────────────────────────
  getSchedules = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const schedules = await this.scheduleRepo.findByExamId(req.params.id)
      res.status(200).json({
        success: true,
        data:    schedules.map(ExamMapper.scheduleToDto),
      })
    } catch (err) { next(err) }
  }

  // ── Marks ─────────────────────────────────────────────
  enterMarks = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      await this.enterMarksUseCase.execute({
        dto:       req.body,
        teacherId: req.user!.userId,
      })
      res.status(200).json({
        success: true,
        message: 'Marks submitted successfully',
      })
    } catch (err) { next(err) }
  }

  getMarksBySchedule = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const marks = await this.marksRepo.findByScheduleId(
        req.params.scheduleId
      )
      res.status(200).json({
        success: true,
        data:    marks.map(ExamMapper.marksToDto),
      })
    } catch (err) { next(err) }
  }

  // ── Teacher's pending marks ───────────────────────────
  myPendingMarks = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const schedules = await this.scheduleRepo.findByTeacherIdAndStatus(
        req.user!.userId,
        MarksStatus.PENDING,
      )
      res.status(200).json({
        success: true,
        data:    schedules.map(ExamMapper.scheduleToDto),
      })
    } catch (err) { next(err) }
  }

  // ── Class results (declared only) ─────────────────────
  getClassResults = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const exam = await this.examRepo.findById(req.params.id)
      if (!exam) {
        res.status(404).json({ success: false, message: 'Exam not found' })
        return
      }
      if (exam.status !== 'declared') {
        res.status(403).json({
          success: false,
          message: 'Results not yet declared',
        })
        return
      }
      const marks = await this.marksRepo.findByClassAndExam(
        req.params.classId,
        req.params.id,
      )
      res.status(200).json({
        success: true,
        data:    marks.map(ExamMapper.marksToDto),
      })
    } catch (err) { next(err) }
  }
}