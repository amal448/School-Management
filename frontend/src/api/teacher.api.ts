import apiClient from './client'
import {
  CreateTeacherInput,
  UpdateTeacherInput,
  TeacherResponse,
  TeacherQueryParams,
  PaginatedTeachers,
} from '@/types/teacher.types'
import { ApiResponse } from '@/types/api.types'
import { ClassResponse } from '@/types/class.types'
import { ENDPOINTS } from '@/constants/endpoints'

export const teacherApi = {

  getAll: async (params?: TeacherQueryParams): Promise<PaginatedTeachers> => {
    const res = await apiClient.get<ApiResponse<PaginatedTeachers>>(
      ENDPOINTS.TEACHERS.BASE,
      { params },
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<TeacherResponse> => {
    const res = await apiClient.get<ApiResponse<TeacherResponse>>(
      ENDPOINTS.TEACHERS.BY_ID(id)
    )
    return res.data.data!
  },

  create: async (data: CreateTeacherInput): Promise<TeacherResponse> => {
    const res = await apiClient.post<ApiResponse<{ user: TeacherResponse }>>(
      ENDPOINTS.TEACHERS.BASE,
      data,
    )
    return res.data.data!.user
  },

  getMe: async (): Promise<TeacherResponse> => {
    const res = await apiClient.get<ApiResponse<TeacherResponse>>(
      ENDPOINTS.TEACHERS.ME
    )
    return res.data.data!
  },

  getMyClasses: async (): Promise<ClassResponse[]> => {
    const res = await apiClient.get<ApiResponse<ClassResponse[]>>(
      ENDPOINTS.TEACHERS.MY_CLASSES
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateTeacherInput): Promise<TeacherResponse> => {
    const res = await apiClient.patch<ApiResponse<TeacherResponse>>(
      ENDPOINTS.TEACHERS.BY_ID(id),
      data,
    )
    return res.data.data!
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.TEACHERS.BY_ID(id))
  },
  // Reactivate a deactivated teacher
  reactivate: async (id: string): Promise<void> => {
    await apiClient.patch(ENDPOINTS.TEACHERS.REACTIVATE(id))
  },

  assignDepartment: async (
    id: string,
    deptId: string,
  ): Promise<TeacherResponse> => {
    const res = await apiClient.patch<ApiResponse<TeacherResponse>>(
      ENDPOINTS.TEACHERS.DEPARTMENT(id),
      { deptId },
    )
    return res.data.data!
  },

  resetStudentPassword: async (studentId: string): Promise<{ firstTimeToken: string }> => {
    const res = await apiClient.post<ApiResponse<{ firstTimeToken: string }>>(
      ENDPOINTS.STUDENTS.RESET_PASSWORD(studentId)
    )
    return res.data.data!
  },

  getBySubject: async (subjectId: string): Promise<TeacherResponse[]> => {
    const res = await apiClient.get<ApiResponse<TeacherResponse[]>>(
      ENDPOINTS.TEACHERS.BY_SUBJECT(subjectId)
    )
    return res.data.data!
  },

  getByLevel: async (level: string): Promise<TeacherResponse[]> => {
    const res = await apiClient.get<ApiResponse<TeacherResponse[]>>(
      ENDPOINTS.TEACHERS.BY_LEVEL(level)
    )
    return res.data.data!
  },

}