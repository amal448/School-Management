import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { ExamStatus } from 'src/domain/enums'
import { AddCommonSubjectDto, AddSectionLanguageDto, ExamResponseDto } from 'src/domain/dtos/exam.dto'
import { AppError } from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'

// ── Add common subject ─────────────────────────────────
export class AddCommonSubjectUseCase {
    constructor(
        private readonly examRepo: IExamRepository,
        private readonly logger: ILogger,
    ) { }

    // src/application/use-cases/exam/add-commonsubject.use-case.ts

    async execute(examId: string, dto: AddCommonSubjectDto): Promise<ExamResponseDto> {
        const exam = await this.examRepo.findById(examId)
        if (!exam) throw AppError.notFound('Exam not found')

        if (exam.status !== ExamStatus.DRAFT) {
            throw AppError.badRequest('Only draft exams can be configured')
        }

        exam.addCommonSubject(dto.grade, {
            subjectId: dto.subjectId,
            examDate: new Date(dto.examDate),
            startTime: dto.startTime,
            endTime: dto.endTime,
            totalMarks: Number(dto.totalMarks),
            passingMarks: Number(dto.passingMarks),
        })

        // ← Add this temporarily to confirm entity has the data
        console.log(
            'gradeConfigs after addCommonSubject:',
            JSON.stringify(exam.gradeConfigs, null, 2)
        )

        const updated = await this.examRepo.update(examId, exam)

        // ← Add this to confirm what came back from DB
        console.log(
            'updated gradeConfigs from DB:',
            JSON.stringify(updated?.gradeConfigs, null, 2)
        )

        if (!updated) throw AppError.internal('Update failed')

        this.logger.info('AddCommonSubjectUseCase', { examId, grade: dto.grade })
        return ExamMapper.toDto(updated)
    }
}