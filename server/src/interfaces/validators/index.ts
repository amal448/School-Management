// src/interfaces/validators/index.ts
import { z } from 'zod';
import { Gender, Role } from '../../domain/enums/index';

// ── Shared ─────────────────────────────────────────────
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Password must include uppercase, lowercase, number, and special character (@$!%*?&)',
  );

const genderEnum = z.nativeEnum(Gender).optional();

const paginationSchema = {
  page:  z.string().optional().transform(v => v ? parseInt(v, 10) : 1),
  limit: z.string().optional().transform(v => v ? parseInt(v, 10) : 10),
  search: z.string().optional(),
  isActive: z.string().optional().transform(v =>
    v === 'true' ? true : v === 'false' ? false : undefined
  ),
};

// ── Auth ───────────────────────────────────────────────
export const LoginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  role:     z.nativeEnum(Role, { errorMap: () => ({ message: 'Role must be MANAGER, TEACHER, or STUDENT' }) }),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     passwordSchema,
});

// ── Manager ────────────────────────────────────────────
export const RegisterManagerSchema = z.object({
  email:     z.string().email(),
  password:  passwordSchema,
  firstName: z.string().min(1).max(60),
  lastName:  z.string().min(1).max(60),
  phone:     z.string().optional(),
});

export const UpdateManagerSchema = z.object({
  firstName: z.string().min(1).max(60).optional(),
  lastName:  z.string().min(1).max(60).optional(),
  phone:     z.string().optional(),
});

// ── Teacher ────────────────────────────────────────────
export const RegisterTeacherSchema = z.object({
  email:         z.string().email(),
  password:      passwordSchema,
  firstName:     z.string().min(1).max(60),
  lastName:      z.string().min(1).max(60),
  dob:           z.string().optional(),
  gender:        genderEnum,
  phone:         z.string().optional(),
  address:       z.string().optional(),
  hireDate:      z.string().optional(),
  qualification: z.string().optional(),
  designation:   z.string().optional(),
  deptId:        z.string().optional(),
});

export const UpdateTeacherSchema = z.object({
  firstName:     z.string().min(1).max(60).optional(),
  lastName:      z.string().min(1).max(60).optional(),
  phone:         z.string().optional(),
  address:       z.string().optional(),
  dob:           z.string().optional(),
  gender:        genderEnum,
  qualification: z.string().optional(),
  designation:   z.string().optional(),
});

export const AssignDeptSchema = z.object({
  deptId: z.string().min(1, 'Department ID is required'),
});

export const TeacherQuerySchema = z.object({
  ...paginationSchema,
  deptId: z.string().optional(),
});

// ── Student ────────────────────────────────────────────
export const RegisterStudentSchema = z.object({
  email:           z.string().email(),
  password:        passwordSchema,
  firstName:       z.string().min(1).max(60),
  lastName:        z.string().min(1).max(60),
  dob:             z.string().optional(),
  gender:          genderEnum,
  address:         z.string().optional(),
  admissionDate:   z.string().optional(),
  guardianName:    z.string().optional(),
  guardianContact: z.string().optional(),
  classId:         z.string().optional(),
});

export const UpdateStudentSchema = z.object({
  firstName:       z.string().min(1).max(60).optional(),
  lastName:        z.string().min(1).max(60).optional(),
  phone:           z.string().optional(),
  address:         z.string().optional(),
  dob:             z.string().optional(),
  gender:          genderEnum,
  guardianName:    z.string().optional(),
  guardianContact: z.string().optional(),
});

export const AssignClassSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
});

export const StudentQuerySchema = z.object({
  ...paginationSchema,
  classId: z.string().optional(),
});

// src/interfaces/validators/index.ts  (add this)
export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp:   z.string().length(6, 'OTP must be 6 digits'),
  role:  z.enum(['TEACHER', 'MANAGER'], {
    errorMap: () => ({ message: "Role must be TEACHER or MANAGER" }),
  }),
})

// src/interfaces/validators/index.ts
// Add these exports — keep all your existing exports, just add these

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
  role:  z.enum(['ADMIN', 'MANAGER'], {
    errorMap: () => ({ message: "Role must be ADMIN or MANAGER" }),
  }),
})

export const ResetPasswordSchema = z.object({
  token:       z.string().min(1, 'Token is required'),
  role:        z.enum(['ADMIN', 'MANAGER'], {
    errorMap: () => ({ message: "Role must be ADMIN or MANAGER" }),
  }),
  newPassword: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must include uppercase, lowercase, number and special character',
    ),
})

export const FirstTimeSetupSchema = z.object({
  token:       z.string().min(1, 'Token is required'),
  role:        z.enum(['TEACHER', 'STUDENT'], {
    errorMap: () => ({ message: "Role must be TEACHER or STUDENT" }),
  }),
  newPassword: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must include uppercase, lowercase, number and special character',
    ),
})