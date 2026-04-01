import mongoose, { Schema, Document } from 'mongoose'
import { ExamType, ExamStatus }       from 'src/domain/enums'

export interface ISubjectScheduleDocument {
  subjectId:    string
  examDate:     Date
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}

export interface ISectionLanguageDocument extends ISubjectScheduleDocument {
  classId: string   // which section this language belongs to
}

export interface IGradeConfigDocument {
  grade:            string
  commonSubjects:   ISubjectScheduleDocument[]
  sectionLanguages: ISectionLanguageDocument[]
}

export interface IExamDocument extends Document {
  examName:     string
  examType:     ExamType
  academicYear: string
  startDate:    Date
  endDate:      Date
  status:       ExamStatus
  gradeConfigs: IGradeConfigDocument[]
  createdBy:    string
  createdAt:    Date
  updatedAt:    Date
}

const SubjectScheduleSchema = new Schema<ISubjectScheduleDocument>(
  {
    subjectId:    { type: String, required: true },
    examDate:     { type: Date,   required: true },
    startTime:    { type: String, required: true },
    endTime:      { type: String, required: true },
    totalMarks:   { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 35  },
  },
  { _id: false },
)

const SectionLanguageSchema = new Schema<ISectionLanguageDocument>(
  {
    classId:      { type: String, required: true },
    subjectId:    { type: String, required: true },
    examDate:     { type: Date,   required: true },
    startTime:    { type: String, required: true },
    endTime:      { type: String, required: true },
    totalMarks:   { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 35  },
  },
  { _id: false },
)

const GradeConfigSchema = new Schema<IGradeConfigDocument>(
  {
    grade:            { type: String, required: true },
    commonSubjects:   { type: [SubjectScheduleSchema],  default: [] },
    sectionLanguages: { type: [SectionLanguageSchema],  default: [] },
  },
  { _id: false },
)

const ExamSchema = new Schema<IExamDocument>(
  {
    examName:     { type: String, required: true, trim: true },
    examType:     { type: String, enum: Object.values(ExamType), required: true },
    academicYear: { type: String, required: true },
    startDate:    { type: Date, required: true },
    endDate:      { type: Date, required: true },
    status:       {
      type:    String,
      enum:    Object.values(ExamStatus),
      default: ExamStatus.DRAFT,
      index:   true,
    },
    gradeConfigs: { type: [GradeConfigSchema], default: [] },
    createdBy:    { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
)

ExamSchema.index({ academicYear: 1, status: 1 })

export const ExamModel = mongoose.model<IExamDocument>('Exam', ExamSchema)