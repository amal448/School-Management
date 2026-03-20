import { FilterQuery }         from 'mongoose'
import { IManagerRepository } from 'src/application/ports/repositories/manager.repository.interface'
import { ManagerEntity }       from 'src/domain/entities/manager.entity'
import { ManagerModel, IManagerDocument } from 'src/infrastructure/database/schemas/manager.schema'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/shared/constants/index'
import { ManagerDocumentMapper } from './mappers'
import { ManagerQueryDto } from 'src/domain/dtos/manager.dto'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export class MongooseManagerRepository implements IManagerRepository {

  // ── Write ────────────────────────────────────────────

  async save(manager: ManagerEntity): Promise<ManagerEntity> {
    const doc = await ManagerModel.create(
      ManagerDocumentMapper.toPersistence(manager)
    )
    return ManagerDocumentMapper.toDomain(doc)
  }

  async update(id: string, manager: ManagerEntity): Promise<ManagerEntity | null> {
    const doc = await ManagerModel.findByIdAndUpdate(
      id,
      { $set: ManagerDocumentMapper.toPersistence(manager) },
      { new: true, runValidators: true },
    )
    return doc ? ManagerDocumentMapper.toDomain(doc) : null
  }

  async softDelete(id: string): Promise<boolean> {
    const doc = await ManagerModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    )
    return !!doc
  }

  // ── Read ─────────────────────────────────────────────

  async findById(id: string): Promise<ManagerEntity | null> {
    const doc = await ManagerModel.findById(id).lean<IManagerDocument>()
    return doc ? ManagerDocumentMapper.toDomain(doc as IManagerDocument) : null
  }

  async findByEmail(email: string): Promise<ManagerEntity | null> {
    const doc = await ManagerModel
      .findOne({ email: email.toLowerCase() })
      .lean<IManagerDocument>()
    return doc ? ManagerDocumentMapper.toDomain(doc as IManagerDocument) : null
  }

  async findByGoogleId(googleId: string): Promise<ManagerEntity | null> {
    const doc = await ManagerModel
      .findOne({ googleId })
      .lean<IManagerDocument>()
    return doc ? ManagerDocumentMapper.toDomain(doc as IManagerDocument) : null
  }

  async findAll(query: ManagerQueryDto): Promise<PaginatedResult<ManagerEntity>> {
    const page  = query.page  ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip  = (page - 1) * limit

    const filter: FilterQuery<IManagerDocument> = {}

    if (query.isActive  !== undefined) filter.isActive  = query.isActive
    if (query.isBlocked !== undefined) filter.isBlocked = query.isBlocked

    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName:  { $regex: query.search, $options: 'i' } },
        { email:     { $regex: query.search, $options: 'i' } },
      ]
    }

    const [docs, total] = await Promise.all([
      ManagerModel.find(filter).skip(skip).limit(limit).lean<IManagerDocument[]>(),
      ManagerModel.countDocuments(filter),
    ])

    return {
      data:  (docs as IManagerDocument[]).map(ManagerDocumentMapper.toDomain),
      total,
      page,
      limit,
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await ManagerModel.countDocuments({
      email: email.toLowerCase(),
    })
    return count > 0
  }
}