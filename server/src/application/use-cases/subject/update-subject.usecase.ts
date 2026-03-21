import { SubjectMapper } from 'src/application/mappers'
import { IUseCase } from '../interfaces/use-case.interface'
import { ISubjectRepository } from 'src/application/ports/repositories/subject.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { UpdateSubjectDto, SubjectResponseDto } from 'src/domain/dtos/subject.dto'
import { AppError } from 'src/shared/types/app-error'

export interface UpdateSubjectInput {
  id: string
  dto: UpdateSubjectDto
}

export class UpdateSubjectUseCase
  implements IUseCase<UpdateSubjectInput, SubjectResponseDto> {

  constructor(
    private readonly subjectRepo: ISubjectRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: UpdateSubjectInput): Promise<SubjectResponseDto> {
    const subject = await this.subjectRepo.findById(input.id)
    if (!subject) throw AppError.notFound('Subject not found')

    subject.updateDetails(input.dto)

    const updated = await this.subjectRepo.update(input.id, subject)
    if (!updated) throw AppError.internal('Update failed')

    this.logger.info('Subject updated', { id: input.id })

    return SubjectMapper.toDto(updated)
  }
}