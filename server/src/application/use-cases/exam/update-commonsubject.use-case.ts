import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ExamStatus } from 'src/domain/enums'
import {
    UpdateCommonSubjectDto,
    ExamResponseDto,
} from 'src/domain/dtos/exam.dto'
import { AppError } from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'


// ── Update common subject ──────────────────────────────
export class UpdateCommonSubjectUseCase {
    constructor(private readonly examRepo: IExamRepository) { }

    async execute(examId: string, dto: UpdateCommonSubjectDto): Promise<ExamResponseDto> {
        const exam = await this.examRepo.findById(examId)
        if (!exam) throw AppError.notFound('Exam not found')
        if (exam.status !== ExamStatus.DRAFT) {
            throw AppError.badRequest('Only draft exams can be configured')
        }

        exam.updateCommonSubject(dto.grade, dto.subjectId, dto)
        const updated = await this.examRepo.update(examId, exam)
        return ExamMapper.toDto(updated!)
    }
}


