import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { ExamStatus } from 'src/domain/enums'
import { AddSectionLanguageDto, ExamResponseDto } from 'src/domain/dtos/exam.dto'
import { AppError } from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'

// ── Add common subject ─────────────────────────────────
export class AddCommonSubjectUseCase {
    constructor(
        private readonly examRepo: IExamRepository,
        private readonly logger: ILogger,
    ) { }

    async execute(examId: string, dto: AddSectionLanguageDto): Promise<ExamResponseDto> {
        const exam = await this.examRepo.findById(examId)
        if (!exam) throw AppError.notFound('Exam not found')
        if (exam.status !== ExamStatus.DRAFT) {
            throw AppError.badRequest('Only draft exams can be configured')
        }

        // Pass grade as first arg, language object without grade as second
        exam.addCommonSubject(dto.grade, {
            subjectId: dto.subjectId,
            examDate: new Date(dto.examDate),   // ← ensure it's a Date object
            startTime: dto.startTime,
            endTime: dto.endTime,
            totalMarks: Number(dto.totalMarks),   // ← ensure it's a number
            passingMarks: Number(dto.passingMarks), // ← ensure it's a number
        })

        const updated = await this.examRepo.update(examId, exam)
         this.logger.info('AddCommonSubjectUseCase', { examId, grade: dto.grade })
        return ExamMapper.toDto(updated!)
    }
}