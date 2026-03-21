import { SubjectMapper } from 'src/application/mappers'
import { IUseCase } from '../interfaces/use-case.interface'
import { ISubjectRepository } from 'src/application/ports/repositories/subject.repository.interface'
import { SubjectResponseDto } from 'src/domain/dtos/subject.dto'
import { AppError } from 'src/shared/types/app-error'

export class GetSubjectUseCase
  implements IUseCase<string, SubjectResponseDto> {

  constructor(private readonly subjectRepo: ISubjectRepository) {}

  async execute(id: string): Promise<SubjectResponseDto> {
    const subject = await this.subjectRepo.findById(id)
    if (!subject) throw AppError.notFound('Subject not found')

    return SubjectMapper.toDto(subject)
  }
}