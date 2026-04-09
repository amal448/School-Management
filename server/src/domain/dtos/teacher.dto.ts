export const TEACHER_LEVEL_LABELS = {
  primary: 'Primary (Grade 1-5)',
  middle: 'Middle (Grade 6-8)',
  secondary: 'Secondary (Grade 9-10)',
  higher_secondary: 'Higher Secondary (Grade 11-12)',
  all: 'All Levels',
} as const

export type TeacherLevel = keyof typeof TEACHER_LEVEL_LABELS

export interface RegisterTeacherDto {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  dob?: string
  gender?: string
  address?: string
  hireDate?: string
  qualification?: string
  designation?: string
  level: TeacherLevel   // ← add
  deptId: string
  deptName?: string         // ← assign department at creation
  subjectIds: string[]       // ← assign subjects at creation
}

export interface UpdateTeacherDto {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  qualification?: string
  designation?: string
  level?: TeacherLevel   // ← add
  subjectIds?: string[]       // ← add
}

export interface TeacherResponseDto {
  id: string
  email: string
  role: 'TEACHER'
  firstName: string
  lastName: string
  fullName: string
  dob?: string
  gender?: string
  phone?: string
  address?: string
  hireDate?: string
  qualification?: string
  designation?: string
  level?: TeacherLevel   // ← add
  deptId?: string
  subjectIds: string[]       // ← add
  isActive: boolean
  isVerified: boolean
  isFirstTime: boolean
  lastLogin?: Date
  createdAt: Date
}
export interface PaginatedTeachersDto {
  data: TeacherResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TeacherQueryDto {
  deptId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
