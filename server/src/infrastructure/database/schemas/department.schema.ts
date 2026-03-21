import mongoose, { Schema, Document } from 'mongoose'

export interface IDepartmentDocument extends Document {
  deptName:    string
  deptHeadId?: string
  description?: string
  createdAt:   Date
  updatedAt:   Date
}

const DepartmentSchema = new Schema<IDepartmentDocument>(
  {
    deptName:    { type: String, required: true, unique: true, trim: true, index: true },
    deptHeadId:  { type: String, default: null },
    description: { type: String, default: null },
  },
  { timestamps: true, versionKey: false },
)

export const DepartmentModel = mongoose.model<IDepartmentDocument>(
  'Department', DepartmentSchema
)