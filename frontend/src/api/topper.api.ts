import apiClient from './client'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/constants/endpoints'
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
      ENDPOINTS.TOPPERS.BASE, { params }
    )
    return res.data.data!
  },

  getPublic: async (): Promise<ToppersByGrade> => {
    const res = await apiClient.get<ApiResponse<ToppersByGrade>>(
      ENDPOINTS.TOPPERS.PUBLIC
    )
    return res.data.data!
  },



  create: async (data: CreateTopperInput): Promise<TopperResponse> => {
    const res = await apiClient.post<ApiResponse<TopperResponse>>(
      ENDPOINTS.TOPPERS.BASE, data
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateTopperInput): Promise<TopperResponse> => {
    const res = await apiClient.patch<ApiResponse<TopperResponse>>(
      ENDPOINTS.TOPPERS.BY_ID(id), data
    )
    return res.data.data!
  },

  publish: async (id: string): Promise<TopperResponse> => {
    const res = await apiClient.patch<ApiResponse<TopperResponse>>(
      ENDPOINTS.TOPPERS.PUBLISH(id)
    )
    return res.data.data!
  },

  unpublish: async (id: string): Promise<TopperResponse> => {
    const res = await apiClient.patch<ApiResponse<TopperResponse>>(
      ENDPOINTS.TOPPERS.UNPUBLISH(id)
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.TOPPERS.BY_ID(id))
  },

  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('image', file)
    const res = await apiClient.post<ApiResponse<{ url: string }>>(
      ENDPOINTS.TOPPERS.UPLOAD_IMAGE, form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data.data!.url
  },
}