import { z } from 'zod'

export const CreateDepartmentSchema = z.object({
    deptName: z.string().min(1).max(100),
    deptHeadId: z.string().optional(),
    description: z.string().optional(),
})

export const UpdateDepartmentSchema = z.object({
    deptName: z.string().min(1).max(100).optional(),
    deptHeadId: z.string().optional(),
    description: z.string().optional(),
})
