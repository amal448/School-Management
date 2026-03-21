import mongoose, { Schema, Document } from 'mongoose'

export interface ISubjectAllocationDocument {
  subjectId: string
  teacherId: string
}

export interface IClassDocument extends Document {
  className:          string
  section:            string
  academicYear:       string
  classTeacherId?:    string
  subjectAllocations: ISubjectAllocationDocument[]
  createdAt:          Date
  updatedAt:          Date
}

const SubjectAllocationSchema = new Schema<ISubjectAllocationDocument>(
  {
    subjectId: { type: String, required: true },
    teacherId: { type: String, required: true },
  },
  { _id: false },   // no extra _id on subdocuments
)

const ClassSchema = new Schema<IClassDocument>(
  {
    className:          { type: String, required: true, trim: true },
    section:            { type: String, required: true, trim: true },
    academicYear:       { type: String, required: true, trim: true },
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