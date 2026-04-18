import { IMarksRepository } from 'src/application/ports/repositories/marks.repository.interface'
import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { IUseCase } from '../interfaces/use-case.interface'
import { ExamStatus } from 'src/domain/enums'

export interface GradePerformanceInput {
    grade?: string
    examType?: string
}

export class GradePerformanceUseCase implements IUseCase<GradePerformanceInput, any> {
    constructor(
        private readonly examRepo: IExamRepository,
        private readonly classRepo: IClassRepository,
        private readonly marksRepo: IMarksRepository,
    ) {}

    async execute({ grade, examType }: GradePerformanceInput): Promise<any> {
        // Find all declared exams matching filter
        const exams = await this.examRepo.findAll({
            status: ExamStatus.DECLARED,
            limit: 100,
        } as any)

        const matchingExams = exams.data.filter((e) => {
            const hasGrade = !grade || e.gradeConfigs.some(
                (g) => g.grade === grade
            )
            const hasType = !examType || e.examType === examType
            return hasGrade && hasType
        })

        if (!matchingExams.length) {
            return { exams: [], subjectAverages: [] }
        }

        // Get all classes of this grade
        const classes = grade
            ? await this.classRepo.findByGrade(grade)
            : []

        const classIds = new Set(classes.map((c) => c.id!))

        // Collect marks for all matching exams and classes
        const subjectTotals: Record<string, { total: number; count: number; name: string }> = {}

        for (const exam of matchingExams) {
            for (const classId of classIds) {
                const marks = await this.marksRepo.findByClassAndExam(classId, exam.id!)
                for (const mark of marks) {
                    if (mark.isAbsent) continue
                    const sid = mark.subjectId
                    if (!subjectTotals[sid]) {
                        subjectTotals[sid] = { total: 0, count: 0, name: sid }
                    }
                    subjectTotals[sid]!.total += (mark.marksScored / mark.totalMarks) * 100
                    subjectTotals[sid]!.count += 1
                }
            }
        }

        const subjectAverages = Object.entries(subjectTotals).map(
            ([subjectId, { total, count }]) => ({
                subjectId,
                average: Math.round(total / count),
            })
        )

        return {
            examCount: matchingExams.length,
            subjectAverages,
            exams: matchingExams.map((e) => ({
                id: e.id,
                examName: e.examName,
                examType: e.examType,
            })),
        }
    }
}
