import mongoose, { Schema, Document } from 'mongoose'

export interface ISubjectAllocationDocument {
  subjectId: string
  teacherId?: string
}

export interface IClassDocument extends Document {
  grade:          string
  section:            string
 
  classTeacherId?:    string
  subjectAllocations: ISubjectAllocationDocument[]
  createdAt:          Date
  updatedAt:          Date
}

const SubjectAllocationSchema = new Schema<ISubjectAllocationDocument>(
  {
    subjectId: { type: String, required: true },
    teacherId: { type: String, default: null },  // ← required: true → default: null
  },
  { _id: false },
)

const ClassSchema = new Schema<IClassDocument>(
  {
    grade:          { type: String, required: true, trim: true },
    section:            { type: String, required: true, trim: true },
    
    classTeacherId:     { type: String, default: null },
    subjectAllocations: { type: [SubjectAllocationSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
)

// Unique: same class name + section + year
ClassSchema.index(
  { className: 1, section: 1, academicYear: 1 },
  { unique: true },
)

export const ClassModel = mongoose.model<IClassDocument>(
  'Class', ClassSchema
)