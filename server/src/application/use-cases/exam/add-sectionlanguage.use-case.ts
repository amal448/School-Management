// src/application/use-cases/exam/add-sectionlanguage.use-case.ts

import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { ExamStatus } from 'src/domain/enums'
import { AddSectionLanguageDto, ExamResponseDto } from 'src/domain/dtos/exam.dto'
import { AppError } from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'

export class AddSectionLanguageUseCase {
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

    exam.addSectionLanguage(
      dto.grade,          // ← first arg: grade
      {                   // ← second arg: language object
        classId: dto.classId,
        subjectId: dto.subjectId,
        examDate: new Date(dto.examDate),   // ← ensure Date object
        startTime: dto.startTime,
        endTime: dto.endTime,
        totalMarks: Number(dto.totalMarks),
        passingMarks: Number(dto.passingMarks),
      },
    )

    const updated = await this.examRepo.update(examId, exam)
    this.logger.info('AddSectionLanguageUseCase', { examId, classId: dto.classId })
    return ExamMapper.toDto(updated!)
  }
}