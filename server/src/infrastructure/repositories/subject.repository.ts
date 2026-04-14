import { FilterQuery } from 'mongoose'
import { ISubjectRepository } from 'src/application/ports/repositories/subject.repository.interface'
import { SubjectEntity } from 'src/domain/entities/subject.entity'
import { SubjectQueryDto } from 'src/domain/dtos/subject.dto'
import { SubjectModel, ISubjectDocument } from 'src/infrastructure/database/schemas/subject.schema'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/shared/constants/index'
import { SubjectDocumentMapper } from './mappers'
import { PaginatedResult } from 'src/application/ports/repositories/base.repository.interface'

export class MongooseSubjectRepository implements ISubjectRepository {

  async save(subject: SubjectEntity): Promise<SubjectEntity> {
    const doc = await SubjectModel.create(
      SubjectDocumentMapper.toPersistence(subject)
    )
    return SubjectDocumentMapper.toDomain(doc)
  }

  async update(id: string, subject: SubjectEntity): Promise<SubjectEntity | null> {
    const doc = await SubjectModel.findByIdAndUpdate(
      id,
      { $set: SubjectDocumentMapper.toPersistence(subject) },
      { new: true, runValidators: true },
    )
    return doc ? SubjectDocumentMapper.toDomain(doc) : null
  }

  async delete(id: string): Promise<void> {
    await SubjectModel.findByIdAndDelete(id)
  }

  async existsById(id: string): Promise<boolean> {
    return (await SubjectModel.countDocuments({ _id: id })) > 0
  }

  async findById(id: string): Promise<SubjectEntity | null> {
    const doc = await SubjectModel.findById(id).lean<ISubjectDocument>()
    return doc ? SubjectDocumentMapper.toDomain(doc as ISubjectDocument) : null
  }

  async findAll(query: SubjectQueryDto): Promise<PaginatedResult<SubjectEntity>> {
    const page = query.page ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip = (page - 1) * limit

    const filter: FilterQuery<ISubjectDocument> = {}
    if (query.deptId) filter.deptId = query.deptId
    if (query.search) {
      filter.subjectName = { $regex: query.search, $options: 'i' }
    }

    const [docs, total] = await Promise.all([
      SubjectModel.find(filter).skip(skip).limit(limit)
        .lean<ISubjectDocument[]>(),
      SubjectModel.countDocuments(filter),
    ])

    return {
      data: (docs as ISubjectDocument[]).map(SubjectDocumentMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findByDeptId(deptId: string): Promise<SubjectEntity[]> {
    const docs = await SubjectModel.find({ deptId }).lean<ISubjectDocument[]>()
    return (docs as ISubjectDocument[]).map(SubjectDocumentMapper.toDomain)
  }

  async existsByNameInDept(name: string, deptId: string): Promise<boolean> {
    const count = await SubjectModel.countDocuments({
      subjectName: { $regex: `^${name}$`, $options: 'i' },
      deptId,
    })
    return count > 0
  }
}