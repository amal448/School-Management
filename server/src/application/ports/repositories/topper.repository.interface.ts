import { IBaseRepository } from './base.repository.interface'
import { TopperEntity } from 'src/domain/entities/topper.entity'
import { TopperQueryDto } from 'src/domain/dtos/topper.dto'
// src/application/ports/repositories/topper.repository.interface.ts

export interface ITopperRepository
  extends IBaseRepository<TopperEntity, TopperQueryDto> {
  findPublishedGrouped(): Promise<Record<string, TopperEntity[]>>
  existsByRankAndGrade(
    rank: number,
    grade: string,
    academicYear: string,
    excludeId?: string,   // ← for update — exclude current record
  ): Promise<boolean>
}