import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ISubjectAllocationDocument {
  subjectId: Types.ObjectId
  subject?: any
  teacherId?: Types.ObjectId
  teacher?: any
}

export interface IClassDocument extends Document {
  grade:          string
  section:            string
  classTeacherId?:    Types.ObjectId
  classTeacher?:      any
  subjectAllocations: ISubjectAllocationDocument[]
  createdAt:          Date
  updatedAt:          Date
}

const SubjectAllocationSchema = new Schema<ISubjectAllocationDocument>(
  {
    subjectId: { type: Schema.Types.ObjectId, required: true },
    teacherId: { type: Schema.Types.ObjectId, default: null },  // ← required: true → default: null
  },
  { _id: false },
)

const ClassSchema = new Schema<IClassDocument>(
  {
    grade:          { type: String, required: true, trim: true },
    section:            { type: String, required: true, trim: true },
    
    classTeacherId:     { type: Schema.Types.ObjectId, default: null },
    subjectAllocations: { type: [SubjectAllocationSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
)

// Unique: same class name + section + year
ClassSchema.index(
  { grade: 1, section: 1},
  { unique: true },
)

export const ClassModel = mongoose.model<IClassDocument>(
  'Class', ClassSchema
)