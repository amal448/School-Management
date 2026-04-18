import { IUseCase } from '../interfaces/use-case.interface'
import { TopperResponseDto, CreateTopperDto } from 'src/domain/dtos/topper.dto'
import { ITopperRepository } from 'src/application/ports/repositories/topper.repository.interface'
import { TopperMapper } from 'src/application/mappers'
import { TopperEntity } from 'src/domain/entities/topper.entity'
import { AppError } from 'src/shared/types/app-error'

export interface CreateTopperInput extends CreateTopperDto {
  userId: string;
}

export class CreateTopperUseCase implements IUseCase<CreateTopperInput, TopperResponseDto> {
  constructor(private readonly repo: ITopperRepository) { }

  async execute(dto: CreateTopperInput): Promise<TopperResponseDto> {
    const { name, grade, department, marks, totalMarks,
      photoUrl, academicYear, rank, isPublished, userId } = dto

    const parsedRank = rank !== undefined && rank !== 0 && rank !== null ? Number(rank) : undefined

    // Rank uniqueness check
    const rankTaken = await this.repo.existsByRankAndGrade(
      parsedRank as any, // repository allows numbers here, typing is a bit loose on db level
      grade,
      academicYear,
    )
    if (rankTaken) {
      throw AppError.conflict(
        `Rank ${parsedRank} is already assigned to another student in Grade ${grade} for ${academicYear}`
      )
    }

    const entity = TopperEntity.create({
      name,
      grade,
      department,
      marks: Number(marks),
      totalMarks: Number(totalMarks),
      photoUrl,
      academicYear,
      rank: parsedRank,
      isPublished: isPublished ?? false,
      createdBy: userId,
    })

    const saved = await this.repo.save(entity)
    return TopperMapper.toDto(saved)
  }
}
