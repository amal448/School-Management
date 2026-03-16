// src/infrastructure/database/schemas/admin.schema.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminDocument extends Document {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDocument>(
  {
    googleId:  { type: String, required: true, unique: true, index: true },
    email:     { type: String, required: true, unique: true, lowercase: true, index: true },
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    avatar:    { type: String, default: null },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

export const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);