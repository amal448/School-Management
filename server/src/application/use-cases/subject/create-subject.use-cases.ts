import { IUseCase } from '../interfaces/use-case.interface'
import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import { ISubjectRepository } from 'src/application/ports/repositories/subject.repository.interface'
import { ILogger } from 'src/application/ports/services'
import { SubjectEntity } from 'src/domain/entities/subject.entity'
import { CreateSubjectDto, SubjectResponseDto } from 'src/domain/dtos/subject.dto'
import { AppError } from 'src/shared/types/app-error'
import { SubjectMapper } from 'src/application/mappers'

export class CreateSubjectUseCase
  implements IUseCase<CreateSubjectDto, SubjectResponseDto> {

  constructor(
    private readonly subjectRepo: ISubjectRepository,
    private readonly deptRepo: IDepartmentRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(input: CreateSubjectDto): Promise<SubjectResponseDto> {
    const dept = await this.deptRepo.findById(input.deptId)
    if (!dept) throw AppError.notFound('Department not found')

    const exists = await this.subjectRepo.existsByNameInDept(
      input.subjectName,
      input.deptId,
    )
    if (exists) throw AppError.conflict('Subject already exists')

    const subject = SubjectEntity.create(input)
    const saved = await this.subjectRepo.save(subject)

    this.logger.info('Subject created', { id: saved.id })

    return SubjectMapper.toDto(saved)
  }
}