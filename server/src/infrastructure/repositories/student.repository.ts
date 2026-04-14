
import { FilterQuery } from 'mongoose';
import { StudentEntity } from '../../domain/entities/student.entity';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../shared/constants/index';
import { IStudentDocument, StudentModel } from '../database/schemas/student.schema';
import { StudentDocumentMapper } from './mappers';
import { StudentQueryDto } from 'src/domain/dtos/student.dto';
import { IStudentRepository } from 'src/application/ports/repositories/student.repository.interface';
import { PaginatedResult } from 'src/application/ports/repositories/base.repository.interface';


// ── Student Repository ─────────────────────────────────
export class MongooseStudentRepository implements IStudentRepository {
  async save(student: StudentEntity): Promise<StudentEntity> {
    const doc = await StudentModel.create(StudentDocumentMapper.toPersistence(student));
    return StudentDocumentMapper.toDomain(doc);
  }
  async delete(id: string): Promise<void> {
  await StudentModel.findByIdAndDelete(id)
}

async existsById(id: string): Promise<boolean> {
  return (await StudentModel.countDocuments({ _id: id })) > 0
}

  async update(id: string, student: StudentEntity): Promise<StudentEntity | null> {
    const doc = await StudentModel.findByIdAndUpdate(
      id,
      { $set: StudentDocumentMapper.toPersistence(student) },
      { new: true, runValidators: true },
    );
    return doc ? StudentDocumentMapper.toDomain(doc) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const doc = await StudentModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
    return !!doc;
  }

  async findById(id: string): Promise<StudentEntity | null> {
    const doc = await StudentModel.findById(id).lean<IStudentDocument>();
    return doc ? StudentDocumentMapper.toDomain(doc as IStudentDocument) : null;
  }

  async findByEmail(email: string): Promise<StudentEntity | null> {
    const doc = await StudentModel.findOne({ email: email.toLowerCase() }).lean<IStudentDocument>();
    return doc ? StudentDocumentMapper.toDomain(doc as IStudentDocument) : null;
  }

  async findAll(query: StudentQueryDto): Promise<PaginatedResult<StudentEntity>> {
    const page  = query.page  ?? DEFAULT_PAGE;
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, 100);
    const skip  = (page - 1) * limit;

    const filter: FilterQuery<IStudentDocument> = {};
    if (query.classId)             filter.classId  = query.classId;
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName:  { $regex: query.search, $options: 'i' } },
        { email:     { $regex: query.search, $options: 'i' } },
      ];
    }

    const [docs, total] = await Promise.all([
      StudentModel.find(filter).skip(skip).limit(limit).lean<IStudentDocument[]>(),
      StudentModel.countDocuments(filter),
    ]);

    return {
      data: (docs as IStudentDocument[]).map(StudentDocumentMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByClass(classId: string): Promise<StudentEntity[]> {
    const docs = await StudentModel.find({ classId, isActive: true }).lean<IStudentDocument[]>();
    return (docs as IStudentDocument[]).map(StudentDocumentMapper.toDomain);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await StudentModel.countDocuments({ email: email.toLowerCase() })) > 0;
  }
  // Add assignToClass method
async assignToClass(id: string, classId: string): Promise<StudentEntity | null> {
  const doc = await StudentModel.findByIdAndUpdate(
    id,
    { $set: { classId } },
    { new: true },
  )
  return doc ? StudentDocumentMapper.toDomain(doc) : null
}
}
