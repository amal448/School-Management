import apiClient from './client'
import {
  CreateClassInput,
  UpdateClassInput,
  AllocateSubjectInput,
  ClassResponse,
  ClassQueryParams,
  PaginatedClasses,
} from '@/types/class.types'
import { ApiResponse } from '@/types/api.types'

export const classApi = {

  getAll: async (params?: ClassQueryParams): Promise<PaginatedClasses> => {
    const res = await apiClient.get<ApiResponse<PaginatedClasses>>(
      '/api/classes', { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<ClassResponse> => {
    const res = await apiClient.get<ApiResponse<ClassResponse>>(
      `/api/classes/${id}`
    )
    return res.data.data!
  },

  create: async (data: CreateClassInput): Promise<ClassResponse> => {
    const res = await apiClient.post<ApiResponse<ClassResponse>>(
      '/api/classes', data
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateClassInput): Promise<ClassResponse> => {
    const res = await apiClient.patch<ApiResponse<ClassResponse>>(
      `/api/classes/${id}`, data
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/classes/${id}`)
  },

  allocateSubject: async (
    classId: string,
    data:    AllocateSubjectInput,
  ): Promise<ClassResponse> => {
    const res = await apiClient.post<ApiResponse<ClassResponse>>(
      `/api/classes/${classId}/subjects`, data
    )
    return res.data.data!
  },

  removeSubjectAllocation: async (
    classId:   string,
    subjectId: string,
  ): Promise<ClassResponse> => {
    const res = await apiClient.delete<ApiResponse<ClassResponse>>(
      `/api/classes/${classId}/subjects/${subjectId}`
    )
    return res.data.data!
  },
  assignSubjectTeacher:async(
    classId:string,
    subjectId:string,
    teacherId:string
  ):Promise<ClassResponse>=>{
    const res=await apiClient.patch<ApiResponse<ClassResponse>>(
      `/api/classes/${classId}/subjects/${subjectId}/teacher`, {teacherId}
    )
    return res.data.data!
  }
}