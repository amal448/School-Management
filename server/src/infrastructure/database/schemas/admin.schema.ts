// src/infrastructure/database/schemas/admin.schema.ts
import mongoose, { Schema, Document } from 'mongoose';

// src/infrastructure/database/schemas/admin.schema.ts

export interface IAdminDocument extends Document {
  googleId?:     string
  email:         string
  firstName:     string
  lastName:      string
  avatar?:       string
  isActive:      boolean
  isVerified:    boolean   // ← add
  lastLogin?:    Date      // ← add
  createdAt:     Date
  updatedAt:     Date
}
const AdminSchema = new Schema<IAdminDocument>(
 {
    googleId:     { type: String, default: null, unique: true, sparse: true, index: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    avatar:       { type: String, default: null },
    isActive:     { type: Boolean, default: true, index: true },
    isVerified:   { type: Boolean, default: false },
    lastLogin:    { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

export const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);