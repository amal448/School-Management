// src/infrastructure/database/schemas/teacher.schema.ts
import mongoose, { Schema, Document } from 'mongoose'
import { Gender } from 'src/domain/enums'

export interface ITeacherDocument extends Document {
  email:          string
  passwordHash?:  string
  firstName:      string
  lastName:       string
  dob?:           string
  gender?:        Gender
  phone?:         string
  address?:       string
  hireDate?:      string
  qualification?: string
  designation?:   string
  deptId?:        string
  isActive:       boolean
  isVerified:     boolean
  isFirstTime:    boolean
  lastLogin?:     Date
  createdBy:      string
  createdAt:      Date
  updatedAt:      Date
}

const TeacherSchema = new Schema<ITeacherDocument>(
  {
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash:  { type: String, default: null },
    firstName:     { type: String, required: true, trim: true },
    lastName:      { type: String, required: true, trim: true },
    dob:           { type: String, default: null },
    gender:        { type: String, enum: Object.values(Gender), default: null },
    phone:         { type: String, default: null },
    address:       { type: String, default: null },
    hireDate:      { type: String, default: null },
    qualification: { type: String, default: null },
    designation:   { type: String, default: null },
    deptId:        { type: String, default: null, index: true },
    isActive:      { type: Boolean, default: true,  index: true },
    isVerified:    { type: Boolean, default: false },
    isFirstTime:   { type: Boolean, default: true  },
    lastLogin:     { type: Date,    default: null  },
    createdBy:     { type: String,  required: true },
  },
  { timestamps: true, versionKey: false },
)

TeacherSchema.index({ firstName: 'text', lastName: 'text', email: 'text' })
TeacherSchema.index({ deptId: 1, isActive: 1 })

export const TeacherModel = mongoose.model<ITeacherDocument>('Teacher', TeacherSchema)