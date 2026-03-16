import mongoose, { Schema } from "mongoose";

// src/infrastructure/database/schemas/admin-whitelist.schema.ts
const AdminWhitelistSchema = new Schema({
  email:     { type: String, required: true, unique: true, lowercase: true },
  addedBy:   { type: String },   // who approved this email
  createdAt: { type: Date, default: Date.now },
});

export const AdminWhitelistModel = mongoose.model('AdminWhitelist', AdminWhitelistSchema);