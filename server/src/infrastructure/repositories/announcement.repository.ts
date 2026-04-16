import { FilterQuery }               from 'mongoose'
import { IAnnouncementRepository } from 'src/application/ports/repositories/announcement.repository.interface'
import { PaginatedResult }           from 'src/application/ports/repositories/base.repository.interface'
import { AnnouncementEntity } from 'src/domain/entities/announcement.entity'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/shared/constants'
import { AnnouncementModel, IAnnouncementDocument } from '../database/schemas/announcement.schema'
import { AnnouncementDocumentMapper } from './mappers'
import { AnnouncementQueryDto } from 'src/domain/dtos/announcement.dto'

export class MongooseAnnouncementRepository
  implements IAnnouncementRepository {

  async save(entity: AnnouncementEntity): Promise<AnnouncementEntity> {
    const doc = await AnnouncementModel.create(
      AnnouncementDocumentMapper.toPersistence(entity)
    )
    return AnnouncementDocumentMapper.toDomain(doc)
  }

  async findById(id: string): Promise<AnnouncementEntity | null> {
    const doc = await AnnouncementModel
      .findById(id)
      .lean<IAnnouncementDocument>()
    return doc
      ? AnnouncementDocumentMapper.toDomain(doc as IAnnouncementDocument)
      : null
  }

  async findAll(
    query: AnnouncementQueryDto,
  ): Promise<PaginatedResult<AnnouncementEntity>> {
    const page  = query.page  ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip  = (page - 1) * limit

    const filter: FilterQuery<IAnnouncementDocument> = {}
    if (query.category)               filter.category    = query.category
    if (query.isPublished !== undefined) filter.isPublished = query.isPublished
    if (query.isPinned    !== undefined) filter.isPinned    = query.isPinned
    if (query.search) {
      filter.$or = [
        { title:   { $regex: query.search, $options: 'i' } },
        { content: { $regex: query.search, $options: 'i' } },
      ]
    }

    const [docs, total] = await Promise.all([
      AnnouncementModel.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IAnnouncementDocument[]>(),
      AnnouncementModel.countDocuments(filter),
    ])

    return {
      data:       (docs as IAnnouncementDocument[]).map(
        AnnouncementDocumentMapper.toDomain
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async update(
    id:     string,
    entity: AnnouncementEntity,
  ): Promise<AnnouncementEntity | null> {
    const doc = await AnnouncementModel.findByIdAndUpdate(
      id,
      { $set: AnnouncementDocumentMapper.toPersistence(entity) },
      { new: true, runValidators: false },
    ).lean<IAnnouncementDocument>()
    return doc
      ? AnnouncementDocumentMapper.toDomain(doc as IAnnouncementDocument)
      : null
  }

  async delete(id: string): Promise<void> {
    await AnnouncementModel.findByIdAndDelete(id)
  }

  async existsById(id: string): Promise<boolean> {
    return (await AnnouncementModel.countDocuments({ _id: id })) > 0
  }

  async findPublished(): Promise<AnnouncementEntity[]> {
    const docs = await AnnouncementModel
      .find({ isPublished: true })
      .sort({ isPinned: -1, createdAt: -1 })
      .lean<IAnnouncementDocument[]>()
    return (docs as IAnnouncementDocument[]).map(
      AnnouncementDocumentMapper.toDomain
    )
  }
}