
import { FilterQuery } from 'mongoose';
import { TeacherEntity } from '../../domain/entities/teacher.entity';
import { TeacherModel, ITeacherDocument } from '../database/schemas/teacher.schema';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../shared/constants/index';
import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface';
import { TeacherDocumentMapper } from './mappers';
import { TeacherQueryDto } from 'src/domain/dtos/teacher.dto';
import { PaginatedResult } from 'src/shared/types/Pagination-type';


// ── Teacher Repository ─────────────────────────────────
export class MongooseTeacherRepository implements ITeacherRepository {
  async save(teacher: TeacherEntity): Promise<TeacherEntity> {
    const doc = await TeacherModel.create(TeacherDocumentMapper.toPersistence(teacher));
    return TeacherDocumentMapper.toDomain(doc);
  }

  async update(id: string, teacher: TeacherEntity): Promise<TeacherEntity | null> {
    const doc = await TeacherModel.findByIdAndUpdate(
      id,
      { $set: TeacherDocumentMapper.toPersistence(teacher) },
      { new: true, runValidators: true },
    );
    return doc ? TeacherDocumentMapper.toDomain(doc) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const doc = await TeacherModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
    return !!doc;
  }

  async findById(id: string): Promise<TeacherEntity | null> {
    const doc = await TeacherModel.findById(id).lean<ITeacherDocument>();
    return doc ? TeacherDocumentMapper.toDomain(doc as ITeacherDocument) : null;
  }

  async findByEmail(email: string): Promise<TeacherEntity | null> {
    const doc = await TeacherModel.findOne({ email: email.toLowerCase() }).lean<ITeacherDocument>();
    return doc ? TeacherDocumentMapper.toDomain(doc as ITeacherDocument) : null;
  }

  async findAll(query: TeacherQueryDto): Promise<PaginatedResult<TeacherEntity>> {
    const page  = query.page  ?? DEFAULT_PAGE;
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100);
    const skip  = (page - 1) * limit;

    const filter: FilterQuery<ITeacherDocument> = {};
    if (query.deptId)              filter.deptId   = query.deptId;
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName:  { $regex: query.search, $options: 'i' } },
        { email:     { $regex: query.search, $options: 'i' } },
      ];
    }

    const [docs, total] = await Promise.all([
      TeacherModel.find(filter).skip(skip).limit(limit).lean<ITeacherDocument[]>(),
      TeacherModel.countDocuments(filter),
    ]);

    return {
      data: (docs as ITeacherDocument[]).map(TeacherDocumentMapper.toDomain),
      total, page, limit,
    };
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await TeacherModel.countDocuments({ email: email.toLowerCase() })) > 0;
  }

  async countByDept(deptId: string): Promise<number> {
    return TeacherModel.countDocuments({ deptId, isActive: true });
  }
}
