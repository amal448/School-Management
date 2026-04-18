import { Router } from 'express'
import { createAuthMiddleware } from 'src/interfaces/middlewares/auth.middleware'
import { Role } from 'src/domain/enums'
import { StatsController } from 'src/interfaces/controllers/stats.controller'

type AuthMW = ReturnType<typeof createAuthMiddleware>

export const createStatsRouter = (
    ctrl: StatsController,
    authMW: AuthMW,
): Router => {
    const router = Router()
    const { authenticate, authorize } = authMW

    router.get(
        '/overview',
        authenticate,
        authorize(Role.ADMIN, Role.MANAGER),
        ctrl.overview,
    )

    router.get(
        '/grade-performance',
        authenticate,
        authorize(Role.ADMIN, Role.MANAGER),
        ctrl.gradePerformance,
    )

    router.get(
        '/student/:studentId',
        authenticate,
        authorize(Role.STUDENT, Role.ADMIN, Role.MANAGER),
        ctrl.studentStats,
    )

    return router
}