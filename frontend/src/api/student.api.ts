import apiClient from './client'
import {
  CreateStudentInput,
  UpdateStudentInput,
  StudentResponse,
  StudentQueryParams,
  PaginatedStudents,
} from '@/types/student.types'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/constants/endpoints'

export interface StudentSearchResult {
  id:       string
  fullName: string
  email:    string
  classId?: string
}

export const studentApi = {

  getAll: async (params?: StudentQueryParams): Promise<PaginatedStudents> => {
    const res = await apiClient.get<ApiResponse<PaginatedStudents>>(
      ENDPOINTS.STUDENTS.BASE, { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<StudentResponse> => {
    const res = await apiClient.get<ApiResponse<StudentResponse>>(
      ENDPOINTS.STUDENTS.BY_ID(id)
    )
    return res.data.data!
  },

  create: async (data: CreateStudentInput): Promise<StudentResponse> => {
    const res = await apiClient.post<ApiResponse<{ student: StudentResponse }>>(
      ENDPOINTS.STUDENTS.BASE, data
    )
    return res.data.data!.student
  },

  update: async (id: string, data: UpdateStudentInput): Promise<StudentResponse> => {
    const res = await apiClient.patch<ApiResponse<StudentResponse>>(
      ENDPOINTS.STUDENTS.BY_ID(id), data
    )
    return res.data.data!
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.STUDENTS.BY_ID(id))
  },

  assignToClass: async (studentId: string, classId: string): Promise<void> => {
    await apiClient.patch(ENDPOINTS.STUDENTS.ASSIGN_CLASS(studentId), { classId })
  },

  getByClass: async (classId: string): Promise<StudentResponse[]> => {
    const res = await apiClient.get<ApiResponse<PaginatedStudents>>(
      ENDPOINTS.STUDENTS.BASE, { params: { classId, limit: 100 } }
    )
    return res.data.data?.data ?? []
  },

  search: async (query: string): Promise<StudentSearchResult[]> => {
    const res = await apiClient.get<ApiResponse<PaginatedStudents>>(
      ENDPOINTS.STUDENTS.BASE, { params: { search: query, limit: 20 } }
    )
    return (res.data.data?.data ?? []).map((s) => ({
      id:       s.id,
      fullName: s.fullName,
      email:    s.email,
      classId:  s.classId,
    }))
  },

  // Add to studentApi object
resetPassword: async (
  studentId:   string,
  newPassword: string,
): Promise<void> => {
  await apiClient.post(
    ENDPOINTS.STUDENTS.RESET_PASSWORD(studentId),
    { newPassword },
  )
},
}