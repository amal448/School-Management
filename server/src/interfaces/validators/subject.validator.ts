import { z } from 'zod'

export const AllocateSubjectSchema = z.object({
    subjectId: z.string().min(1, 'Subject is required'),
    teacherId: z.string().min(1, 'Teacher is required'),
})

export const CreateSubjectSchema = z.object({
  subjectName: z.string().min(1).max(100),
  deptId:      z.string().min(1, 'Department is required'),
})

export const UpdateSubjectSchema = z.object({
  subjectName: z.string().min(1).max(100).optional(),
  deptId:      z.string().optional(),
})
