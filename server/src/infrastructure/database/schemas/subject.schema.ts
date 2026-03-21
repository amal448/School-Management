import mongoose, { Schema, Document } from 'mongoose'

export interface ISubjectDocument extends Document {
  subjectName: string
  deptId:      string
  createdAt:   Date
  updatedAt:   Date
}

const SubjectSchema = new Schema<ISubjectDocument>(
  {
    subjectName: { type: String, required: true, trim: true },
    deptId:      { type: String, required: true, index: true },
  },
  { timestamps: true, versionKey: false },
)

// Unique: same subject name can't exist twice in the same department
SubjectSchema.index({ subjectName: 1, deptId: 1 }, { unique: true })

export const SubjectModel = mongoose.model<ISubjectDocument>(
  'Subject', SubjectSchema
)