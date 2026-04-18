import { IMarksRepository } from 'src/application/ports/repositories/marks.repository.interface'
import { IUseCase } from '../interfaces/use-case.interface'

export class StudentStatsUseCase implements IUseCase<string, any> {
    constructor(
        private readonly marksRepo: IMarksRepository,
    ) {}

    async execute(studentId: string): Promise<any> {
        const marks = await this.marksRepo.findByStudentId(studentId)

        if (!marks.length) {
            return { overall: 0, bySubject: [], byExam: [] }
        }

        // Overall percentage
        const totalScored = marks
            .filter((m) => !m.isAbsent)
            .reduce((s, m) => s + m.marksScored, 0)
        const totalMax = marks
            .filter((m) => !m.isAbsent)
            .reduce((s, m) => s + m.totalMarks, 0)

        const overall = totalMax > 0
            ? Math.round((totalScored / totalMax) * 100)
            : 0

        // By subject — average across all exams
        const bySubjectMap: Record<string, { total: number; count: number }> = {}
        for (const m of marks) {
            if (m.isAbsent) continue
            const sid = m.subjectId
            if (!bySubjectMap[sid]) bySubjectMap[sid] = { total: 0, count: 0 }
            bySubjectMap[sid]!.total += (m.marksScored / m.totalMarks) * 100
            bySubjectMap[sid]!.count += 1
        }

        const bySubject = Object.entries(bySubjectMap).map(
            ([subjectId, { total, count }]) => ({
                subjectId,
                average: Math.round(total / count),
            })
        )

        // By exam — total percentage per exam
        const byExamMap: Record<string, { scored: number; total: number }> = {}
        for (const m of marks) {
            if (!byExamMap[m.examId]) byExamMap[m.examId] = { scored: 0, total: 0 }
            if (!m.isAbsent) byExamMap[m.examId]!.scored += m.marksScored
            byExamMap[m.examId]!.total += m.totalMarks
        }

        const byExam = Object.entries(byExamMap).map(
            ([examId, { scored, total }]) => ({
                examId,
                percentage: Math.round((scored / total) * 100),
            })
        )

        return { overall, bySubject, byExam }
    }
}
