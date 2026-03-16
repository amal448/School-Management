// src/infrastructure/database/schemas/student.schema.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Gender } from '../../../domain/enums/index';

export interface IStudentDocument extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  admissionDate?: string;
  guardianName?: string;
  guardianContact?: string;
  classId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudentDocument>(
  {
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash:    { type: String, required: true },
    firstName:       { type: String, required: true, trim: true },
    lastName:        { type: String, required: true, trim: true },
    dob:             { type: String, default: null },
    gender:          { type: String, enum: Object.values(Gender), default: null },
    phone:           { type: String, default: null },
    address:         { type: String, default: null },
    admissionDate:   { type: String, default: null },
    guardianName:    { type: String, default: null },
    guardianContact: { type: String, default: null },
    classId:         { type: String, default: null, index: true },
    isActive:        { type: Boolean, default: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

StudentSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
StudentSchema.index({ classId: 1, isActive: 1 });

export const StudentModel = mongoose.model<IStudentDocument>('Student', StudentSchema);
