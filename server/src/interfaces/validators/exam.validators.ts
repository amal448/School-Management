import { z }                    from 'zod'
import {  ExamType }       from 'src/domain/enums'


export const CreateExamSchema = z.object({
  examName:          z.string().min(1),
  examType:          z.nativeEnum(ExamType),
  academicYear:      z.string().min(4),
  startDate:         z.string().transform((v) => new Date(v)),
  endDate:           z.string().transform((v) => new Date(v)),
  applicableClasses: z.array(z.string()).min(1),
})

export const TimetableEntrySchema = z.object({
  subjectId:    z.string().min(1),
  examDate:     z.string().transform((v) => new Date(v)),
  startTime:    z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  endTime:      z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  totalMarks:   z.number().positive(),
  passingMarks: z.number().positive(),
})

export const EnterMarksSchema = z.object({
  scheduleId: z.string().min(1),
  entries: z.array(z.object({
    studentId:   z.string(),
    marksScored: z.number().min(0),
    isAbsent:    z.boolean(),
  })).min(1),
})
