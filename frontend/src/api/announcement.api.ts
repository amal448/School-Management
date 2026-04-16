import apiClient from './client'
import { ApiResponse } from '@/types/api.types'
import { AnnouncementResponse,CreateAnnouncementInput,
  UpdateAnnouncementInput,
  AnnouncementQueryParams,
  PaginatedAnnouncements, } from '@/types/announcement.types'

export const announcementApi = {

  getAll: async (
    params?: AnnouncementQueryParams,
  ): Promise<PaginatedAnnouncements> => {
    const res = await apiClient.get<ApiResponse<PaginatedAnnouncements>>(
      '/api/announcements', { params }
    )
    return res.data.data!
  },

  getPublic: async (): Promise<AnnouncementResponse[]> => {
    const res = await apiClient.get<ApiResponse<AnnouncementResponse[]>>(
      '/api/announcements/public'
    )
    return res.data.data!
  },

  create: async (
    data: CreateAnnouncementInput,
  ): Promise<AnnouncementResponse> => {
    const res = await apiClient.post<ApiResponse<AnnouncementResponse>>(
      '/api/announcements', data
    )
    return res.data.data!
  },

  update: async (
    id:   string,
    data: UpdateAnnouncementInput,
  ): Promise<AnnouncementResponse> => {
    const res = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      `/api/announcements/${id}`, data
    )
    return res.data.data!
  },

  publish: async (id: string): Promise<AnnouncementResponse> => {
    const res = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      `/api/announcements/${id}/publish`
    )
    return res.data.data!
  },

  unpublish: async (id: string): Promise<AnnouncementResponse> => {
    const res = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      `/api/announcements/${id}/unpublish`
    )
    return res.data.data!
  },

  togglePin: async (id: string): Promise<AnnouncementResponse> => {
    const res = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      `/api/announcements/${id}/pin`
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/announcements/${id}`)
  },
}