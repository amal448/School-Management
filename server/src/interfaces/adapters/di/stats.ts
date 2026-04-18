import { Router } from 'express'
import { MongooseTeacherRepository } from 'src/infrastructure/repositories/teacher.repository'
import { MongooseStudentRepository } from 'src/infrastructure/repositories/student.repository'
import { MongooseDepartmentRepository } from 'src/infrastructure/repositories/department.repository'
import { MongooseMarksRepository } from 'src/infrastructure/repositories/marks.repository'
import { MongooseExamRepository } from 'src/infrastructure/repositories/exam.repository'
import { MongooseClassRepository } from 'src/infrastructure/repositories/class.repository'

import { StatsOverviewUseCase } from 'src/application/use-cases/stats/stats.overview.use-case'
import { GradePerformanceUseCase } from 'src/application/use-cases/stats/stats.grade-performance.use-case'
import { StudentStatsUseCase } from 'src/application/use-cases/stats/stats.student.use-case'
import { StatsController } from 'src/interfaces/controllers/stats.controller'
import { createStatsRouter } from 'src/interfaces/routes/stats.routes'

export function buildStatsModule(authMW: any): { router: Router } {
    const teacherRepo = new MongooseTeacherRepository()
    const studentRepo = new MongooseStudentRepository()
    const deptRepo = new MongooseDepartmentRepository()
    const marksRepo = new MongooseMarksRepository()
    const examRepo = new MongooseExamRepository()
    const classRepo = new MongooseClassRepository()

    const overviewUseCase = new StatsOverviewUseCase(teacherRepo as any, studentRepo, deptRepo)
    const gradePerformanceUseCase = new GradePerformanceUseCase(examRepo, classRepo, marksRepo)
    const studentStatsUseCase = new StudentStatsUseCase(marksRepo)

    const controller = new StatsController(
        overviewUseCase,
        gradePerformanceUseCase,
        studentStatsUseCase
    )

    return {
        router: createStatsRouter(controller, authMW)
    }
}
