import apiClient from './client'
import {
  CreateTeacherInput,
  UpdateTeacherInput,
  TeacherResponse,
  TeacherQueryParams,
  PaginatedTeachers,
} from '@/types/teacher.types'
import { ApiResponse } from '@/types/api.types'

export const teacherApi = {

  getAll: async (params?: TeacherQueryParams): Promise<PaginatedTeachers> => {
    const res = await apiClient.get<ApiResponse<PaginatedTeachers>>(
      '/api/teachers',
      { params },
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<TeacherResponse> => {
    const res = await apiClient.get<ApiResponse<TeacherResponse>>(
      `/api/teachers/${id}`
    )
    return res.data.data!
  },

  create: async (data: CreateTeacherInput): Promise<TeacherResponse> => {
    const res = await apiClient.post<ApiResponse<{ user: TeacherResponse }>>(
      '/api/teachers',
      data,
    )
    return res.data.data!.user
  },

  update: async (id: string, data: UpdateTeacherInput): Promise<TeacherResponse> => {
    const res = await apiClient.patch<ApiResponse<TeacherResponse>>(
      `/api/teachers/${id}`,
      data,
    )
    return res.data.data!
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/teachers/${id}`)
  },
  // Reactivate a deactivated teacher
  reactivate: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/teachers/${id}/reactivate`)
  },

  assignDepartment: async (
    id: string,
    deptId: string,
  ): Promise<TeacherResponse> => {
    const res = await apiClient.patch<ApiResponse<TeacherResponse>>(
      `/api/teachers/${id}/department`,
      { deptId },
    )
    return res.data.data!
  },

  resetStudentPassword: async (studentId: string): Promise<{ firstTimeToken: string }> => {
    const res = await apiClient.post<ApiResponse<{ firstTimeToken: string }>>(
      `/api/auth/students/${studentId}/reset-password`
    )
    return res.data.data!
  },
}