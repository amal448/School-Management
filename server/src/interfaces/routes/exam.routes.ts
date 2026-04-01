import { Router } from 'express'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate } from 'src/interfaces/middlewares/validate.middleware'
import { Role, ExamType } from 'src/domain/enums'
import { AddCommonSubjectSchema, AddSectionLanguageSchema, CreateExamSchema, EnterMarksSchema, UpdateCommonSubjectSchema } from '../validators/exam.validators'
import { ExamController } from '../controllers/exam.controller'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createExamRouter = (ctrl: ExamController, authMW: AuthMW,): Router => {

    const router = Router()
    const { authenticate, authorize } = authMW

    // ── Exam CRUD ─────────────────────────────────────────
    router.post('/',  [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(CreateExamSchema), ctrl.create)
    router.get('/', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.list)
    router.get('/:id', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getById)
    router.patch('/:id',  [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.update)

    // ── Common subjects (per grade) ───────────────────────
    router.post('/:id/grades/subjects',
         [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(AddCommonSubjectSchema), ctrl.addCommonSubject)

    router.patch('/:id/grades/subjects',
         [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(UpdateCommonSubjectSchema), ctrl.updateCommonSubject)

    router.delete('/:id/grades/:grade/subjects/:subjectId',
         [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.removeCommonSubject)

    // ── Section languages ─────────────────────────────────
    router.post('/:id/grades/languages',
         [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(AddSectionLanguageSchema), ctrl.addSectionLanguage)

    router.delete('/:id/grades/:grade/languages/:classId',
         [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.removeSectionLanguage)

    // ── Publish + Declare ─────────────────────────────────
    router.post('/:id/publish',  [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.publish)
    router.post('/:id/declare',  [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.declare)

    // ── Schedules ─────────────────────────────────────────
    router.get('/:id/schedules', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getSchedules)

    // ── Marks ─────────────────────────────────────────────
    router.post('/marks',
        [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], validate(EnterMarksSchema), ctrl.enterMarks)

    router.get('/schedules/:scheduleId/marks',
        [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getMarksBySchedule)

    router.get('/pending-marks/me',
        authenticate, authorize(Role.TEACHER), ctrl.myPendingMarks)

    router.get('/:id/results/:classId',
        [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getClassResults)

    return router
}