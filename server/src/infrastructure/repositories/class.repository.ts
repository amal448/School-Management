import { FilterQuery } from 'mongoose'
import { IClassRepository } from 'src/application/ports/repositories/class.repository.interface'
import { ClassEntity } from 'src/domain/entities/class.entity'
import { ClassQueryDto } from 'src/domain/dtos/class.dto'
import { ClassModel, IClassDocument } from 'src/infrastructure/database/schemas/class.schema'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/shared/constants/index'
import { ClassDocumentMapper } from './mappers'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export class MongooseClassRepository implements IClassRepository {

  async save(cls: ClassEntity): Promise<ClassEntity> {
    const doc = await ClassModel.create(
      ClassDocumentMapper.toPersistence(cls)
    )
    return ClassDocumentMapper.toDomain(doc)
  }

  async update(id: string, cls: ClassEntity): Promise<ClassEntity | null> {
    const doc = await ClassModel.findByIdAndUpdate(
      id,
      { $set: ClassDocumentMapper.toPersistence(cls) },
      { new: true, runValidators: true },
    )
    return doc ? ClassDocumentMapper.toDomain(doc) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await ClassModel.findByIdAndDelete(id)
    return !!result
  }

  async findById(id: string): Promise<ClassEntity | null> {
    const doc = await ClassModel.findById(id).lean<IClassDocument>()
    return doc ? ClassDocumentMapper.toDomain(doc as IClassDocument) : null
  }

  async findAll(query: ClassQueryDto): Promise<PaginatedResult<ClassEntity>> {
    const page = query.page ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip = (page - 1) * limit

    const filter: FilterQuery<IClassDocument> = {}

    if (query.search) {
      const searchNumber = parseInt(query.search);
      filter.$or = [
        { section: { $regex: query.search, $options: 'i' } },
      ];
      if (!isNaN(searchNumber)) {
        filter.$or.push({ grade: searchNumber }); // Exact match for Number field
      }
    }

    const [docs, total] = await Promise.all([
      ClassModel.find(filter).sort({ grade: 1, section: 1 })
        .skip(skip).limit(limit).lean<IClassDocument[]>(),
      ClassModel.countDocuments(filter),
    ])

    return {
      data: (docs as IClassDocument[]).map(ClassDocumentMapper.toDomain),
      total, page, limit,
    }
  }

  async existsByNameSection(
    grade: string,
    section: string,
  ): Promise<boolean> {
    const count = await ClassModel.countDocuments({ grade, section })
    return count > 0
  }

}