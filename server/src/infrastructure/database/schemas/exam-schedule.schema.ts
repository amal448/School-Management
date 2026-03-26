import mongoose, { Schema, Document } from 'mongoose'
import { MarksStatus } from 'src/domain/enums'

export interface IExamScheduleDocument extends Document {
  examId:       string
  timetableId:  string
  classId:      string
  subjectId:    string
  teacherId:    string
  marksStatus:  MarksStatus
  submittedAt?: Date
  createdAt:    Date
  updatedAt:    Date
}

const ExamScheduleSchema = new Schema<IExamScheduleDocument>(
  {
    examId:      { type: String, required: true, index: true },
    timetableId: { type: String, required: true },
    classId:     { type: String, required: true, index: true },
    subjectId:   { type: String, required: true },
    teacherId:   { type: String, required: true, index: true },
    marksStatus: {
      type:    String,
      enum:    Object.values(MarksStatus),
      default: MarksStatus.PENDING,
      index:   true,
    },
    submittedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
)

// One schedule per class per subject per exam
ExamScheduleSchema.index(
  { examId: 1, classId: 1, subjectId: 1 },
  { unique: true },
)

export const ExamScheduleModel = mongoose.model<IExamScheduleDocument>(
  'ExamSchedule', ExamScheduleSchema
)