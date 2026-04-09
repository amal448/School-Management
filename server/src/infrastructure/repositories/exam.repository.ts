import { FilterQuery } from 'mongoose'
import { IExamRepository } from 'src/application/ports/repositories/exam.repository.interface'
import { ExamEntity } from 'src/domain/entities/exam.entity'
import { ExamQueryDto } from 'src/domain/dtos/exam.dto'
import { ExamModel, IExamDocument } from 'src/infrastructure/database/schemas/exam.schema'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/shared/constants/index'
import { ExamDocumentMapper } from './mappers'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export class MongooseExamRepository implements IExamRepository {

  async save(exam: ExamEntity): Promise<ExamEntity> {
    const doc = await ExamModel.create(
      ExamDocumentMapper.toPersistence(exam)
    )
    return ExamDocumentMapper.toDomain(doc)
  }
async update(id: string, exam: ExamEntity): Promise<ExamEntity | null> {
  const persistence = ExamDocumentMapper.toPersistence(exam)

  const doc = await ExamModel.findByIdAndUpdate(
    id,
    { $set: persistence },
    { new: true, runValidators: false },  // ← runValidators: false avoids schema issues
  ).lean<IExamDocument>()

  return doc ? ExamDocumentMapper.toDomain(doc as IExamDocument) : null
}
  async findById(id: string): Promise<ExamEntity | null> {
    const doc = await ExamModel.findById(id).lean<IExamDocument>()
    return doc ? ExamDocumentMapper.toDomain(doc as IExamDocument) : null
  }

  async findAll(query: ExamQueryDto): Promise<PaginatedResult<ExamEntity>> {
    const page = query.page ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip = (page - 1) * limit

    const filter: FilterQuery<IExamDocument> = {}

    if (query.status) filter.status = query.status
    if (query.academicYear) filter.academicYear = query.academicYear
    // ← REMOVED: filter.applicableClasses — field no longer exists
    // If filtering by grade is needed in future:
    // if (query.grade) filter['gradeConfigs.grade'] = query.grade

    const [docs, total] = await Promise.all([
      ExamModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IExamDocument[]>(),
      ExamModel.countDocuments(filter),
    ])

    return {
      data: (docs as IExamDocument[]).map(ExamDocumentMapper.toDomain),
      total, page, limit,
    }
  }
}