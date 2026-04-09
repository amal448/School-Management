// src/interfaces/routes/exam.routes.ts
import { Router } from 'express'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { validate } from 'src/interfaces/middlewares/validate.middleware'
import { Role } from 'src/domain/enums'
import {
  AddCommonSubjectSchema,
  AddSectionLanguageSchema,
  CreateExamSchema,
  EnterMarksSchema,
  UpdateCommonSubjectSchema,
} from 'src/interfaces/validators/exam.validators'
import { ExamController } from 'src/interfaces/controllers/exam.controller'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createExamRouter = (
  ctrl: ExamController,
  authMW: AuthMW,
): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW

  const adminManager = [authenticate, authorize(Role.ADMIN, Role.MANAGER)]
  const allStaff = [authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.TEACHER)]

  // ── Static routes FIRST (before any /:id routes) ──────

  // POST /api/exams/marks
  router.post('/marks', allStaff, validate(EnterMarksSchema), ctrl.enterMarks,
  )

  // GET /api/exams/pending-marks/me
  router.get('/pending-marks/me', authenticate, authorize(Role.TEACHER), ctrl.myPendingMarks,
  )

  // GET /api/exams/schedules/:scheduleId/marks
  router.get('/schedules/:scheduleId/marks', allStaff, ctrl.getMarksBySchedule,
  )

  // ── Exam CRUD ──────────────────────────────────────────
  router.post('/', adminManager, validate(CreateExamSchema), ctrl.create,
  )

  router.get('/', allStaff, ctrl.list,
  )

  // Teacher's schedules for a specific class (pending + submitted)
  router.get(
    '/class/:classId/my-schedules',
    authenticate, authorize(Role.TEACHER),
    ctrl.mySchedulesForClass,
  )

  // Teacher's submitted schedules
  router.get(
    '/submitted-marks/me',
    authenticate, authorize(Role.TEACHER),
    ctrl.mySubmittedMarks,
  )

  // Student results (already in your code — just fix ordering)
  router.get(
    '/student/:studentId/results',
    allStaff,
    ctrl.getStudentResults,
  )



  router.get('/:id', allStaff, ctrl.getById,
  )

  router.patch('/:id', adminManager, ctrl.update,
  )

  // ── Common subjects ────────────────────────────────────
  router.post('/:id/grades/subjects', adminManager, validate(AddCommonSubjectSchema), ctrl.addCommonSubject)
  router.patch('/:id/grades/subjects', adminManager, validate(UpdateCommonSubjectSchema), ctrl.updateCommonSubject)
  router.delete('/:id/grades/:grade/subjects/:subjectId', adminManager, ctrl.removeCommonSubject)

  // ── Section languages ──────────────────────────────────
  router.post('/:id/grades/languages', adminManager, validate(AddSectionLanguageSchema), ctrl.addSectionLanguage)
  router.delete('/:id/grades/:grade/languages/:classId', adminManager, ctrl.removeSectionLanguage)

  // ── Lifecycle ──────────────────────────────────────────
  router.post('/:id/publish', adminManager, ctrl.publish)
  router.post('/:id/declare', adminManager, ctrl.declare) //marks 

  // ── Schedules ──────────────────────────────────────────
  router.get('/:id/schedules', allStaff, ctrl.getSchedules)

  // ── Results ────────────────────────────────────────────
  router.get('/:id/results/:classId', allStaff, ctrl.getClassResults)
  router.get('/student/:studentId/results', allStaff, ctrl.getStudentResults,
  )

  return router
}