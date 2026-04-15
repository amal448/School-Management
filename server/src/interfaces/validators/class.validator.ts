import { z } from 'zod'

export const CreateClassSchema = z.object({
  grade: z.string().min(1).max(20),
  section: z.string().min(1).max(10),
  classTeacherId: z.string().optional(),
  subjectAllocations: z.array(z.object({
    subjectId: z.string(),
    teacherId: z.string().optional(),
  })).optional(),
})

export const UpdateClassSchema = z.object({
  grade: z.string().min(1).max(20).optional(),
  section: z.string().min(1).max(10).optional(),
  classTeacherId: z.string().optional(),
  subjectAllocations: z.array(z.object({
    subjectId: z.string(),
    teacherId: z.string().optional(),
  })).optional(),
})
