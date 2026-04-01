import { z }                    from 'zod'
import {  ExamType }       from 'src/domain/enums'

 const subjectScheduleShape = {
  subjectId:    z.string().min(1),
   examDate:     z.string().min(1, 'Exam date is required'),
  startTime:    z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
  endTime:      z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
  totalMarks:   z.number({ coerce: true }).positive(),
  passingMarks: z.number({ coerce: true }).positive()
}

export const CreateExamSchema = z.object({
  examName:     z.string().min(1),
  examType:     z.nativeEnum(ExamType),
  academicYear: z.string().min(4),
  startDate:    z.string().transform((v) => new Date(v)),
  endDate:      z.string().transform((v) => new Date(v)),
  grades:       z.array(z.string()).min(1, 'Select at least one grade'),
})

export const AddCommonSubjectSchema = z.object({
 grade: z.string().min(1, 'Grade is required'),
  ...subjectScheduleShape,
})

export const UpdateCommonSubjectSchema = z.object({
  grade:         z.string().min(1),
  subjectId:     z.string().min(1),
  examDate:      z.string().transform((v) => new Date(v)).optional(),
  startTime:     z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime:       z.string().regex(/^\d{2}:\d{2}$/).optional(),
  totalMarks:    z.number().positive().optional(),
  passingMarks:  z.number().positive().optional(),
})

export const AddSectionLanguageSchema = z.object({
  grade:   z.string().min(1),
  classId: z.string().min(1),
  ...subjectScheduleShape,
})

export const EnterMarksSchema = z.object({
  scheduleId: z.string().min(1),
  entries: z.array(z.object({
    studentId:   z.string(),
    marksScored: z.number().min(0),
    isAbsent:    z.boolean(),
  })).min(1),
})