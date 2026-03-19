// src/infrastructure/database/schemas/manager.schema.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IManagerDocument extends Document {
  email:          string
  passwordHash?:  string       // optional until first-time setup completes
  firstName:      string
  lastName:       string
  phone?:         string
  isActive:       boolean
  isVerified:     boolean      // true after first-time setup
  isFirstTime:    boolean      // true until manager sets their password
  isBlocked:      boolean      // admin can block manager
  blockedBy?:     string       // FK > admin.id
  blockedAt?:     Date
  lastLogin?:     Date
  createdByAdmin: string       // FK > admin.id — who created this manager
  createdAt:      Date
  updatedAt:      Date
}

const ManagerSchema = new Schema<IManagerDocument>(
  {
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash:   { type: String, default: null },
    firstName:      { type: String, required: true, trim: true },
    lastName:       { type: String, required: true, trim: true },
    phone:          { type: String, default: null },
    isActive:       { type: Boolean, default: true,  index: true },
    isVerified:     { type: Boolean, default: false },
    isFirstTime:    { type: Boolean, default: true  },
    isBlocked:      { type: Boolean, default: false, index: true },
    blockedBy:      { type: String,  default: null  },
    blockedAt:      { type: Date,    default: null  },
    lastLogin:      { type: Date,    default: null  },
    createdByAdmin: { type: String,  required: true },
  },
  { timestamps: true, versionKey: false },
)

ManagerSchema.index({ isActive: 1, isBlocked: 1 })

export const ManagerModel = mongoose.model<IManagerDocument>('Manager', ManagerSchema)