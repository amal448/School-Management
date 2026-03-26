import { IUseCase }       from '../interfaces/use-case.interface'
import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ILogger }        from 'src/application/ports/services'
import { ExamEntity }     from 'src/domain/entities/exam.entity'
import { ExamStatus }     from 'src/domain/enums'
import {
  CreateExamDto,
  ExamResponseDto,
} from 'src/domain/dtos/exam.dto'
import { AppError }       from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'

export interface CreateExamInput {
  dto:       CreateExamDto
  createdBy: string
}

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

    if (!input.dto.applicableClasses.length) {
      throw AppError.badRequest('At least one class must be selected')
    }

    const exam = ExamEntity.create({
      ...input.dto,
      status:    ExamStatus.DRAFT,
      createdBy: input.createdBy,
    })

    const saved = await this.examRepo.save(exam)
    this.logger.info('CreateExamUseCase: created', { id: saved.id })
    return ExamMapper.toDto(saved)
  }
}