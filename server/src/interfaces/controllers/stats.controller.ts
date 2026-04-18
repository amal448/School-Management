import { Request, Response, NextFunction } from 'express'
import { HttpStatus } from 'src/shared/enums/http-status.enum'
import { StatsOverviewUseCase } from 'src/application/use-cases/stats/stats.overview.use-case'
import { GradePerformanceUseCase } from 'src/application/use-cases/stats/stats.grade-performance.use-case'
import { StudentStatsUseCase } from 'src/application/use-cases/stats/stats.student.use-case'

export class StatsController {
    constructor(
        private readonly overviewUseCase: StatsOverviewUseCase,
        private readonly gradePerformanceUseCase: GradePerformanceUseCase,
        private readonly studentStatsUseCase: StudentStatsUseCase,
    ) { }

    // GET /api/stats/overview — admin + manager
    overview = async (
        req: Request, res: Response, next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.overviewUseCase.execute()
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            })
        } catch (err) { next(err) }
    }

    // GET /api/stats/grade-performance?grade=10&examType=midterm
    // Returns avg marks per subject for a grade across all sections
    gradePerformance = async (
        req: Request, res: Response, next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.gradePerformanceUseCase.execute({
                grade: req.query.grade as string,
                examType: req.query.examType as string,
            })
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            })
        } catch (err) { next(err) }
    }

    // GET /api/stats/student/:studentId — student's own stats
    studentStats = async (
        req: Request, res: Response, next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.studentStatsUseCase.execute(req.params.studentId)
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            })
        } catch (err) { next(err) }
    }
}