import mongoose, { Schema, Document } from 'mongoose'
import { ExamType, ExamStatus } from 'src/domain/enums'

export interface IExamDocument extends Document {
  examName:          string
  examType:          ExamType
  academicYear:      string
  startDate:         Date
  endDate:           Date
  applicableClasses: string[]
  status:            ExamStatus
  createdBy:         string
  createdAt:         Date
  updatedAt:         Date
}

const ExamSchema = new Schema<IExamDocument>(
  {
    examName:          { type: String, required: true, trim: true },
    examType:          {
      type: String,
      enum: Object.values(ExamType),
      required: true,
    },
    academicYear:      { type: String, required: true, trim: true },
    startDate:         { type: Date, required: true },
    endDate:           { type: Date, required: true },
    applicableClasses: { type: [String], default: [] },
    status:            {
      type:    String,
      enum:    Object.values(ExamStatus),
      default: ExamStatus.DRAFT,
      index:   true,
    },
    createdBy:         { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
)

ExamSchema.index({ academicYear: 1, status: 1 })

export const ExamModel = mongoose.model<IExamDocument>('Exam', ExamSchema)