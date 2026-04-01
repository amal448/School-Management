import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import {
    ExamResponseDto,
} from 'src/domain/dtos/exam.dto'
import { AppError } from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'



// ── Remove section language ────────────────────────────
export class RemoveSectionLanguageUseCase {
    constructor(private readonly examRepo: IExamRepository) { }

    async execute(
        examId: string, grade: string, classId: string,
    ): Promise<ExamResponseDto> {
        const exam = await this.examRepo.findById(examId)
        if (!exam) throw AppError.notFound('Exam not found')

        exam.removeSectionLanguage(grade, classId)
        const updated = await this.examRepo.update(examId, exam)
        return ExamMapper.toDto(updated!)
    }
}