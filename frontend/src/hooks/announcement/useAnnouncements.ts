import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient }           from '@/lib/query-client'
import { AnnouncementQueryParams, CreateAnnouncementInput, UpdateAnnouncementInput } from '@/types/announcement.types'
import { announcementApi } from '@/api/announcement.api'

export const ANNOUNCEMENTS_KEY = ['announcements'] as const

export const useAnnouncements = (params?: AnnouncementQueryParams) =>
  useQuery({
    queryKey:  [...ANNOUNCEMENTS_KEY, params],
    queryFn:   () => announcementApi.getAll(params),
    staleTime: 1000 * 30,
  })

export const usePublicAnnouncements = () =>
  useQuery({
    queryKey:  [...ANNOUNCEMENTS_KEY, 'public'],
    queryFn:   () => announcementApi.getPublic(),
    staleTime: 1000 * 60 * 5,
  })

export const useCreateAnnouncement = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (data: CreateAnnouncementInput) =>
      announcementApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY })
      onSuccess?.()
    },
  })

export const useUpdateAnnouncement = (id: string) =>
  useMutation({
    mutationFn: (data: UpdateAnnouncementInput) =>
      announcementApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY })
    },
  })

export const usePublishAnnouncement = () =>
  useMutation({
    mutationFn: (id: string) => announcementApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY })
    },
  })

export const useUnpublishAnnouncement = () =>
  useMutation({
    mutationFn: (id: string) => announcementApi.unpublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY })
    },
  })

export const useTogglePin = () =>
  useMutation({
    mutationFn: (id: string) => announcementApi.togglePin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY })
    },
  })

export const useDeleteAnnouncement = () =>
  useMutation({
    mutationFn: (id: string) => announcementApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY })
    },
  })