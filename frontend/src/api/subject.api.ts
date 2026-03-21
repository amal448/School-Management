import apiClient from './client'
import {
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectResponse,
  SubjectQueryParams,
  PaginatedSubjects,
} from '@/types/subject.types'
import { ApiResponse } from '@/types/api.types'

export const subjectApi = {

  getAll: async (params?: SubjectQueryParams): Promise<PaginatedSubjects> => {
    const res = await apiClient.get<ApiResponse<PaginatedSubjects>>(
      '/api/subjects', { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<SubjectResponse> => {
    const res = await apiClient.get<ApiResponse<SubjectResponse>>(
      `/api/subjects/${id}`
    )
    return res.data.data!
  },

  create: async (data: CreateSubjectInput): Promise<SubjectResponse> => {
    const res = await apiClient.post<ApiResponse<SubjectResponse>>(
      '/api/subjects', data
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateSubjectInput): Promise<SubjectResponse> => {
    const res = await apiClient.patch<ApiResponse<SubjectResponse>>(
      `/api/subjects/${id}`, data
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/subjects/${id}`)
  },
}