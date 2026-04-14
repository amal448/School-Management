// src/infrastructure/repositories/teacher.repository.ts

import { FilterQuery }            from 'mongoose'
import { ITeacherRepository, TeacherQueryDto } from 'src/application/ports/repositories/teacher.repository.interface'
import { PaginatedResult }        from 'src/application/ports/repositories/base.repository.interface'
import { TeacherEntity }          from 'src/domain/entities/teacher.entity'
import { TeacherModel, ITeacherDocument } from 'src/infrastructure/database/schemas/teacher.schema'
import { TeacherDocumentMapper }  from './mappers'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/shared/constants'

export class MongooseTeacherRepository implements ITeacherRepository {

  async save(entity: TeacherEntity): Promise<TeacherEntity> {
    const doc = await TeacherModel.create(
      TeacherDocumentMapper.toPersistence(entity)
    )
    return TeacherDocumentMapper.toDomain(doc)
  }

  async findById(id: string): Promise<TeacherEntity | null> {
    const doc = await TeacherModel.findById(id).lean<ITeacherDocument>()
    return doc ? TeacherDocumentMapper.toDomain(doc as ITeacherDocument) : null
  }

  async findAll(query: TeacherQueryDto): Promise<PaginatedResult<TeacherEntity>> {
    const page  = query.page  ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip  = (page - 1) * limit

    const filter: FilterQuery<ITeacherDocument> = {}
    if (query.isActive !== undefined) filter.isActive = query.isActive
    if (query.deptId)                 filter.deptId   = query.deptId
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName:  { $regex: query.search, $options: 'i' } },
        { email:     { $regex: query.search, $options: 'i' } },
      ]
    }

    const [docs, total] = await Promise.all([
      TeacherModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<ITeacherDocument[]>(),
      TeacherModel.countDocuments(filter),
    ])

    return {
      data:       (docs as ITeacherDocument[]).map(TeacherDocumentMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),   // ← was missing
    }
  }

  async update(
    id:     string,
    entity: TeacherEntity,
  ): Promise<TeacherEntity | null> {
    const doc = await TeacherModel.findByIdAndUpdate(
      id,
      { $set: TeacherDocumentMapper.toPersistence(entity) },
      { new: true },
    ).lean<ITeacherDocument>()
    return doc ? TeacherDocumentMapper.toDomain(doc as ITeacherDocument) : null
  }

  // ← Add these two methods from IBaseRepository
  async delete(id: string): Promise<void> {
    await TeacherModel.findByIdAndDelete(id)
  }

  async existsById(id: string): Promise<boolean> {
    const count = await TeacherModel.countDocuments({ _id: id })
    return count > 0
  }

  // ── Teacher-specific ──────────────────────────────────
  async existsByEmail(email: string): Promise<boolean> {
    const count = await TeacherModel.countDocuments({ email })
    return count > 0
  }

  async findByEmail(email: string): Promise<TeacherEntity | null> {
    const doc = await TeacherModel
      .findOne({ email })
      .lean<ITeacherDocument>()
    return doc ? TeacherDocumentMapper.toDomain(doc as ITeacherDocument) : null
  }

  async findByDeptAndSubject(
    deptId:    string,
    subjectId: string,
  ): Promise<TeacherEntity[]> {
    const docs = await TeacherModel
      .find({ deptId, subjectIds: subjectId, isActive: true })
      .lean<ITeacherDocument[]>()
    return (docs as ITeacherDocument[]).map(TeacherDocumentMapper.toDomain)
  }

  async findByLevel(level: string): Promise<TeacherEntity[]> {
    const docs = await TeacherModel
      .find({
        $or:      [{ level }, { level: 'all' }],
        isActive: true,
      })
      .sort({ firstName: 1 })
      .lean<ITeacherDocument[]>()
    return (docs as ITeacherDocument[]).map(TeacherDocumentMapper.toDomain)
  }

  async findByIds(ids: string[]): Promise<TeacherEntity[]> {
    if (!ids.length) return []
    const docs = await TeacherModel
      .find({ _id: { $in: ids } })
      .lean<ITeacherDocument[]>()
    return (docs as ITeacherDocument[]).map(TeacherDocumentMapper.toDomain)
  }

  async findAllWithDept(query: TeacherQueryDto): Promise<any> {
    const page  = query.page  ?? DEFAULT_PAGE
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100)
    const skip  = (page - 1) * limit

    const filter: FilterQuery<ITeacherDocument> = {}
    if (query.isActive !== undefined) filter.isActive = query.isActive
    if (query.deptId)                 filter.deptId   = query.deptId
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName:  { $regex: query.search, $options: 'i' } },
        { email:     { $regex: query.search, $options: 'i' } },
      ]
    }

    const [docs, total] = await Promise.all([
      TeacherModel.aggregate([
        { $match: filter },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from:     'departments',
            let:      { deptId: { $toObjectId: '$deptId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$deptId'] } } },
              { $project: { deptName: 1 } },
            ],
            as: 'department',
          },
        },
        {
          $addFields: {
            deptName: { $arrayElemAt: ['$department.deptName', 0] },
          },
        },
        { $project: { department: 0 } },
      ]),
      TeacherModel.countDocuments(filter),
    ])

    return {
      data: docs.map((doc: any) => ({
        entity:   TeacherDocumentMapper.toDomain({ ...doc, _id: doc._id }),
        deptName: doc.deptName ?? null,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}