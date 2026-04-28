// src/interfaces/adapters/di/exam.ts

import { Router }                      from 'express'
import { WinstonLogger }               from 'src/infrastructure/services'
import { MongooseExamRepository }      from 'src/infrastructure/repositories/exam.repository'
import { MongooseExamScheduleRepository } from 'src/infrastructure/repositories/exam-schedule.repository'
import { MongooseMarksRepository }     from 'src/infrastructure/repositories/marks.repository'
import { MongooseClassRepository }     from 'src/infrastructure/repositories/class.repository'
import { MongooseStudentRepository }   from 'src/infrastructure/repositories/student.repository'
import { CreateExamUseCase }           from 'src/application/use-cases/exam/create-exam.use-case'

import { PublishExamUseCase }          from 'src/application/use-cases/exam/publish-exam.use-case'
import { EnterMarksUseCase }           from 'src/application/use-cases/exam/enter-marks.use-case'
import { DeclareExamUseCase }          from 'src/application/use-cases/exam/declare-exam.use-case'
import { ExamController }              from 'src/interfaces/controllers/exam.controller'
import { createExamRouter }            from 'src/interfaces/routes/exam.routes'
import { AddCommonSubjectUseCase } from 'src/application/use-cases/exam/add-commonsubject.use-case'
import {  UpdateCommonSubjectUseCase } from 'src/application/use-cases/exam/update-commonsubject.use-case'
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

export function buildExamModule(
  logger:  WinstonLogger,
  authMW:  any,
): { router: Router } {

  const examRepo     = new MongooseExamRepository()
  const scheduleRepo = new MongooseExamScheduleRepository()
  const marksRepo    = new MongooseMarksRepository()
  const classRepo    = new MongooseClassRepository()
  const studentRepo  = new MongooseStudentRepository()

  const controller = new ExamController(
    new CreateExamUseCase(examRepo, logger),
    new AddCommonSubjectUseCase(examRepo, logger),
    new UpdateCommonSubjectUseCase(examRepo),
    new RemoveCommonSubjectUseCase(examRepo),
    new AddSectionLanguageUseCase(examRepo, logger),
    new RemoveSectionLanguageUseCase(examRepo),
    new PublishExamUseCase(examRepo, scheduleRepo, classRepo, logger),
    new EnterMarksUseCase(scheduleRepo, examRepo, studentRepo, marksRepo, logger),
    new DeclareExamUseCase(examRepo, scheduleRepo, logger),
    new ListExamsUseCase(examRepo),
    new GetExamByIdUseCase(examRepo),
    new UpdateExamUseCase(examRepo),
    new GetExamSchedulesUseCase(scheduleRepo),
    new GetMarksByScheduleUseCase(marksRepo),
    new GetMyPendingMarksUseCase(scheduleRepo),
    new GetClassResultsUseCase(examRepo, marksRepo),
    new GetMySchedulesForClassUseCase(scheduleRepo),
    new GetMySubmittedMarksUseCase(scheduleRepo),
    new GetStudentResultsUseCase(marksRepo),
  )

  return { router: createExamRouter(controller, authMW) }
}