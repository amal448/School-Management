export type TeacherLevel =
  | 'primary'
  | 'middle'
  | 'secondary'
  | 'higher_secondary'
  | 'all'

export const TEACHER_LEVEL_LABELS: Record<TeacherLevel, string> = {
  primary:          'Primary (Grade 1-5)',
  middle:           'Middle (Grade 6-8)',
  secondary:        'Secondary (Grade 9-10)',
  higher_secondary: 'Higher Secondary (Grade 11-12)',
  all:              'All Levels',
}


export interface TeacherResponse {
  id: string
  email: string
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
  deptId?: string
  isActive: boolean
  isVerified: boolean
  isFirstTime: boolean
  level?:      TeacherLevel   // ← add
  subjectIds:  string[]       // ← add
  lastLogin?: string
  createdBy: string
  createdAt: string
}

export interface CreateTeacherInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  dob?: string
  gender?: string
  address?: string
  hireDate?: string
  qualification?: string
  designation?: string
  level?: TeacherLevel
  deptId?: string
  subjectIds?: string[]
}

export interface UpdateTeacherInput {
  firstName?: string
  lastName?: string
  phone: string
  address?: string
  qualification?: string
  designation?: string
  level?: TeacherLevel
  subjectIds?: string[]
}

export interface TeacherQueryParams {
  page?: number
  limit?: number
  search?: string
  deptId?: string
  isActive?: boolean
}

export interface PaginatedTeachers {
  data: TeacherResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}
export interface EditTeacherForm {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  qualification?: string
  designation?: string
}
export interface TeacherTableProps {
  data: TeacherResponse[]
  isLoading: boolean
}