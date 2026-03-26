import mongoose, { Schema, Document } from 'mongoose'

export interface IMarksDocument extends Document {
  examId:      string
  scheduleId:  string
  studentId:   string
  subjectId:   string
  classId:     string
  marksScored: number
  totalMarks:  number
  grade:       string
  isAbsent:    boolean
  gradedBy:    string
  gradedAt:    Date
  createdAt:   Date
  updatedAt:   Date
}

const MarksSchema = new Schema<IMarksDocument>(
  {
    examId:      { type: String, required: true, index: true },
    scheduleId:  { type: String, required: true, index: true },
    studentId:   { type: String, required: true, index: true },
    subjectId:   { type: String, required: true },
    classId:     { type: String, required: true, index: true },
    marksScored: { type: Number, required: true, min: 0 },
    totalMarks:  { type: Number, required: true },
    grade:       { type: String, required: true },
    isAbsent:    { type: Boolean, default: false },
    gradedBy:    { type: String, required: true },
    gradedAt:    { type: Date,   required: true },
  },
  { timestamps: true, versionKey: false },
)

// One mark entry per student per schedule
MarksSchema.index(
  { scheduleId: 1, studentId: 1 },
  { unique: true },
)

export const MarksModel = mongoose.model<IMarksDocument>('Marks', MarksSchema)