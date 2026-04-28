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

import { ListExamsUseCase } from 'src/application/use-cases/exam/list-exams.use-case'
import { GetExamByIdUseCase } from 'src/application/use-cases/exam/get-exam-by-id.use-case'
import { UpdateExamUseCase } from 'src/application/use-cases/exam/update-exam.use-case'
import { GetExamSchedulesUseCase } from 'src/application/use-cases/exam/get-exam-schedules.use-case'
import { GetMarksByScheduleUseCase } from 'src/application/use-cases/exam/get-marks-by-schedule.use-case'
import { GetMyPendingMarksUseCase } from 'src/application/use-cases/exam/get-my-pending-marks.use-case'
import { GetClassResultsUseCase } from 'src/application/use-cases/exam/get-class-results.use-case'
import { GetMySchedulesForClassUseCase } from 'src/application/use-cases/exam/get-my-schedules-for-class.use-case'
import { GetMySubmittedMarksUseCase } from 'src/application/use-cases/exam/get-my-submitted-marks.use-case'
import { GetStudentResultsUseCase } from 'src/application/use-cases/exam/get-student-results.use-case'

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
    private readonly listExamsUseCase: ListExamsUseCase,
    private readonly getExamByIdUseCase: GetExamByIdUseCase,
    private readonly updateExamUseCase: UpdateExamUseCase,
    private readonly getExamSchedulesUseCase: GetExamSchedulesUseCase,
    private readonly getMarksByScheduleUseCase: GetMarksByScheduleUseCase,
    private readonly getMyPendingMarksUseCase: GetMyPendingMarksUseCase,
    private readonly getClassResultsUseCase: GetClassResultsUseCase,
    private readonly getMySchedulesForClassUseCase: GetMySchedulesForClassUseCase,
    private readonly getMySubmittedMarksUseCase: GetMySubmittedMarksUseCase,
    private readonly getStudentResultsUseCase: GetStudentResultsUseCase,
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
      const result = await this.listExamsUseCase.execute(req.query as any)
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
      const exam = await this.getExamByIdUseCase.execute(req.params.id)
      if (!exam) { res.status(404).json({ success: false, message: 'Exam not found' }); return }
      res.status(200).json({ success: true, data: ExamMapper.toDto(exam) })
    } catch (err) { next(err) }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.updateExamUseCase.execute(req.params.id, req.body)
      res.status(200).json({ success: true, data: ExamMapper.toDto(updated) })
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
      const schedules = await this.getExamSchedulesUseCase.execute(req.params.id)
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
      const marks = await this.getMarksByScheduleUseCase.execute(req.params.scheduleId)
      res.status(200).json({ success: true, data: marks.map(ExamMapper.marksToDto) })
    } catch (err) { next(err) }
  }

  myPendingMarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const schedules = await this.getMyPendingMarksUseCase.execute(req.user!.userId)
      res.status(200).json({ success: true, data: schedules.map(ExamMapper.scheduleToDto) })
    } catch (err) { next(err) }
  }

  getClassResults = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const marks = await this.getClassResultsUseCase.execute(req.params.classId, req.params.id)
      res.status(200).json({ success: true, data: marks.map(ExamMapper.marksToDto) })
    } catch (err) { next(err) }
  }


  // Add to ExamController

  mySchedulesForClass = async (
    req: Request, res: Response, next: NextFunction
  ): Promise<void> => {
    try {
      const schedules = await this.getMySchedulesForClassUseCase.execute(
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
      const schedules = await this.getMySubmittedMarksUseCase.execute(req.user!.userId)
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
      const marks = await this.getStudentResultsUseCase.execute(req.params.studentId)
      res.status(200).json({
        success: true,
        data: marks.map(ExamMapper.marksToDto),
      })
    } catch (err) { next(err) }
  }

}