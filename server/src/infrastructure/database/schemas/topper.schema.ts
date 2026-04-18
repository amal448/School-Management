import { Schema, model, Document } from 'mongoose'

export interface ITopperDocument extends Document {
  name: string
  grade: string
  department?: string
  marks: number
  totalMarks: number
  photoUrl?: string
  academicYear: string
  rank?: number
  isPublished: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

const TopperSchema = new Schema<ITopperDocument>(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: String, required: true },
    department: { type: String, default: null },
    marks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    photoUrl: { type: String, default: null },
    academicYear: { type: String, required: true },
    rank: { type: Number, default: null },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
)

TopperSchema.index({ grade: 1, academicYear: 1, rank: 1 })
TopperSchema.index({ isPublished: 1, grade: 1 })

export const TopperModel = model<ITopperDocument>('Topper', TopperSchema)