import { FilterQuery } from 'mongoose'
import { ITopperRepository } from 'src/application/ports/repositories/topper.repository.interface'
import { TopperEntity } from 'src/domain/entities/topper.entity'
import { TopperQueryDto } from 'src/domain/dtos/topper.dto'
import { PaginatedResult } from 'src/application/ports/repositories/base.repository.interface'
import { TopperModel, ITopperDocument } from 'src/infrastructure/database/schemas/topper.schema'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/shared/constants'
import { TopperDocumentMapper } from './mappers'

export class MongooseTopperRepository implements ITopperRepository {

  async save(entity: TopperEntity): Promise<TopperEntity> {
    const doc = await TopperModel.create(
      TopperDocumentMapper.toPersistence(entity)
    )
    return TopperDocumentMapper.toDomain(doc)
  }

  async findById(id: string): Promise<TopperEntity | null> {
    const doc = await TopperModel.findById(id).lean<ITopperDocument>()
    return doc ? TopperDocumentMapper.toDomain(doc as ITopperDocument) : null
  }

  async findAll(query: TopperQueryDto): Promise<PaginatedResult<TopperEntity>> {
    const page = query.page ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip = (page - 1) * limit

    const filter: FilterQuery<ITopperDocument> = {}
    if (query.grade) filter.grade = query.grade
    if (query.academicYear) filter.academicYear = query.academicYear
    if (query.isPublished !== undefined) filter.isPublished = query.isPublished

    const [docs, total] = await Promise.all([
      TopperModel.find(filter)
        .sort({ grade: 1, rank: 1 })
        .skip(skip)
        .limit(limit)
        .lean<ITopperDocument[]>(),
      TopperModel.countDocuments(filter),
    ])

    return {
      data: (docs as ITopperDocument[]).map(TopperDocumentMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async update(id: string, entity: TopperEntity): Promise<TopperEntity | null> {
    const doc = await TopperModel.findByIdAndUpdate(
      id,
      { $set: TopperDocumentMapper.toPersistence(entity) },
      { new: true, runValidators: false },
    ).lean<ITopperDocument>()
    return doc ? TopperDocumentMapper.toDomain(doc as ITopperDocument) : null
  }

  async delete(id: string): Promise<void> {
    await TopperModel.findByIdAndDelete(id)
  }

  async existsById(id: string): Promise<boolean> {
    return (await TopperModel.countDocuments({ _id: id })) > 0
  }
  async existsByRankAndGrade(
    rank?: number,
    grade?: string,
    academicYear?: string,
    excludeId?: string,
  ): Promise<boolean> {
    if (rank === undefined) return false;
    const filter: FilterQuery<ITopperDocument> = { rank, grade, academicYear }
    if (excludeId) {
      filter._id = { $ne: excludeId }
    }
    return (await TopperModel.countDocuments(filter)) > 0
  }
  async findPublishedGrouped(): Promise<Record<string, TopperEntity[]>> {
    const docs = await TopperModel.aggregate([
      { $match: { isPublished: true } },
      {
        $addFields: {
          sortRank: { $ifNull: ["$rank", 999] } // ✅ null → 999
        }
      },
      {
        $sort: {
          grade: 1,
          sortRank: 1,   // ✅ ranked first
          marks: -1      // ✅ then by marks
        }
      }
    ])

    const entities = (docs as ITopperDocument[]).map(
      TopperDocumentMapper.toDomain
    )

    // Group by grade
    return entities.reduce<Record<string, TopperEntity[]>>(
      (acc, entity) => {
        const g = entity.grade
        if (!acc[g]) acc[g] = []
        acc[g]!.push(entity)
        return acc
      },
      {},
    )
  }
}