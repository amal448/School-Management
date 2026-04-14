// src/application/use-cases/class/allocate-subject.usecase.ts

import { ClassMapper }       from 'src/application/mappers'
import { IUseCase }          from '../interfaces/use-case.interface'
import { IClassRepository }  from 'src/application/ports/repositories/class.repository.interface'
import { ILogger }           from 'src/application/ports/services/logger.service.interface'
import { ClassResponseDto }  from 'src/domain/dtos/class.dto'
import { AppError }          from 'src/shared/types/app-error'
import { AllocateSubjectInput } from '../interfaces/inputs'

export class AllocateSubjectUseCase
  implements IUseCase<AllocateSubjectInput, ClassResponseDto> {

  constructor(
    private readonly classRepo: IClassRepository,
    private readonly logger:    ILogger,
  ) {}

  async execute(input: AllocateSubjectInput): Promise<ClassResponseDto> {
    const cls = await this.classRepo.findById(input.classId)
    if (!cls) throw AppError.notFound('Class not found')

    // ← Fix: input is flat now — no input.dto wrapper
    cls.allocateSubject({ subjectId: input.subjectId })

    const updated = await this.classRepo.update(input.classId, cls)
    if (!updated) throw AppError.internal('Allocation failed')

    this.logger.info('Subject allocated', {
      classId:   input.classId,
      subjectId: input.subjectId,   // ← flat
    })

    return ClassMapper.toDto(updated)
  }
}