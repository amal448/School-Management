import mongoose, { Schema, Document } from 'mongoose'

export interface IExamTimetableDocument extends Document {
  examId:       string
  subjectId:    string
  examDate:     Date
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
  createdAt:    Date
  updatedAt:    Date
}

const ExamTimetableSchema = new Schema<IExamTimetableDocument>(
  {
    examId:       { type: String, required: true, index: true },
    subjectId:    { type: String, required: true },
    examDate:     { type: Date,   required: true },
    startTime:    { type: String, required: true },
    endTime:      { type: String, required: true },
    totalMarks:   { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 35  },
  },
  { timestamps: true, versionKey: false },
)

// One subject can appear once per exam
ExamTimetableSchema.index(
  { examId: 1, subjectId: 1 },
  { unique: true },
)

export const ExamTimetableModel = mongoose.model<IExamTimetableDocument>(
  'ExamTimetable', ExamTimetableSchema
)