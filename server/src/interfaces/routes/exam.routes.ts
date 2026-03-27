import { Router } from 'express'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate } from 'src/interfaces/middlewares/validate.middleware'
import { Role, ExamType } from 'src/domain/enums'
import { CreateExamSchema, EnterMarksSchema, TimetableEntrySchema } from '../validators/exam.validators'
import { ExamController } from '../controllers/exam.controller'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createExamRouter = (ctrl: ExamController, authMW: AuthMW,): Router => {
    
    const router = Router()
    const { authenticate, authorize } = authMW

    // ── Exam CRUD (Admin/Manager) ───────────────────────
    router.post('/', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(CreateExamSchema), ctrl.create)
    router.get('/', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.list)
    router.get('/:id', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getById)
    router.patch('/:id', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.update)

    // ── Timetable (Admin/Manager) ───────────────────────
    router.post('/:id/timetable', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], validate(TimetableEntrySchema), ctrl.addTimetableEntry)
    router.get('/:id/timetable', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getTimetable)
    router.delete('/:id/timetable/:entryId', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.deleteTimetableEntry)

    // ── Lifecycle (Admin/Manager) ───────────────────────
    router.post('/:id/publish', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.publish)
    router.post('/:id/declare', [authenticate, authorize(Role.ADMIN, Role.MANAGER)], ctrl.declare)

    // ── Schedules (read for all staff) ─────────────────
    router.get('/:id/schedules', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getSchedules)

    // ── Marks (Teacher enters, all staff reads) ─────────
    router.post('/marks', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], validate(EnterMarksSchema), ctrl.enterMarks)
    router.get('/schedules/:scheduleId/marks', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getMarksBySchedule)

    // ── Teacher's pending marks list ────────────────────
    router.get('/pending-marks/me', authenticate, authorize(Role.TEACHER), ctrl.myPendingMarks)

    // ── Student results (declared only) ────────────────
    router.get('/:id/results/:classId', [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)], ctrl.getClassResults)

    return router
}