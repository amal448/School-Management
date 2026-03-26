import { Router } from "express";
import { AddTimetableEntryUseCase } from "src/application/use-cases/exam/add-timetable-entry.use-case";
import { CreateExamUseCase } from "src/application/use-cases/exam/create-exam.use-case";
import { DeclareExamUseCase } from "src/application/use-cases/exam/declare-exam.use-case";
import { EnterMarksUseCase } from "src/application/use-cases/exam/enter-marks.use-case";
import { PublishExamUseCase } from "src/application/use-cases/exam/publish-exam.use-case";
import { MongooseClassRepository } from "src/infrastructure/repositories/class.repository";
import { MongooseExamScheduleRepository } from "src/infrastructure/repositories/exam-schedule.repository";
import { MongooseExamTimetableRepository } from "src/infrastructure/repositories/exam-timetable.repository";
import { MongooseExamRepository } from "src/infrastructure/repositories/exam.repository";
import { MongooseMarksRepository } from "src/infrastructure/repositories/marks.repository";
import { MongooseStudentRepository } from "src/infrastructure/repositories/student.repository";
import { WinstonLogger } from "src/infrastructure/services";
import { ExamController } from "src/interfaces/controllers/exam.controller";
import { createExamRouter } from "src/interfaces/routes/exam.routes";

export function buildExamModule(
    logger: WinstonLogger,
    authMW: any,
): { router: Router } {

    const examRepo = new MongooseExamRepository()
    const timetableRepo = new MongooseExamTimetableRepository()
    const scheduleRepo = new MongooseExamScheduleRepository()
    const marksRepo = new MongooseMarksRepository()
    const classRepo = new MongooseClassRepository()
    const studentRepo = new MongooseStudentRepository()

    const controller = new ExamController(
        new CreateExamUseCase(examRepo, logger),
        new AddTimetableEntryUseCase(examRepo, timetableRepo, logger),
        new PublishExamUseCase(examRepo, timetableRepo, scheduleRepo, classRepo, logger),
        new EnterMarksUseCase(scheduleRepo, examRepo, timetableRepo, studentRepo, marksRepo, logger),
        new DeclareExamUseCase(examRepo, scheduleRepo, logger),
        examRepo,
        timetableRepo,
        scheduleRepo,
        marksRepo,
    )
    return { router: createExamRouter(controller, authMW) }
}