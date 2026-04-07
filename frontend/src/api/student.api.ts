import apiClient from './client'
import {
  CreateStudentInput,
  UpdateStudentInput,
  StudentResponse,
  StudentQueryParams,
  PaginatedStudents,
} from '@/types/student.types'
import { ApiResponse } from '@/types/api.types'

export interface StudentSearchResult {
  id:       string
  fullName: string
  email:    string
  classId?: string
}

export const studentApi = {

  getAll: async (params?: StudentQueryParams): Promise<PaginatedStudents> => {
    const res = await apiClient.get<ApiResponse<PaginatedStudents>>(
      '/api/students', { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<StudentResponse> => {
    const res = await apiClient.get<ApiResponse<StudentResponse>>(
      `/api/students/${id}`
    )
    return res.data.data!
  },

  create: async (data: CreateStudentInput): Promise<StudentResponse> => {
    const res = await apiClient.post<ApiResponse<{ student: StudentResponse }>>(
      '/api/students', data
    )
    return res.data.data!.student
  },

  update: async (id: string, data: UpdateStudentInput): Promise<StudentResponse> => {
    const res = await apiClient.patch<ApiResponse<StudentResponse>>(
      `/api/students/${id}`, data
    )
    return res.data.data!
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/students/${id}`)
  },

  assignToClass: async (studentId: string, classId: string): Promise<void> => {
    await apiClient.patch(`/api/students/${studentId}/class`, { classId })
  },

  getByClass: async (classId: string): Promise<StudentResponse[]> => {
    const res = await apiClient.get<ApiResponse<PaginatedStudents>>(
      '/api/students', { params: { classId, limit: 100 } }
    )
    return res.data.data?.data ?? []
  },

  search: async (query: string): Promise<StudentSearchResult[]> => {
    const res = await apiClient.get<ApiResponse<PaginatedStudents>>(
      '/api/students', { params: { search: query, limit: 20 } }
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
    `/api/auth/students/${studentId}/reset-password`,
    { newPassword },
  )
},
}