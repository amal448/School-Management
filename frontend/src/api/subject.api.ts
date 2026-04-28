import apiClient from './client'
import {
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectResponse,
  SubjectQueryParams,
  PaginatedSubjects,
} from '@/types/subject.types'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/constants/endpoints'

export const subjectApi = {

  getAll: async (params?: SubjectQueryParams): Promise<PaginatedSubjects> => {
    const res = await apiClient.get<ApiResponse<PaginatedSubjects>>(
      ENDPOINTS.SUBJECTS.BASE, { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<SubjectResponse> => {
    const res = await apiClient.get<ApiResponse<SubjectResponse>>(
      ENDPOINTS.SUBJECTS.BY_ID(id)
    )
    return res.data.data!
  },

  create: async (data: CreateSubjectInput): Promise<SubjectResponse> => {
    const res = await apiClient.post<ApiResponse<SubjectResponse>>(
      ENDPOINTS.SUBJECTS.BASE, data
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateSubjectInput): Promise<SubjectResponse> => {
    const res = await apiClient.patch<ApiResponse<SubjectResponse>>(
      ENDPOINTS.SUBJECTS.BY_ID(id), data
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.SUBJECTS.BY_ID(id))
  },
}