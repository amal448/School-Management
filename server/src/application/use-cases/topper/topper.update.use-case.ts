import { IUseCase } from '../interfaces/use-case.interface'
import { TopperResponseDto, UpdateTopperDto } from 'src/domain/dtos/topper.dto'
import { ITopperRepository } from 'src/application/ports/repositories/topper.repository.interface'
import { TopperMapper } from 'src/application/mappers'
import { AppError } from 'src/shared/types/app-error'

export interface UpdateTopperInput {
  id: string;
  dto: UpdateTopperDto;
}

export class UpdateTopperUseCase implements IUseCase<UpdateTopperInput, TopperResponseDto> {
  constructor(private readonly repo: ITopperRepository) {}

  async execute({ id, dto }: UpdateTopperInput): Promise<TopperResponseDto> {
    const entity = await this.repo.findById(id)
    if (!entity) throw AppError.notFound('Topper not found')

    const newRank = dto.rank !== undefined ? Number(dto.rank) : entity.rank
    const newGrade = dto.grade ?? entity.grade
    const newAcademicYear = dto.academicYear ?? entity.academicYear

    const rankChanged = newRank !== entity.rank
      || newGrade !== entity.grade
      || newAcademicYear !== entity.academicYear

    if (rankChanged) {
      const rankTaken = await this.repo.existsByRankAndGrade(
        newRank as any,
        newGrade,
        newAcademicYear,
        id,
      )
      if (rankTaken) {
        throw AppError.conflict(
          `Rank ${newRank} is already assigned to another student in Grade ${newGrade} for ${newAcademicYear}`
        )
      }
    }

    entity.update({
      name: dto.name,
      grade: dto.grade,
      department: dto.department,
      marks: dto.marks !== undefined ? Number(dto.marks) : undefined,
      totalMarks: dto.totalMarks !== undefined ? Number(dto.totalMarks) : undefined,
      photoUrl: dto.photoUrl,
      rank: dto.rank !== undefined && dto.rank !== "" as any ? Number(dto.rank) : undefined,
      academicYear: dto.academicYear,
    })

    const updated = await this.repo.update(id, entity)
    return TopperMapper.toDto(updated!)
  }
}
