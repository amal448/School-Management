// src/infrastructure/database/schemas/teacher.schema.ts
import mongoose, { Schema, Document, Types } from 'mongoose'
import { Gender, TeacherLevel } from 'src/domain/enums'

export interface ITeacherDocument extends Document {
  email: string
  passwordHash?: string
  firstName: string
  lastName: string
  dob?: string
  gender?: Gender
  phone: string
  address?: string
  hireDate?: string
  qualification?: string
  designation?: string
  deptId?: Types.ObjectId | string // Changed to ObjectId for better joining
  subjectIds: (Types.ObjectId | string)[] // New Field: Array of Subject references
  level: TeacherLevel // New Field: Restricted categories
  isActive: boolean
  isVerified: boolean
  isFirstTime: boolean
  lastLogin?: Date
  createdBy: Types.ObjectId | string
  createdAt: Date
  updatedAt: Date
}

const TeacherSchema = new Schema<ITeacherDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, default: null },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: String, default: null },
    gender: { type: String, enum: Object.values(Gender), default: null },
    phone: { type: String, required: true },
    address: { type: String, default: null },
    hireDate: { type: String, default: null },
    qualification: { type: String, default: null },
    designation: { type: String, default: null },
    deptId: { type: Schema.Types.ObjectId, ref: 'Department', default: null, index: true },
    level: { type: String, enum: ['primary', 'middle', 'secondary', 'higher_secondary', 'all'], default: null, },
    subjectIds: { type: [String],default: []},
    isActive: { type: Boolean, default: true, index: true },
    isVerified: { type: Boolean, default: false },
    isFirstTime: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true, versionKey: false },
)

// ── Indexing ───────────────────────────────────────────
TeacherSchema.index({ firstName: 'text', lastName: 'text', email: 'text' })
// Composite index for common filtering (Finding active teachers in a specific level/dept)
TeacherSchema.index({ deptId: 1, level: 1, isActive: 1 })

export const TeacherModel = mongoose.model<ITeacherDocument>('Teacher', TeacherSchema)