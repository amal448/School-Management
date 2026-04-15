import { IMarksRepository } from 'src/application/ports/repositories/marks.repository.interface'
import { MarksEntity } from 'src/domain/entities/marks.entity'
import {
  MarksModel,
  IMarksDocument,
} from 'src/infrastructure/database/schemas/marks.schema'
import { MarksDocumentMapper } from './mappers'

export class MongooseMarksRepository implements IMarksRepository {

  async saveMany(marks: MarksEntity[]): Promise<void> {
    const docs = marks.map(MarksDocumentMapper.toPersistence)
    await MarksModel.insertMany(docs, { ordered: false })
  }

  async findByScheduleId(scheduleId: string): Promise<MarksEntity[]> {
    const docs = await MarksModel
      .find({ scheduleId })
      .sort({ marksScored: -1 })
      .lean<IMarksDocument[]>()
    return (docs as IMarksDocument[]).map(MarksDocumentMapper.toDomain)
  }

  // async findByStudentAndExam(
  //   studentId: string,
  //   examId: string,
  // ): Promise<MarksEntity[]> {
  //   const docs = await MarksModel
  //     .find({ studentId, examId })
  //     .lean<IMarksDocument[]>()
  //   return (docs as IMarksDocument[]).map(MarksDocumentMapper.toDomain)
  // }

  async findByClassAndExam(
    classId: string,
    examId: string,
  ): Promise<MarksEntity[]> {
    const docs = await MarksModel
      .find({ classId, examId })
      .sort({ marksScored: -1 })
      .lean<IMarksDocument[]>()
    return (docs as IMarksDocument[]).map(MarksDocumentMapper.toDomain)
  }

  async existsBySchedule(scheduleId: string): Promise<boolean> {
    const count = await MarksModel.countDocuments({ scheduleId })
    return count > 0
  }

  async findByStudentId(studentId: string): Promise<MarksEntity[]> {
    const docs = await MarksModel
      .find({ studentId })
      .sort({ createdAt: -1 })
      .lean<IMarksDocument[]>()
    return (docs as IMarksDocument[]).map(MarksDocumentMapper.toDomain)
  }

}