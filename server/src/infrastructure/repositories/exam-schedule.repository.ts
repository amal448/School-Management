import { IExamScheduleRepository } from 'src/application/ports/repositories/exam-schedule.repository.interface'
import { ExamScheduleEntity } from 'src/domain/entities/exam-schedule.entity'
import { MarksStatus } from 'src/domain/enums'
import {
  ExamScheduleModel,
  IExamScheduleDocument,
} from 'src/infrastructure/database/schemas/exam-schedule.schema'
import { ExamScheduleDocumentMapper } from './mappers'

export class MongooseExamScheduleRepository
  implements IExamScheduleRepository {

  async save(schedule: ExamScheduleEntity): Promise<ExamScheduleEntity> {
    const doc = await ExamScheduleModel.create(
      ExamScheduleDocumentMapper.toPersistence(schedule)
    )
    return ExamScheduleDocumentMapper.toDomain(doc)
  }

  async saveMany(schedules: ExamScheduleEntity[]): Promise<void> {
    const docs = schedules.map(
      ExamScheduleDocumentMapper.toPersistence
    )
    await ExamScheduleModel.insertMany(docs, { ordered: false })
  }

  async update(
    id: string,
    schedule: ExamScheduleEntity,
  ): Promise<ExamScheduleEntity | null> {
    const doc = await ExamScheduleModel.findByIdAndUpdate(
      id,
      { $set: ExamScheduleDocumentMapper.toPersistence(schedule) },
      { new: true },
    )
    return doc ? ExamScheduleDocumentMapper.toDomain(doc) : null
  }

  async findById(id: string): Promise<ExamScheduleEntity | null> {
    const doc = await ExamScheduleModel
      .findById(id)
      .lean<IExamScheduleDocument>()
    return doc
      ? ExamScheduleDocumentMapper.toDomain(doc as IExamScheduleDocument)
      : null
  }

  async findByExamId(examId: string): Promise<ExamScheduleEntity[]> {
    const docs = await ExamScheduleModel
      .find({ examId })
      .lean<IExamScheduleDocument[]>()
    return (docs as IExamScheduleDocument[])
      .map(ExamScheduleDocumentMapper.toDomain)
  }

  async findByTeacherId(teacherId: string): Promise<ExamScheduleEntity[]> {
    const docs = await ExamScheduleModel
      .find({ teacherId })
      .sort({ createdAt: -1 })
      .lean<IExamScheduleDocument[]>()
    return (docs as IExamScheduleDocument[])
      .map(ExamScheduleDocumentMapper.toDomain)
  }
  async findByTeacherAndClass(
    teacherId: string,
    classId: string,
  ): Promise<ExamScheduleEntity[]> {
    const docs = await ExamScheduleModel
      .find({ teacherId, classId })
      .sort({ examDate: 1 })
      .lean<IExamScheduleDocument[]>()
    return (docs as IExamScheduleDocument[])
      .map(ExamScheduleDocumentMapper.toDomain)
  }

  async findByTeacherIdAndStatuses(teacherId: string,
    statuses: MarksStatus[],
  ): Promise<ExamScheduleEntity[]> {
    const docs = await ExamScheduleModel
      .find({ teacherId, marksStatus: { $in: statuses } })
      .sort({ examDate: -1 })
      .lean<IExamScheduleDocument[]>()
    return (docs as IExamScheduleDocument[])
      .map(ExamScheduleDocumentMapper.toDomain)
  }
  async findByExamAndClass(
    examId: string,
    classId: string,
  ): Promise<ExamScheduleEntity[]> {
    const docs = await ExamScheduleModel
      .find({ examId, classId })
      .lean<IExamScheduleDocument[]>()
    return (docs as IExamScheduleDocument[])
      .map(ExamScheduleDocumentMapper.toDomain)
  }

  // Returns true only when every schedule for this exam is submitted or locked
  async allSubmitted(examId: string): Promise<boolean> {
    const pendingCount = await ExamScheduleModel.countDocuments({
      examId,
      marksStatus: MarksStatus.PENDING,
    })
    return pendingCount === 0
  }
}