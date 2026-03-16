// src/infrastructure/database/schemas/manager.schema.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IManagerDocument extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ManagerSchema = new Schema<IManagerDocument>(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    phone:        { type: String, default: null },
    isActive:     { type: Boolean, default: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

export const ManagerModel = mongoose.model<IManagerDocument>('Manager', ManagerSchema);
