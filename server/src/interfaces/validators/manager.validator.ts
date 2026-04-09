import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Password must include uppercase, lowercase, number and special character',
  )

export const CreateManagerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(60),
  lastName: z.string().min(1, 'Last name is required').max(60),
  phone: z.string().min(10, 'Phone number is required').max(12),
})

export const UpdateManagerSchema = z.object({
  firstName: z.string().min(1).max(60).optional(),
  lastName: z.string().min(1).max(60).optional(),
  phone: z.string().min(10, 'Phone number is required').max(12),

})

export const ManagerQuerySchema = z.object({
  isActive: z.string().optional().transform(v =>
    v === 'true' ? true : v === 'false' ? false : undefined
  ),
  isBlocked: z.string().optional().transform(v =>
    v === 'true' ? true : v === 'false' ? false : undefined
  ),
  search: z.string().optional(),
  page: z.string().optional().transform(v => v ? parseInt(v, 10) : 1),
  limit: z.string().optional().transform(v => v ? parseInt(v, 10) : 10),
})