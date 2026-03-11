import { Schema, model } from 'mongoose';

const StudentSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  teacherId: { type: String, ref: 'Teacher', required: true },
  progressReports: [{ type: String }],
  password: { type: String, required: true }
}, { timestamps: true });

export const StudentModel = model('Student', StudentSchema);