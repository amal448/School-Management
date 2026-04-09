// src/interfaces/validators/teacher.validators.ts

import z from "zod"

export const RegisterTeacherSchema = z.object({
  firstName:     z.string().min(1),
  lastName:      z.string().min(1),
  email:         z.string().email(),
  password:      z.string().min(8),
  phone:         z.string().optional(),
  dob:           z.string().optional(),
  gender:        z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address:       z.string().optional(),
  hireDate:      z.string().optional(),
  qualification: z.string().optional(),
  designation:   z.string().optional(),
  level:         z.enum([
    'primary', 'middle', 'secondary', 'higher_secondary', 'all'
  ]),
  deptId:      z.string(),
  subjectIds:  z.array(z.string()).default([]),
})

export const UpdateTeacherSchema = z.object({
  firstName:     z.string().min(1).optional(),
  lastName:      z.string().min(1).optional(),
  phone:         z.string().optional(),
  address:       z.string().optional(),
  qualification: z.string().optional(),
  designation:   z.string().optional(),
  level:         z.enum([
    'primary', 'middle', 'secondary', 'higher_secondary', 'all'
  ]).optional(),
  subjectIds:    z.array(z.string()).optional(),
})