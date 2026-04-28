import apiClient from './client'
import { ApiResponse } from '@/types/api.types'
import { AnnouncementResponse,CreateAnnouncementInput,
  UpdateAnnouncementInput,
  AnnouncementQueryParams,
  PaginatedAnnouncements, } from '@/types/announcement.types'
import { ENDPOINTS } from '@/constants/endpoints'

export const announcementApi = {

  getAll: async (
    params?: AnnouncementQueryParams,
  ): Promise<PaginatedAnnouncements> => {
    const res = await apiClient.get<ApiResponse<PaginatedAnnouncements>>(
      ENDPOINTS.ANNOUNCEMENTS.BASE, { params }
    )
    return res.data.data!
  },

  getPublic: async (): Promise<AnnouncementResponse[]> => {
    const res = await apiClient.get<ApiResponse<AnnouncementResponse[]>>(
      ENDPOINTS.ANNOUNCEMENTS.PUBLIC
    )
    return res.data.data!
  },

  create: async (
    data: CreateAnnouncementInput,
  ): Promise<AnnouncementResponse> => {
    const res = await apiClient.post<ApiResponse<AnnouncementResponse>>(
      ENDPOINTS.ANNOUNCEMENTS.BASE, data
    )
    return res.data.data!
  },

  update: async (
    id:   string,
    data: UpdateAnnouncementInput,
  ): Promise<AnnouncementResponse> => {
    const res = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      ENDPOINTS.ANNOUNCEMENTS.BY_ID(id), data
    )
    return res.data.data!
  },

  publish: async (id: string): Promise<AnnouncementResponse> => {
    const res = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      ENDPOINTS.ANNOUNCEMENTS.PUBLISH(id)
    )
    return res.data.data!
  },

  unpublish: async (id: string): Promise<AnnouncementResponse> => {
    const res = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      ENDPOINTS.ANNOUNCEMENTS.UNPUBLISH(id)
    )
    return res.data.data!
  },

  togglePin: async (id: string): Promise<AnnouncementResponse> => {
    const res = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      ENDPOINTS.ANNOUNCEMENTS.PIN(id)
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.ANNOUNCEMENTS.BY_ID(id))
  },
}