import { IUseCase }                  from '../interfaces/use-case.interface'
import { IExamRepository }           from 'src/application/ports/repositories/exam.repository.interface'
import { IExamTimetableRepository }  from 'src/application/ports/repositories/exam-timetable.repository.interface'
import { ILogger }                   from 'src/application/ports/services'
import { ExamTimetableEntity }       from 'src/domain/entities/exam-timetable.entity'
import { ExamStatus }                from 'src/domain/enums'
import {
  CreateTimetableEntryDto,
  TimetableEntryResponseDto,
} from 'src/domain/dtos/exam.dto'
import { AppError }                  from 'src/shared/types/app-error'
import { ExamMapper } from 'src/application/mappers'

export interface AddTimetableInput {
  dto:    CreateTimetableEntryDto
  examId: string
}

export class AddTimetableEntryUseCase
  implements IUseCase<AddTimetableInput, TimetableEntryResponseDto> {

  constructor(
    private readonly examRepo:       IExamRepository,
    private readonly timetableRepo:  IExamTimetableRepository,
    private readonly logger:         ILogger,
  ) {}

  async execute(input: AddTimetableInput): Promise<TimetableEntryResponseDto> {
    const exam = await this.examRepo.findById(input.examId)
    if (!exam) throw AppError.notFound('Exam not found')

    if (exam.status !== ExamStatus.DRAFT) {
      throw AppError.badRequest('Timetable can only be added to draft exams')
    }

    // Subject can appear only once per exam
    const exists = await this.timetableRepo.existsByExamAndSubject(
      input.examId,
      input.dto.subjectId,
    )
    if (exists) {
      throw AppError.conflict('This subject already has a timetable entry for this exam')
    }

    const entry = ExamTimetableEntity.create({
      ...input.dto,
      examId: input.examId,
    })

    const saved = await this.timetableRepo.save(entry)
    this.logger.info('AddTimetableEntryUseCase: added', { id: saved.id })
    return ExamMapper.timetableToDto(saved)
  }
}