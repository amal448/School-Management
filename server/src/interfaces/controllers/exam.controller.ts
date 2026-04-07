import { Request, Response, NextFunction } from 'express'
import { CreateExamUseCase } from 'src/application/use-cases/exam/create-exam.use-case'

import { PublishExamUseCase } from 'src/application/use-cases/exam/publish-exam.use-case'
import { EnterMarksUseCase } from 'src/application/use-cases/exam/enter-marks.use-case'
import { DeclareExamUseCase } from 'src/application/use-cases/exam/declare-exam.use-case'
import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { IExamScheduleRepository } from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { IMarksRepository } from 'src/application/ports/repositories/marks.repository.interface'
import { MarksStatus } from 'src/domain/enums'
import { ExamMapper } from 'src/application/mappers'
import { AddCommonSubjectUseCase } from 'src/application/use-cases/exam/add-commonsubject.use-case'
import { UpdateCommonSubjectUseCase } from 'src/application/use-cases/exam/update-commonsubject.use-case'
import { RemoveCommonSubjectUseCase } from 'src/application/use-cases/exam/remove-commonsubject.usecase'
import { AddSectionLanguageUseCase } from 'src/application/use-cases/exam/add-sectionlanguage.use-case'
import { RemoveSectionLanguageUseCase } from 'src/application/use-cases/exam/remove-sectionlanguage'

export class ExamController {
  constructor(
    private readonly createUseCase: CreateExamUseCase,
    private readonly addCommonSubjectUseCase: AddCommonSubjectUseCase,
    private readonly updateCommonSubjectUseCase: UpdateCommonSubjectUseCase,
    private readonly removeCommonSubjectUseCase: RemoveCommonSubjectUseCase,
    private readonly addSectionLanguageUseCase: AddSectionLanguageUseCase,
    private readonly removeSectionLanguageUseCase: RemoveSectionLanguageUseCase,
    private readonly publishUseCase: PublishExamUseCase,
    private readonly enterMarksUseCase: EnterMarksUseCase,
    private readonly declareUseCase: DeclareExamUseCase,
    private readonly examRepo: IExamRepository,
    private readonly scheduleRepo: IExamScheduleRepository,
    private readonly marksRepo: IMarksRepository,
  ) { }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createUseCase.execute({
        dto: req.body,
        createdBy: req.user!.userId,
      })
      res.status(201).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.examRepo.findAll(req.query as any)
      res.status(200).json({
        success: true,
        data: {
          data: result.data.map(ExamMapper.toDto),
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      })
    } catch (err) { next(err) }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exam = await this.examRepo.findById(req.params.id)
      if (!exam) { res.status(404).json({ success: false, message: 'Exam not found' }); return }
      res.status(200).json({ success: true, data: ExamMapper.toDto(exam) })
    } catch (err) { next(err) }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exam = await this.examRepo.findById(req.params.id)
      if (!exam) { res.status(404).json({ success: false, message: 'Exam not found' }); return }
      exam.updateDetails(req.body)
      const updated = await this.examRepo.update(req.params.id, exam)
      res.status(200).json({ success: true, data: ExamMapper.toDto(updated!) })
    } catch (err) { next(err) }
  }

  addCommonSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('addCommonSubject body:', JSON.stringify(req.body, null, 2))  // ← add
      const result = await this.addCommonSubjectUseCase.execute(req.params.id, req.body)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  updateCommonSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateCommonSubjectUseCase.execute(req.params.id, req.body)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  removeCommonSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.removeCommonSubjectUseCase.execute(
        req.params.id,
        req.params.grade,
        req.params.subjectId,
      )
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  addSectionLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.addSectionLanguageUseCase.execute(req.params.id, req.body)
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  removeSectionLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.removeSectionLanguageUseCase.execute(
        req.params.id,
        req.params.grade,
        req.params.classId,
      )
      res.status(200).json({ success: true, data: result })
    } catch (err) { next(err) }
  }

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

  getSchedules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const schedules = await this.scheduleRepo.findByExamId(req.params.id)
      res.status(200).json({ success: true, data: schedules.map(ExamMapper.scheduleToDto) })
    } catch (err) { next(err) }
  }

  enterMarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.enterMarksUseCase.execute({
        dto: req.body,
        teacherId: req.user!.userId,
      })
      res.status(200).json({ success: true, message: 'Marks submitted successfully' })
    } catch (err) { next(err) }
  }

  getMarksBySchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const marks = await this.marksRepo.findByScheduleId(req.params.scheduleId)
      res.status(200).json({ success: true, data: marks.map(ExamMapper.marksToDto) })
    } catch (err) { next(err) }
  }

  myPendingMarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const schedules = await this.scheduleRepo.findByTeacherIdAndStatuses(
        req.user!.userId, [MarksStatus.PENDING],
      )
      res.status(200).json({ success: true, data: schedules.map(ExamMapper.scheduleToDto) })
    } catch (err) { next(err) }
  }

  getClassResults = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exam = await this.examRepo.findById(req.params.id)
      if (!exam) { res.status(404).json({ success: false, message: 'Exam not found' }); return }
      if (exam.status !== 'declared') {
        res.status(403).json({ success: false, message: 'Results not yet declared' }); return
      }
      const marks = await this.marksRepo.findByClassAndExam(req.params.classId, req.params.id)
      res.status(200).json({ success: true, data: marks.map(ExamMapper.marksToDto) })
    } catch (err) { next(err) }
  }


  // Add to ExamController

  mySchedulesForClass = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const schedules = await this.scheduleRepo.findByTeacherAndClass(
        req.user!.userId,
        req.params.classId,
      )
      res.status(200).json({
        success: true,
        data: schedules.map(ExamMapper.scheduleToDto),
      })
    } catch (err) { next(err) }
  }

  mySubmittedMarks = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const schedules = await this.scheduleRepo.findByTeacherIdAndStatuses(
        req.user!.userId,
        [MarksStatus.SUBMITTED, MarksStatus.LOCKED],
      )
      res.status(200).json({
        success: true,
        data: schedules.map(ExamMapper.scheduleToDto),
      })
    } catch (err) { next(err) }
  }

  getStudentResults = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const marks = await this.marksRepo.findByStudentAndExam(
        req.params.studentId,
        req.params.examId ?? '',
      )
      res.status(200).json({
        success: true,
        data: marks.map(ExamMapper.marksToDto),
      })
    } catch (err) { next(err) }
  }

}