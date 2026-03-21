import { FilterQuery }           from 'mongoose'
import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import { DepartmentEntity }      from 'src/domain/entities/department.entity'
import { DepartmentQueryDto }    from 'src/domain/dtos/department.dto'
import { DepartmentModel, IDepartmentDocument } from 'src/infrastructure/database/schemas/department.schema'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/shared/constants/index'
import { DepartmentDocumentMapper } from './mappers'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export class MongooseDepartmentRepository implements IDepartmentRepository {

  async save(dept: DepartmentEntity): Promise<DepartmentEntity> {
    const doc = await DepartmentModel.create(
      DepartmentDocumentMapper.toPersistence(dept)
    )
    return DepartmentDocumentMapper.toDomain(doc)
  }

  async update(id: string, dept: DepartmentEntity): Promise<DepartmentEntity | null> {
    const doc = await DepartmentModel.findByIdAndUpdate(
      id,
      { $set: DepartmentDocumentMapper.toPersistence(dept) },
      { new: true, runValidators: true },
    )
    return doc ? DepartmentDocumentMapper.toDomain(doc) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await DepartmentModel.findByIdAndDelete(id)
    return !!result
  }

  async findById(id: string): Promise<DepartmentEntity | null> {
    const doc = await DepartmentModel.findById(id).lean<IDepartmentDocument>()
    return doc ? DepartmentDocumentMapper.toDomain(doc as IDepartmentDocument) : null
  }

  async findAll(query: DepartmentQueryDto): Promise<PaginatedResult<DepartmentEntity>> {
    const page  = query.page  ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip  = (page - 1) * limit

    const filter: FilterQuery<IDepartmentDocument> = {}
    if (query.search) {
      filter.deptName = { $regex: query.search, $options: 'i' }
    }

    const [docs, total] = await Promise.all([
      DepartmentModel.find(filter).skip(skip).limit(limit)
        .lean<IDepartmentDocument[]>(),
      DepartmentModel.countDocuments(filter),
    ])

    return {
      data:  (docs as IDepartmentDocument[]).map(DepartmentDocumentMapper.toDomain),
      total, page, limit,
    }
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await DepartmentModel.countDocuments({
      deptName: { $regex: `^${name}$`, $options: 'i' },
    })
    return count > 0
  }
}