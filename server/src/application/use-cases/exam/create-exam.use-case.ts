import { IUseCase }        from '../interfaces/use-case.interface'
import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ILogger }         from 'src/application/ports/services'
import { ExamEntity }      from 'src/domain/entities/exam.entity'
import { ExamStatus }      from 'src/domain/enums'
import { CreateExamDto, ExamResponseDto } from 'src/domain/dtos/exam.dto'
import { AppError }        from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'
import { CreateExamInput } from '../interfaces/inputs'


export class CreateExamUseCase
  implements IUseCase<CreateExamInput, ExamResponseDto> {

  constructor(
    private readonly examRepo: IExamRepository,
    private readonly logger:   ILogger,
  ) {}

  async execute(input: CreateExamInput): Promise<ExamResponseDto> {
    if (input.dto.endDate <= input.dto.startDate) {
      throw AppError.badRequest('End date must be after start date')
    }
    if (!input.dto.grades.length) {
      throw AppError.badRequest('Select at least one grade')
    }

    const exam = ExamEntity.create({
      examName:     input.dto.examName,
      examType:     input.dto.examType,
      academicYear: input.dto.academicYear,
      startDate:    input.dto.startDate,
      endDate:      input.dto.endDate,
      status:       ExamStatus.DRAFT,
      gradeConfigs: input.dto.grades.map((grade) => ({
        grade,
        commonSubjects:   [],
        sectionLanguages: [],
      })),
      createdBy: input.createdBy,
    })

    const saved = await this.examRepo.save(exam)
    this.logger.info('CreateExamUseCase: created', { id: saved.id })
    return ExamMapper.toDto(saved)
  }
}