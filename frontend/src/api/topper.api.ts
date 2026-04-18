import apiClient from './client'
import { ApiResponse } from '@/types/api.types'
import {
  TopperResponse,
  CreateTopperInput,
  UpdateTopperInput,
  PaginatedToppers,
  ToppersByGrade,
} from '@/types/topper.types'

export const topperApi = {

  getAll: async (params?: {
    grade?: string; academicYear?: string; isPublished?: boolean
  }): Promise<PaginatedToppers> => {
    const res = await apiClient.get<ApiResponse<PaginatedToppers>>(
      '/api/toppers', { params }
    )
    return res.data.data!
  },

  getPublic: async (): Promise<ToppersByGrade> => {
    const res = await apiClient.get<ApiResponse<ToppersByGrade>>(
      '/api/toppers/public'
    )
    return res.data.data!
  },



  create: async (data: CreateTopperInput): Promise<TopperResponse> => {
    const res = await apiClient.post<ApiResponse<TopperResponse>>(
      '/api/toppers', data
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateTopperInput): Promise<TopperResponse> => {
    const res = await apiClient.patch<ApiResponse<TopperResponse>>(
      `/api/toppers/${id}`, data
    )
    return res.data.data!
  },

  publish: async (id: string): Promise<TopperResponse> => {
    const res = await apiClient.patch<ApiResponse<TopperResponse>>(
      `/api/toppers/${id}/publish`
    )
    return res.data.data!
  },

  unpublish: async (id: string): Promise<TopperResponse> => {
    const res = await apiClient.patch<ApiResponse<TopperResponse>>(
      `/api/toppers/${id}/unpublish`
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/toppers/${id}`)
  },

  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('image', file)
    const res = await apiClient.post<ApiResponse<{ url: string }>>(
      '/api/upload/image', form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data.data!.url
  },
}