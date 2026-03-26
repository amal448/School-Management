import { IExamTimetableRepository }  from 'src/application/ports/repositories/exam-timetable.repository.interface'
import { ExamTimetableEntity }       from 'src/domain/entities/exam-timetable.entity'
import {
  ExamTimetableModel,
  IExamTimetableDocument,
} from 'src/infrastructure/database/schemas/exam-timetable.schema'
import { ExamTimetableDocumentMapper } from './mappers'

export class MongooseExamTimetableRepository
  implements IExamTimetableRepository {

  async save(entry: ExamTimetableEntity): Promise<ExamTimetableEntity> {
    const doc = await ExamTimetableModel.create(
      ExamTimetableDocumentMapper.toPersistence(entry)
    )
    return ExamTimetableDocumentMapper.toDomain(doc)
  }

  async update(
    id:    string,
    entry: ExamTimetableEntity,
  ): Promise<ExamTimetableEntity | null> {
    const doc = await ExamTimetableModel.findByIdAndUpdate(
      id,
      { $set: ExamTimetableDocumentMapper.toPersistence(entry) },
      { new: true, runValidators: true },
    )
    return doc ? ExamTimetableDocumentMapper.toDomain(doc) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await ExamTimetableModel.findByIdAndDelete(id)
    return !!result
  }

  async findById(id: string): Promise<ExamTimetableEntity | null> {
    const doc = await ExamTimetableModel
      .findById(id)
      .lean<IExamTimetableDocument>()
    return doc
      ? ExamTimetableDocumentMapper.toDomain(doc as IExamTimetableDocument)
      : null
  }

  async findByExamId(examId: string): Promise<ExamTimetableEntity[]> {
    const docs = await ExamTimetableModel
      .find({ examId })
      .sort({ examDate: 1 })
      .lean<IExamTimetableDocument[]>()
    return (docs as IExamTimetableDocument[])
      .map(ExamTimetableDocumentMapper.toDomain)
  }

  async existsByExamAndSubject(
    examId:    string,
    subjectId: string,
  ): Promise<boolean> {
    const count = await ExamTimetableModel.countDocuments({ examId, subjectId })
    return count > 0
  }
}